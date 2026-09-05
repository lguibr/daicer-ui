import { locateTile, MINIMUM_Z, TILE_PIXELS, visibilityKey } from "./geometry";
import type { MapScene } from "./types";

const BLOCK_COLORS: Record<string, string> = {
  water: "#1e3a8a", grass: "#14532d", stone: "#44403c", sand: "#d97706",
  snow: "#e5e7eb", stairs_up: "#22d3ee", stairs_down: "#d946ef",
};
function blockColor(block: string): string {
  if (block.startsWith("wall")) return "#78716c";
  if (block.startsWith("floor")) return "#57534e";
  if (block.includes("door")) return "#854d0e";
  return BLOCK_COLORS[block] ?? "#222";
}

/** Draw only known terrain; previews may explicitly remain unrestricted. */
export function drawTerrain(context: CanvasRenderingContext2D, scene: MapScene): void {
  const { width, height, center, scale, chunkSize, viewZ } = scene;
  const tileSize = TILE_PIXELS * scale;
  const halfWidth = Math.floor(Math.ceil(width / tileSize) / 2);
  const halfHeight = Math.floor(Math.ceil(height / tileSize) / 2);
  for (let y = Math.floor(center.y - halfHeight - 1); y <= Math.ceil(center.y + halfHeight + 1); y++) {
    for (let x = Math.floor(center.x - halfWidth - 1); x <= Math.ceil(center.x + halfWidth + 1); x++) {
      const key = visibilityKey(x, y, scene);
      const visible = scene.visibleTiles.has(key);
      const explored = scene.exploredTiles.has(key);
      if (!scene.godMode && !visible && !explored && (scene.restrictView || scene.exploredTiles.size > 0)) continue;
      const column = locateTile(x, chunkSize);
      const row = locateTile(y, chunkSize);
      const chunk = scene.chunkProvider.getChunk(column.chunk, row.chunk);
      const tile = chunk?.tiles[viewZ - MINIMUM_Z]?.[row.local]?.[column.local];
      if (!tile) continue;
      const screenX = (x - center.x) * tileSize + width / 2 - tileSize / 2;
      const screenY = (y - center.y) * tileSize + height / 2 - tileSize / 2;
      context.fillStyle = blockColor(tile.block);
      context.fillRect(screenX, screenY, tileSize, tileSize);
      if (!visible && explored && !scene.godMode) {
        context.fillStyle = "rgba(0,0,0,0.6)";
        context.fillRect(screenX, screenY, tileSize, tileSize);
      }
      const light = scene.lightLevel ?? 1;
      if (light < 1) {
        context.fillStyle = `rgba(0,0,10,${1 - Math.max(0, light)})`;
        context.fillRect(screenX, screenY, tileSize, tileSize);
      }
      context.strokeStyle = "rgba(255,255,255,0.05)";
      context.strokeRect(screenX, screenY, tileSize, tileSize);
    }
  }
}
