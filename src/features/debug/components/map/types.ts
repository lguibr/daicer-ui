import type { MouseEvent } from "react";
import type { Chunk, Coordinates } from "../../utils/types";

export type MapEntity = {
  position: { x: number; y: number; z: number };
  color?: string;
};

export type MapRendererProps = {
  width: number;
  height: number;
  center: Coordinates;
  viewZ: number;
  scale: number;
  chunkSize?: number;
  chunkProvider: { getChunk: (x: number, y: number) => Chunk | null | undefined };
  visibleTiles: Set<string>;
  exploredTiles: Set<string>;
  visibilityKeyFormat?: "xy" | "xyz";
  entities: MapEntity[];
  ghostEntities?: MapEntity[];
  onTileClick: (coordinates: Coordinates, event: MouseEvent) => void;
  onTileDoubleClick?: (coordinates: Coordinates) => void;
  onTileHover: (coordinates: Coordinates | null) => void;
  previewPath?: Coordinates[] | null;
  isLive?: boolean;
  currentTimeFrame?: { gameState?: { entities?: MapEntity[] } } | null;
  interactionKey?: string;
  onZoom?: (delta: number, mouseX: number, mouseY: number) => void;
  onPan?: (deltaX: number, deltaY: number) => void;
  restrictView?: boolean;
  godMode?: boolean;
  lightLevel?: number;
};

export type MapScene = MapRendererProps & {
  chunkSize: number;
  visibilityKeyFormat: "xy" | "xyz";
};
