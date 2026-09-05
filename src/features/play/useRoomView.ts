import { useCallback, useEffect, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { PlayerRoomDocument } from "./generated";
import type { PlayerRoomFragment } from "./generated";

const POLL_INTERVAL_MS = 2000;
const ACCESS_ERRORS = new Set(["UNAUTHENTICATED", "FORBIDDEN", "ROOM_UNAVAILABLE"]);
type RoomViewState = {
  scope: string;
  view: PlayerRoomFragment | null;
  status: "loading" | "ready" | "reconnecting" | "error";
  error: string | null;
};
type RoomViewResult = Omit<RoomViewState, "scope"> & { refresh: () => void };

/** One serialized request loop per authenticated room view, without Apollo cache mixing. */
export function useRoomView(roomId: string, viewerId: string): RoomViewResult {
  const client = useApolloClient();
  const scope = JSON.stringify([roomId, viewerId]);
  const [state, setState] = useState<RoomViewState>({ scope, view: null, status: "loading", error: null });
  const requestRefresh = useRef<() => void>(() => {});
  const refresh = useCallback((): void => requestRefresh.current(), []);

  useEffect(() => {
    let disposed = false;
    let running = false;
    let queued = false;
    let accessDenied = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let controller: AbortController | undefined;
    setState({ scope, view: null, status: "loading", error: null });

    const poll = async (): Promise<void> => {
      if (disposed || !roomId || !viewerId) return;
      if (running) { queued = true; return; }
      clearTimeout(timeout);
      running = true;
      queued = false;
      accessDenied = false;
      controller = new AbortController();
      try {
        const { data } = await client.query({
          query: PlayerRoomDocument, variables: { roomId }, fetchPolicy: "no-cache",
          context: { queryDeduplication: false, fetchOptions: { signal: controller.signal } },
        });
        if (disposed) return;
        const view = data?.gameView;
        if (!view || view.roomId !== roomId || !Number.isSafeInteger(view.revision) || view.revision < 0) {
          accessDenied = true;
          throw new Error("The server returned an invalid room view.");
        }
        setState((previous) => {
          if (previous.scope === scope && previous.view && previous.view.revision > view.revision)
            return { ...previous, status: "ready", error: null };
          return { scope, view, status: "ready", error: null };
        });
      } catch (error) {
        if (disposed) return;
        if (CombinedGraphQLErrors.is(error))
          accessDenied = error.errors.some((item) => typeof item.extensions?.code === "string" && ACCESS_ERRORS.has(item.extensions.code));
        const message = error instanceof Error ? error.message : "Unable to refresh this room.";
        const denied = accessDenied;
        setState((previous) => ({
          scope, view: !denied && previous.scope === scope ? previous.view : null,
          status: denied ? "error" : "reconnecting", error: message,
        }));
      } finally {
        running = false;
        if (!disposed && !accessDenied) timeout = setTimeout(() => { poll(); }, queued ? 0 : POLL_INTERVAL_MS);
      }
    };
    const request = (): void => { poll(); };
    requestRefresh.current = request;
    window.addEventListener("online", request);
    poll();
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller?.abort();
      window.removeEventListener("online", request);
      requestRefresh.current = () => {};
    };
  }, [client, roomId, viewerId, scope]);

  if (state.scope !== scope || !roomId || !viewerId)
    return { view: null, status: "loading", error: null, refresh };
  return { view: state.view, status: state.status, error: state.error, refresh };
}
