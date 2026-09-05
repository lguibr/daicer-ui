import { canDrawOverlay, TILE_PIXELS } from "./geometry";
import type { MapEntity, MapScene } from "./types";

/** Hidden path segments must never be bridged by a visible line. */
export function drawOverlays(context: CanvasRenderingContext2D, scene: MapScene): void {
  const tileSize = TILE_PIXELS * scene.scale;
  const screenPoint = (position: MapEntity["position"]): { x: number; y: number } => ({
    x: (position.x - scene.center.x) * tileSize + scene.width / 2,
    y: (position.y - scene.center.y) * tileSize + scene.height / 2,
  });
  context.strokeStyle = "#fbbf24";
  context.lineWidth = 3 * scene.scale;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.setLineDash([5 * scene.scale, 5 * scene.scale]);
  context.beginPath();
  let first = true;
  for (const point of scene.previewPath ?? []) {
    if (point.z !== scene.viewZ || !canDrawOverlay(point.x, point.y, scene)) {
      first = true;
      continue;
    }
    const screen = screenPoint(point);
    if (first) context.moveTo(screen.x, screen.y);
    else context.lineTo(screen.x, screen.y);
    first = false;
  }
  context.stroke();
  context.setLineDash([]);
  const drawEntity = (entity: MapEntity, ghost: boolean): void => {
    if (entity.position.z !== scene.viewZ || !canDrawOverlay(entity.position.x, entity.position.y, scene)) return;
    const screen = screenPoint(entity.position);
    context.save();
    context.globalAlpha = ghost ? 0.6 : 1;
    context.fillStyle = entity.color ?? (ghost ? "#eab308" : "#3b82f6");
    context.beginPath();
    context.arc(screen.x, screen.y, tileSize * 0.4, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#fff";
    context.lineWidth = 2;
    if (ghost) context.setLineDash([4, 4]);
    context.stroke();
    context.restore();
  };
  const entities = scene.isLive === false
    ? scene.currentTimeFrame?.gameState?.entities ?? scene.entities
    : scene.entities;
  entities.forEach((entity) => drawEntity(entity, false));
  scene.ghostEntities?.forEach((entity) => drawEntity(entity, true));
}
