import { useEffect, useRef, useState } from "react";
import type { CanvasHTMLAttributes, MouseEvent, RefObject } from "react";
import { canvasPoint, tileAtPoint } from "./geometry";
import type { MapRendererProps } from "./types";

const DOUBLE_CLICK_DELAY_MS = 250;
const PAN_THRESHOLD_PIXELS = 5;
type InputResult = { dragging: boolean; handlers: CanvasHTMLAttributes<HTMLCanvasElement> };

/** Delayed clicks belong to one room and layer, and are cancelled on disposal. */
export function useMapInput(canvas: RefObject<HTMLCanvasElement | null>, props: MapRendererProps): InputResult {
  const pendingClick = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gesture = useRef({ down: false, panning: false, x: 0, y: 0, startX: 0, startY: 0 });
  const [dragging, setDragging] = useState(false);
  const { interactionKey, viewZ } = props;
  useEffect(() => () => {
    if (pendingClick.current !== null) clearTimeout(pendingClick.current);
    pendingClick.current = null;
    gesture.current.down = false;
    gesture.current.panning = false;
  }, [interactionKey, viewZ]);
  const pointFor = (event: MouseEvent): { x: number; y: number } | null => {
    const rectangle = canvas.current?.getBoundingClientRect();
    return rectangle ? canvasPoint(event.clientX, event.clientY, rectangle, props.width, props.height) : null;
  };
  const handlers: CanvasHTMLAttributes<HTMLCanvasElement> = {
    onMouseDown(event): void {
      const point = pointFor(event);
      if (!point || event.button !== 0) return;
      gesture.current = { down: true, panning: false, x: point.x, y: point.y, startX: point.x, startY: point.y };
      setDragging(true);
    },
    onMouseUp(): void { gesture.current.down = false; setDragging(false); },
    onMouseMove(event): void {
      const point = pointFor(event);
      if (!point) return;
      const { current } = gesture;
      if (current.down) {
        if (Math.hypot(point.x - current.startX, point.y - current.startY) > PAN_THRESHOLD_PIXELS) current.panning = true;
        if (current.panning) {
          props.onPan?.(point.x - current.x, point.y - current.y);
          current.x = point.x;
          current.y = point.y;
          return;
        }
      }
      props.onTileHover(tileAtPoint(point, props));
    },
    onMouseLeave(): void {
      gesture.current.down = false;
      setDragging(false);
      props.onTileHover(null);
    },
    onClick(event): void {
      if (gesture.current.panning) { gesture.current.panning = false; return; }
      const point = pointFor(event);
      const coordinates = point ? tileAtPoint(point, props) : null;
      if (!coordinates) return;
      if (!props.onTileDoubleClick) {
        props.onTileClick(coordinates, event);
      } else if (pendingClick.current !== null) {
        clearTimeout(pendingClick.current);
        pendingClick.current = null;
        props.onTileDoubleClick(coordinates);
      } else {
        pendingClick.current = setTimeout(() => {
          pendingClick.current = null;
          props.onTileClick(coordinates, event);
        }, DOUBLE_CLICK_DELAY_MS);
      }
    },
    onWheel(event): void {
      const point = pointFor(event);
      if (point) props.onZoom?.(Math.sign(event.deltaY), point.x, point.y);
    },
  };
  return { dragging, handlers };
}
