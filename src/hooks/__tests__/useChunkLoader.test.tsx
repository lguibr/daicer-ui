import { act, cleanup, render, renderHook } from "@testing-library/react";
import { StrictMode, useEffect, useMemo } from "react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useChunkLoader } from "../useChunkLoader";
import type { Chunk, WorldConfig } from "@/features/debug/utils/types";

const { client } = vi.hoisted(() => ({ client: { query: vi.fn() } }));
vi.mock("@apollo/client/react", () => ({ useApolloClient: (): typeof client => client }));
const config: WorldConfig = { seed: "a", chunkSize: 16, globalScale: 0.01, seaLevel: 0, elevationScale: 1,
  roughness: 0, detail: 4, moistureScale: 1, temperatureOffset: 0, structureChance: 0,
  structureSpacing: 10, structureSizeAvg: 10, roadDensity: 0, fogRadius: 10 };
const chunk = (x: number, y = 0): { x: number; y: number; tiles: never[][] } => ({ x, y, tiles: [[], [], [], [], [], [], []] });
const tick = async (milliseconds = 50): Promise<void> => { await act(async () => { await vi.advanceTimersByTimeAsync(milliseconds); }); };

describe("bounded preview loading", () => {
  beforeEach(() => { vi.useFakeTimers(); client.query.mockReset(); });
  afterEach(() => { cleanup(); vi.useRealTimers(); });

  it("replays parent-loader/child-renderer effects without losing initial demand", async () => {
    client.query.mockResolvedValue({ data: { voxelPreview: [chunk(0)] } });
    const received = vi.fn();
    function Child({ getChunk }: { getChunk: (x: number, y: number) => Chunk | null }): null {
      useEffect(() => { received(getChunk(0, 0)); }, [getChunk]);
      return null;
    }
    function Parent(): ReactElement {
      const { getChunk } = useChunkLoader({ config });
      return <Child getChunk={getChunk} />;
    }
    render(<StrictMode><Parent /></StrictMode>); await tick();
    expect(received).toHaveBeenLastCalledWith(chunk(0));
    expect(client.query).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])("refreshes memoized preview consumers after chunks load (StrictMode %s)", async (strict) => {
    client.query.mockResolvedValue({ data: { voxelPreview: [chunk(0)] } });
    const { result } = renderHook(() => {
      const loader = useChunkLoader({ config });
      return useMemo(() => loader.getChunk(0, 0), [loader.getChunk]);
    }, strict ? { wrapper: StrictMode } : {});
    expect(result.current).toBeNull(); await tick();
    expect(result.current?.x).toBe(0);
    expect(client.query).toHaveBeenCalledTimes(1);
  });

  it("caches shuffled responses by identity, deduplicates, and honors the 16 chunk limit", async () => {
    client.query.mockImplementation(({ variables }: { variables: { chunks: { x: number; y: number }[] } }) =>
      Promise.resolve({ data: { voxelPreview: variables.chunks.map(({ x, y }) => chunk(x, y)).reverse() } }));
    const { result } = renderHook(() => useChunkLoader({ config }));
    for (let x = -16; x < 17; x++) { result.current.getChunk(x, 0); result.current.getChunk(x, 0); }
    await tick(150);
    expect(client.query.mock.calls.map(([options]) => options.variables.chunks.length)).toEqual([16, 16, 1]);
    expect(result.current.getChunk(-16, 0)?.x).toBe(-16);
    expect(result.current.getChunk(16, 0)?.x).toBe(16);
    expect(Object.keys(result.current.chunkCache)).toHaveLength(33);
    await tick(500); expect(client.query).toHaveBeenCalledTimes(3);
  });

  it.each([[chunk(0)], [chunk(0), chunk(0)], [chunk(0), chunk(99)], [null, chunk(1)]])("fails closed on incomplete or invalid identities and retries only explicitly", async (...response) => {
    client.query.mockResolvedValue({ data: { voxelPreview: response } });
    const { result } = renderHook(() => useChunkLoader({ config }));
    result.current.getChunk(0, 0); result.current.getChunk(1, 0); await tick();
    expect(result.current.error).not.toBeNull();
    expect(result.current.chunkCache).toEqual({});
    result.current.getChunk(0, 0); result.current.getChunk(1, 0); await tick(500);
    expect(client.query).toHaveBeenCalledTimes(1);
    client.query.mockResolvedValue({ data: { voxelPreview: [chunk(0), chunk(1)] } });
    act(() => result.current.resetCache());
    result.current.getChunk(0, 0); result.current.getChunk(1, 0); await tick();
    expect(result.current.error).toBeNull();
    expect(result.current.getChunk(1, 0)?.x).toBe(1);
  });

  it("isolates configuration synchronously and discards aborted responses", async () => {
    let resolve: (response: { data: { voxelPreview: ReturnType<typeof chunk>[] } }) => void = () => {};
    client.query.mockImplementationOnce(() => new Promise((done) => { resolve = done; }))
      .mockResolvedValue({ data: { voxelPreview: [chunk(1)] } });
    const { result, rerender, unmount } = renderHook(({ seed }) => useChunkLoader({ config: { ...config, seed } }), { initialProps: { seed: "a" } });
    result.current.getChunk(0, 0); await tick();
    const signal: AbortSignal = client.query.mock.calls[0]?.[0].context.fetchOptions.signal;
    rerender({ seed: "b" });
    expect(signal.aborted).toBe(true); expect(result.current.chunkCache).toEqual({});
    result.current.getChunk(1, 0); await tick();
    await act(async () => { resolve({ data: { voxelPreview: [chunk(0)] } }); });
    expect(result.current.chunkCache["0,0"]).toBeUndefined();
    expect(result.current.chunkCache["1,0"]?.x).toBe(1);
    unmount(); await tick(500); expect(client.query).toHaveBeenCalledTimes(2);
  });

  it("aborts reset/unmount work and prevents old results overwriting a new generation", async () => {
    let resolve: (response: { data: { voxelPreview: ReturnType<typeof chunk>[] } }) => void = () => {};
    client.query.mockImplementationOnce(() => new Promise((done) => { resolve = done; }))
      .mockImplementation(() => new Promise(() => {}));
    const { result, unmount } = renderHook(() => useChunkLoader({ config }));
    result.current.getChunk(0, 0); await tick();
    const first: AbortSignal = client.query.mock.calls[0]?.[0].context.fetchOptions.signal;
    act(() => result.current.resetCache()); expect(first.aborted).toBe(true);
    result.current.getChunk(1, 0); await tick();
    await act(async () => { resolve({ data: { voxelPreview: [chunk(0)] } }); });
    expect(result.current.chunkCache).toEqual({});
    expect(result.current.isLoading).toBe(true);
    const second: AbortSignal = client.query.mock.calls[1]?.[0].context.fetchOptions.signal;
    unmount(); expect(second.aborted).toBe(true);
  });
});
