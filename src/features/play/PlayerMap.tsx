import { useMemo } from "react";
import type { ReactElement } from "react";
import { MapRenderer } from "@/features/debug/components/MapRenderer";
import { isZLevel } from "@/features/debug/components/map/geometry";
import { BlockType, BiomeType } from "@/features/debug/utils/types";
import type { Chunk, Coordinates, Tile } from "@/features/debug/utils/types";
import type { PlayerRoomFragment } from "./generated";

type Props = { view: PlayerRoomFragment; disabled?: boolean; onSuggestIntent?: (text: string) => void };

/** Persisted viewer cells feed the existing Canvas; unknown cells remain absent. */
export function PlayerMap({ view, disabled = false, onSuggestIntent }: Props): ReactElement {
  const { terrain } = view;
  const model = useMemo(() => {
    const chunks = new Map<string, Chunk>();
    const cells = new Map<string, Tile>();
    if (!terrain || terrain.worldId !== view.world.worldId || terrain.chunkSize !== view.world.config.chunkSize ||
        terrain.minZ !== -3 || terrain.maxZ !== 3 || !Number.isInteger(terrain.chunkSize) || terrain.chunkSize < 1 || terrain.chunkSize > 64) return { chunks, cells };
    const size = terrain.chunkSize;
    for (const tile of terrain.tiles) {
      if (!Number.isSafeInteger(tile.x) || !Number.isSafeInteger(tile.y) || !isZLevel(tile.z)) continue;
      const cx = Math.floor(tile.x / size);
      const cy = Math.floor(tile.y / size);
      const key = `${cx},${cy}`;
      let chunk = chunks.get(key);
      if (!chunk) {
        chunk = { x: cx, y: cy, tiles: Array.from({ length: 7 }, () => Array.from({ length: size }, () => new Array<Tile>(size))) };
        chunks.set(key, chunk);
      }
      const cell: Tile = { ...tile, z: tile.z, block: tile.block as BlockType, biome: tile.biome as BiomeType };
      const row = chunk.tiles[tile.z + 3]?.[tile.y - cy * size];
      if (row) row[tile.x - cx * size] = cell;
      cells.set(`${tile.x},${tile.y},${tile.z}`, cell);
    }
    return { chunks, cells };
  }, [terrain, view.world.worldId, view.world.config.chunkSize]);
  const position = view.myself?.position;
  if (!position || !isZLevel(position.z)) return <p>Map position unavailable.</p>;
  const center: Coordinates = { x: position.x, y: position.y, z: position.z };
  const entities = view.visibleEntities.flatMap((entity) => entity.position ? [{ position: entity.position,
    color: entity.characterSheetId === view.myself?.characterSheetId ? "#fbbf24" : "#3b82f6" }] : []);
  return <section className="card p-4" aria-label="Map">
    <h2 className="text-xl">Map</h2>
    <div className="overflow-auto"><MapRenderer width={640} height={360} center={center} viewZ={center.z} scale={1}
      chunkSize={view.world.config.chunkSize} chunkProvider={{ getChunk: (x, y) => model.chunks.get(`${x},${y}`) }} entities={entities}
      visibleTiles={new Set(model.cells.keys())} exploredTiles={new Set()} restrictView interactionKey={JSON.stringify([view.roomId, view.turn?.number])}
      onTileClick={(coordinates) => {
        const tile = model.cells.get(`${coordinates.x},${coordinates.y},${coordinates.z}`);
        if (!disabled && view.capabilities.canSubmit && tile?.isWalkable && coordinates.z === center.z) {
          onSuggestIntent?.(`I move to tile (${coordinates.x}, ${coordinates.y}, ${coordinates.z}).`);
        }
      }} onTileHover={() => {}} /></div>
    <p>Position: {position.x}, {position.y}, {position.z}.</p>
    <p>{model.cells.size ? "Select a visible walkable tile to draft a move, then submit your action." : "Terrain unavailable. Refresh the room to reconnect."}</p>
  </section>;
}
