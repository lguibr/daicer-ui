import { act, cleanup, renderHook } from "@testing-library/react";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameRoomPhase, GameSubmissionKind, GameSubmissionStatus } from "../generated";
import type { PlayerRoomFragment } from "../generated";
import { useRoomView } from "../useRoomView";

const { client } = vi.hoisted(() => ({ client: { query: vi.fn() } }));
vi.mock("@apollo/client/react", () => ({ useApolloClient: (): typeof client => client }));
const view = (revision = 1, roomId = "room"): PlayerRoomFragment => ({
  roomId, revision, code: "exact-code", phase: GameRoomPhase.Lobby, ownerUserId: "owner",
  world: { worldId: "world", language: "en", description: "", config: {
    seed: "seed", chunkSize: 16, detail: 1, fogRadius: 4, globalScale: 1, seaLevel: 0,
    elevationScale: 1, roughness: 1, moistureScale: 1, temperatureOffset: 0, roadDensity: 0,
    structureChance: 0, structureSpacing: 1, structureSizeAvg: 1, worldSize: "small", worldType: "fantasy",
  } }, players: [], visibleEntities: [], messages: { nodes: [], pageInfo: { hasPreviousPage: false } },
  capabilities: { canStart: false, canSubmit: false, canResolve: false },
});
const tick = async (milliseconds = 0): Promise<void> => { await act(async () => { await vi.advanceTimersByTimeAsync(milliseconds); }); };

describe("room view polling", () => {
  beforeEach(() => { vi.useFakeTimers(); client.query.mockReset(); });
  afterEach(() => { cleanup(); vi.useRealTimers(); });

  it("accepts clock-derived proposal recovery at the same persistent revision", async () => {
    const initial = { ...view(), mySubmission: { submissionId: "saved", turnNumber: 1,
      kind: GameSubmissionKind.Intent, text: "Move east", status: GameSubmissionStatus.Proposing } };
    client.query.mockResolvedValueOnce({ data: { gameView: initial } }).mockResolvedValue({ data: { gameView: {
      ...initial, mySubmission: { ...initial.mySubmission, status: GameSubmissionStatus.NeedsRevision, feedback: "Proposal expired" },
    } } });
    const { result } = renderHook(() => useRoomView("room", "viewer"));
    await tick(); expect(result.current.view?.mySubmission?.status).toBe(GameSubmissionStatus.Proposing);
    await tick(2000); expect(result.current.view?.mySubmission?.status).toBe(GameSubmissionStatus.NeedsRevision);
    expect(result.current.view?.revision).toBe(1);
  });

  it("serializes polling and queues at most one refresh", async () => {
    let resolve: (value: { data: { gameView: PlayerRoomFragment } }) => void = () => {};
    client.query.mockImplementationOnce(() => new Promise((done) => { resolve = done; }))
      .mockResolvedValue({ data: { gameView: view(2) } });
    const { result } = renderHook(() => useRoomView("room", "viewer"));
    act(() => { result.current.refresh(); result.current.refresh(); });
    await tick(6000);
    expect(client.query).toHaveBeenCalledTimes(1);
    await act(async () => { resolve({ data: { gameView: view() } }); });
    await tick();
    expect(client.query).toHaveBeenCalledTimes(2);
    expect(result.current.view?.revision).toBe(2);
    expect(client.query.mock.calls[0]?.[0]).toMatchObject({ fetchPolicy: "no-cache", context: { queryDeduplication: false } });
  });

  it("retains the latest revision during older responses and transient failures", async () => {
    client.query.mockResolvedValueOnce({ data: { gameView: view(3) } })
      .mockResolvedValueOnce({ data: { gameView: view(2) } }).mockRejectedValueOnce(new Error("Offline"))
      .mockResolvedValue({ data: { gameView: view(4) } });
    const { result } = renderHook(() => useRoomView("room", "viewer"));
    await tick(); await tick(2000);
    expect(result.current.view?.revision).toBe(3);
    await tick(2000);
    expect(result.current.status).toBe("reconnecting");
    expect(result.current.view?.revision).toBe(3);
    act(() => { window.dispatchEvent(new Event("online")); });
    await tick();
    expect(result.current.view?.revision).toBe(4);
  });

  it.each(["FORBIDDEN", "UNAUTHENTICATED", "ROOM_UNAVAILABLE"])("clears projections and stops polling on %s", async (code) => {
    client.query.mockResolvedValueOnce({ data: { gameView: view() } })
      .mockRejectedValue(new CombinedGraphQLErrors({ errors: [{ message: "Denied", extensions: { code } }] }));
    const { result } = renderHook(() => useRoomView("room", "viewer"));
    await tick(); await tick(2000);
    expect(result.current.view).toBeNull();
    expect(result.current.status).toBe("error");
    await tick(6000);
    expect(client.query).toHaveBeenCalledTimes(2);
  });

  it("aborts and discards pending results on viewer/room changes", async () => {
    let resolve: (value: { data: { gameView: PlayerRoomFragment } }) => void = () => {};
    client.query.mockImplementationOnce(() => new Promise((done) => { resolve = done; }))
      .mockResolvedValue({ data: { gameView: view(2, "other") } });
    const { result, rerender, unmount } = renderHook(({ room, viewer }) => useRoomView(room, viewer), {
      initialProps: { room: "room", viewer: "first" },
    });
    const signal: AbortSignal = client.query.mock.calls[0]?.[0].context.fetchOptions.signal;
    rerender({ room: "other", viewer: "second" });
    expect(result.current.view).toBeNull();
    expect(signal.aborted).toBe(true);
    await tick();
    await act(async () => { resolve({ data: { gameView: view(99) } }); });
    expect(result.current.view?.roomId).toBe("other");
    unmount(); await tick(6000);
    expect(client.query).toHaveBeenCalledTimes(2);
  });

  it("rejects room mismatch and does not query without a viewer", async () => {
    client.query.mockResolvedValue({ data: { gameView: view(1, "other") } });
    const { result, rerender } = renderHook(({ viewer }) => useRoomView("room", viewer), { initialProps: { viewer: "" } });
    expect(client.query).not.toHaveBeenCalled();
    rerender({ viewer: "viewer" }); await tick();
    expect(result.current.view).toBeNull();
    expect(result.current.status).toBe("error");
  });
});
