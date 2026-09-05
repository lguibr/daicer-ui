import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { CompletedOperationError, useRoomMutation } from "../useRoomMutation";

describe("room mutation identity", () => {
  beforeEach(() => { sessionStorage.clear(); });

  it.each([
    new CompletedOperationError("Operation failed"),
    new CombinedGraphQLErrors({ errors: [{ message: "Operation failed", extensions: { code: "OPERATION_FAILED" } }] }),
  ])("retires definitive failures in memory and storage", async (failure) => {
    const execute = vi.fn<(id: string) => Promise<string>>().mockRejectedValueOnce(failure).mockResolvedValue("complete");
    const { result } = renderHook(() => useRoomMutation("viewer:room"));
    await act(async () => { await result.current.run("start", execute); });
    expect(sessionStorage.length).toBe(0);
    expect(result.current.error).toBe("Operation failed");
    await act(async () => { await result.current.run("start", execute); });
    expect(execute.mock.calls[1]?.[0]).not.toBe(execute.mock.calls[0]?.[0]);
  });

  it("does not retire or expose definitive failures after changing viewers", async () => {
    let reject: (reason: Error) => void = () => {};
    const execute = vi.fn<(id: string) => Promise<string>>().mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }))
      .mockResolvedValue("complete");
    const { result, rerender } = renderHook(({ context }) => useRoomMutation(context), { initialProps: { context: "a:room" } });
    let pending: Promise<string | undefined> = Promise.resolve(undefined);
    act(() => { pending = result.current.run("start", execute); });
    rerender({ context: "b:room" });
    await act(async () => { reject(new CompletedOperationError("Old failure")); await pending; });
    expect(sessionStorage.length).toBe(1);
    expect(result.current.error).toBeNull();
    rerender({ context: "a:room" });
    await act(async () => { await result.current.run("start", execute); });
    expect(execute.mock.calls[1]?.[0]).toBe(execute.mock.calls[0]?.[0]);
  });

  it("reuses uncertain request IDs, including remount, and retires successful IDs", async () => {
    const execute = vi.fn<(id: string) => Promise<string>>().mockRejectedValueOnce(new Error("Offline"));
    const first = renderHook(() => useRoomMutation("viewer:room"));
    await act(async () => { await first.result.current.run("pass:1", execute); });
    expect(first.result.current.error).toBe("Offline");
    const requestId = execute.mock.calls[0]?.[0];
    first.unmount();
    const second = renderHook(() => useRoomMutation("viewer:room"));
    execute.mockResolvedValue("accepted");
    await act(async () => { expect(await second.result.current.run("pass:1", execute)).toBe("accepted"); });
    expect(execute.mock.calls[1]?.[0]).toBe(requestId);
    await act(async () => { await second.result.current.run("pass:1", execute); });
    expect(execute.mock.calls[2]?.[0]).not.toBe(requestId);
  });

  it("separates changed inputs and viewers", async () => {
    const execute = vi.fn<(id: string) => Promise<string>>().mockRejectedValue(new Error("Offline"));
    const { result, rerender } = renderHook(({ context }) => useRoomMutation(context), { initialProps: { context: "a:room" } });
    await act(async () => { await result.current.run("intent:1:move", execute); });
    await act(async () => { await result.current.run("intent:1:attack", execute); });
    rerender({ context: "b:room" });
    await act(async () => { await result.current.run("intent:1:move", execute); });
    expect(new Set(execute.mock.calls.map(([id]) => id)).size).toBe(3);
  });

  it("suppresses concurrent requests and stale viewer completions", async () => {
    let resolve: (value: string) => void = () => {};
    const execute = vi.fn((): Promise<string> => new Promise((done) => { resolve = done; }));
    const { result, rerender } = renderHook(({ context }) => useRoomMutation(context), { initialProps: { context: "a:room" } });
    let pending: Promise<string | undefined> = Promise.resolve(undefined);
    act(() => { pending = result.current.run("pass:1", execute); });
    await act(async () => { expect(await result.current.run("pass:1", execute)).toBeUndefined(); });
    expect(execute).toHaveBeenCalledTimes(1);
    rerender({ context: "b:room" });
    await act(async () => { resolve("accepted"); expect(await pending).toBeUndefined(); });
    expect(result.current.pending).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("ignores failures after room changes and requires an authenticated context", async () => {
    let reject: (reason: Error) => void = () => {};
    const execute = vi.fn((): Promise<string> => new Promise((_resolve, fail) => { reject = fail; }));
    const { result, rerender } = renderHook(({ context }) => useRoomMutation(context), { initialProps: { context: "a:room" } });
    let pending: Promise<string | undefined> = Promise.resolve(undefined);
    act(() => { pending = result.current.run("start", execute); });
    rerender({ context: "" });
    await act(async () => { reject(new Error("Denied")); await pending; await result.current.run("start", execute); });
    expect(execute).toHaveBeenCalledTimes(1);
    expect(result.current.error).toBeNull();
  });
});
