import { useState, useMemo, useCallback, useEffect } from "react";
import { useApolloClient } from "@apollo/client/react";
import { VoxelPreviewDocument } from "../gql/graphql";
import type { Chunk, WorldConfig } from "../features/debug/utils/types";

const PREVIEW_BATCH_SIZE = 16;
const PREVIEW_BATCH_DELAY_MS = 50;
const PREVIEW_LAYER_COUNT = 7;
type ChunkRequest = { x: number; y: number };
type PreviewScope = {
  configKey: string;
  cache: Record<string, Chunk>; queued: Map<string, ChunkRequest>; inflight: Set<string>; failed: Set<string>;
  generation: number; disposed: boolean; active: boolean; error: string | null;
  controller: AbortController | null; timeout: ReturnType<typeof setTimeout> | null;
};
type PreviewResult = { chunkCache: Record<string, Chunk>; isLoading: boolean; error: string | null;
  getChunk: (x: number, y: number) => Chunk | null; resetCache: () => void };

/** Pure preview only: bounded serial batches, response-coordinate identity, explicit retry. */
export function useChunkLoader({ config }: { config: WorldConfig }): PreviewResult {
  const client = useApolloClient();
  const configKey = JSON.stringify(config);
  const scope = useMemo<PreviewScope>(() => ({
    configKey,
    cache: {}, queued: new Map(), inflight: new Set(), failed: new Set(), generation: 0,
    disposed: true, active: false, error: null, controller: null, timeout: null,
  }), [configKey]);
  const [, redraw] = useState(0);
  const refresh = useCallback((): void => redraw((revision) => revision + 1), []);
  const cancel = useCallback((): void => {
    scope.generation += 1;
    scope.controller?.abort();
    if (scope.timeout) clearTimeout(scope.timeout);
    scope.timeout = null;
    scope.queued.clear();
    scope.inflight.clear();
    scope.active = false;
  }, [scope]);
  useEffect(() => {
    scope.disposed = false;
    // Initial child effects and StrictMode replay may have observed an inactive scope.
    refresh();
    return () => { scope.disposed = true; cancel(); };
  }, [scope, cancel, refresh]);

  const processBatch = useCallback(async (): Promise<void> => {
    if (scope.disposed || scope.active || !scope.queued.size) return;
    scope.timeout = null;
    scope.active = true;
    const { generation } = scope;
    const entries = [...scope.queued.entries()].slice(0, PREVIEW_BATCH_SIZE);
    entries.forEach(([key]) => { scope.queued.delete(key); scope.inflight.add(key); });
    scope.controller = new AbortController();
    refresh();
    try {
      const { data } = await client.query({ query: VoxelPreviewDocument,
        variables: { chunks: entries.map(([, coordinates]) => coordinates), config }, fetchPolicy: "no-cache",
        context: { queryDeduplication: false, fetchOptions: { signal: scope.controller.signal } },
      });
      if (scope.disposed || scope.generation !== generation) return;
      if (!data || !Array.isArray(data.voxelPreview)) throw new Error("Preview response is missing.");
      const received = new Map<string, Chunk>();
      for (const chunk of data.voxelPreview) {
        if (!chunk || !Number.isSafeInteger(chunk.x) || !Number.isSafeInteger(chunk.y)) throw new Error("Invalid preview chunk identity.");
        const key = `${chunk.x},${chunk.y}`;
        if (!scope.inflight.has(key) || received.has(key)) throw new Error("Unexpected preview chunk identity.");
        // The retained legacy operation has a JSON tile scalar; this is a shape check, not full tile validation.
        if (!Array.isArray(chunk.tiles) || chunk.tiles.length !== PREVIEW_LAYER_COUNT) throw new Error("Invalid preview tile layers.");
        received.set(key, { x: chunk.x, y: chunk.y, tiles: chunk.tiles });
      }
      if (received.size !== entries.length) throw new Error("Some preview chunks are missing. Please retry.");
      received.forEach((chunk, key) => { scope.cache[key] = chunk; });
    } catch (error) {
      if (scope.disposed || scope.generation !== generation) return;
      entries.forEach(([key]) => scope.failed.add(key));
      scope.error = error instanceof Error ? error.message : "Preview unavailable. Please retry.";
    } finally {
      if (!scope.disposed && scope.generation === generation) {
        entries.forEach(([key]) => scope.inflight.delete(key));
        scope.active = false;
        if (scope.queued.size) scope.timeout = setTimeout(() => { processBatch(); }, PREVIEW_BATCH_DELAY_MS);
        refresh();
      }
    }
  }, [client, config, refresh, scope]);

  // A fresh provider callback lets the retained 3D preview rebuild after cache updates too.
  const getChunk = (x: number, y: number): Chunk | null => {
    if (scope.disposed || !Number.isSafeInteger(x) || !Number.isSafeInteger(y)) return null;
    const key = `${x},${y}`;
    if (scope.cache[key]) return scope.cache[key];
    if (!scope.failed.has(key) && !scope.inflight.has(key) && !scope.queued.has(key)) {
      scope.queued.set(key, { x, y });
      if (!scope.active && !scope.timeout) scope.timeout = setTimeout(() => { processBatch(); }, PREVIEW_BATCH_DELAY_MS);
    }
    return null;
  };
  const resetCache = useCallback((): void => {
    cancel();
    scope.cache = {};
    scope.failed.clear();
    scope.error = null;
    refresh();
  }, [cancel, refresh, scope]);
  return { chunkCache: scope.cache, isLoading: scope.active || scope.queued.size > 0,
    error: scope.error, getChunk, resetCache };
}
