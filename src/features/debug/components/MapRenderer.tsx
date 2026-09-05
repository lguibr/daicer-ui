import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { DEFAULT_CHUNK_SIZE, isZLevel } from "./map/geometry";
import { drawTerrain } from "./map/drawTerrain";
import { drawOverlays } from "./map/drawOverlays";
import { useMapInput } from "./map/useMapInput";
import type { MapRendererProps, MapScene } from "./map/types";

/** Canvas placeholders shared by gameplay and the existing world/debug previews. */
export function MapRenderer(props: MapRendererProps): ReactElement {
  const { width, height, chunkSize: requestedChunkSize, viewZ, scale, visibilityKeyFormat } = props;
  const canvas = useRef<HTMLCanvasElement>(null);
  const input = useMapInput(canvas, props);
  useEffect(() => {
    const context = canvas.current?.getContext("2d");
    if (!context) return;
    context.fillStyle = "#0a0a0a";
    context.fillRect(0, 0, width, height);
    const chunkSize = requestedChunkSize ?? DEFAULT_CHUNK_SIZE;
    if (!Number.isInteger(chunkSize) || chunkSize <= 0 || !isZLevel(viewZ) ||
        !Number.isFinite(scale) || scale <= 0) return;
    const scene: MapScene = { ...props, chunkSize, visibilityKeyFormat: visibilityKeyFormat ?? "xyz" };
    drawTerrain(context, scene);
    drawOverlays(context, scene);
  }, [props, width, height, requestedChunkSize, viewZ, scale, visibilityKeyFormat]);
  return (
    <canvas
      ref={canvas}
      width={width}
      height={height}
      {...input.handlers}
      // Canvas retains the existing interactive map accessibility role.
      // eslint-disable-next-line jsx-a11y/no-interactive-element-to-noninteractive-role
      role="application"
      aria-label="Game Map"
      className={`block touch-none bg-black ${input.dragging ? "cursor-grabbing" : "cursor-crosshair"}`}
    />
  );
}
