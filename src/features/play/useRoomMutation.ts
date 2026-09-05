import { useEffect, useRef, useState } from "react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";

/** A definitive failed operation is safe to retry with a fresh request identity. */
export class CompletedOperationError extends Error {}

type MutationState = { context: string; pending: boolean; error: string | null };
type MutationRunner = <Result>(operationKey: string, execute: (requestId: string) => Promise<Result>) => Promise<Result | undefined>;
type MutationResult = { pending: boolean; error: string | null; run: MutationRunner };

/** Retain uncertain request IDs across retries/reloads; callers include user and room in context. */
export function useRoomMutation(context: string): MutationResult {
  const current = useRef({ context, epoch: 0, pending: false, requests: new Map<string, string>() });
  const [state, setState] = useState<MutationState>({ context, pending: false, error: null });
  useEffect(() => {
    const epoch = current.current.epoch + 1;
    current.current = { context, epoch, pending: false, requests: new Map() };
    setState({ context, pending: false, error: null });
    return () => { current.current.epoch += 1; };
  }, [context]);

  const run: MutationRunner = async (operationKey, execute) => {
    const active = current.current;
    if (!context || active.context !== context || active.pending) return undefined;
    const { epoch } = active;
    const storageKey = `daicer:request:${JSON.stringify([context, operationKey])}`;
    let requestId = active.requests.get(operationKey);
    try { requestId ??= sessionStorage.getItem(storageKey) ?? undefined; } catch { /* Memory retries remain available. */ }
    requestId ??= crypto.randomUUID();
    active.requests.set(operationKey, requestId);
    try { sessionStorage.setItem(storageKey, requestId); } catch { /* Private storage may be disabled. */ }
    active.pending = true;
    setState({ context, pending: true, error: null });
    const isCurrent = (): boolean => current.current === active && active.epoch === epoch;
    const forgetRequest = (): void => {
      active.requests.delete(operationKey);
      try { sessionStorage.removeItem(storageKey); } catch { /* Storage is optional. */ }
    };
    try {
      const result = await execute(requestId);
      if (!isCurrent()) return undefined;
      forgetRequest();
      return result;
    } catch (error) {
      if (isCurrent()) {
        if (error instanceof CompletedOperationError || (CombinedGraphQLErrors.is(error) &&
          error.errors.some((item) => item.extensions?.code === "OPERATION_FAILED"))) forgetRequest();
        setState({ context, pending: false, error: error instanceof Error ? error.message : "The request failed. Please retry." });
      }
      return undefined;
    } finally {
      if (isCurrent()) {
        active.pending = false;
        setState((previous) => ({ ...previous, pending: false }));
      }
    }
  };
  return { pending: state.context === context && state.pending, error: state.context === context ? state.error : null, run };
}
