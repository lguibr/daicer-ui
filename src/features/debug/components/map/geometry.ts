import type { Coordinates, ZLevel } from "../../utils/types";
import type { MapScene } from "./types";

export const TILE_PIXELS = 32;
export const DEFAULT_CHUNK_SIZE = 32;
export const MINIMUM_Z = -3;
export const MAXIMUM_Z = 3;

/** Chunk coordinates use floor division, including tiles west/south of zero. */
export function locateTile(value: number, chunkSize: number): { chunk: number; local: number } {
  return { chunk: Math.floor(value / chunkSize), local: ((value % chunkSize) + chunkSize) % chunkSize };
}

export function isZLevel(value: number): value is ZLevel {
  return Number.isInteger(value) && value >= MINIMUM_Z && value <= MAXIMUM_Z;
}

/** Convert CSS coordinates into backing-canvas pixels before tile conversion. */
export function canvasPoint(
  clientX: number, clientY: number,
  rectangle: Pick<DOMRect, "left" | "top" | "width" | "height">,
  width: number, height: number,
): { x: number; y: number } | null {
  if (rectangle.width <= 0 || rectangle.height <= 0) return null;
  return {
    x: ((clientX - rectangle.left) * width) / rectangle.width,
    y: ((clientY - rectangle.top) * height) / rectangle.height,
  };
}

export function tileAtPoint(
  point: { x: number; y: number },
  scene: Pick<MapScene, "center" | "width" | "height" | "scale" | "viewZ">,
): Coordinates | null {
  if (!isZLevel(scene.viewZ) || !Number.isFinite(scene.scale) || scene.scale <= 0) return null;
  const tileSize = TILE_PIXELS * scene.scale;
  const x = Math.floor(scene.center.x + (point.x - scene.width / 2) / tileSize + 0.5);
  const y = Math.floor(scene.center.y + (point.y - scene.height / 2) / tileSize + 0.5);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y, z: scene.viewZ } : null;
}

export function visibilityKey(x: number, y: number, scene: MapScene): string {
  return scene.visibilityKeyFormat === "xyz" ? `${x},${y},${scene.viewZ}` : `${x},${y}`;
}

export function canDrawOverlay(x: number, y: number, scene: MapScene): boolean {
  return !!scene.godMode || !scene.restrictView || scene.visibleTiles.has(visibilityKey(x, y, scene));
}
