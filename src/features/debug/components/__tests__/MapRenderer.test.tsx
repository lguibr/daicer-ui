import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MapRenderer } from "../MapRenderer";
import type { MapRendererProps } from "../map/types";
import { BiomeType, BlockType } from "../../utils/types";
import type { Chunk, Tile } from "../../utils/types";

function props(overrides: Partial<MapRendererProps> = {}): MapRendererProps {
  return {
    width: 800, height: 600, center: { x: 0, y: 0, z: 0 }, viewZ: 0, scale: 1,
    chunkProvider: { getChunk: vi.fn(() => null) }, visibleTiles: new Set(),
    exploredTiles: new Set(), entities: [], onTileClick: vi.fn(), onTileHover: vi.fn(),
    ...overrides,
  };
}

function chunk(size: number, x = 0, y = 0): Chunk {
  const tile: Tile = { x: 0, y: 0, z: 0, block: BlockType.GRASS,
    biome: BiomeType.PLAINS, isWalkable: true, isTransparent: true };
  return { x, y, tiles: Array.from({ length: 7 }, () =>
    Array.from({ length: size }, () => Array.from({ length: size }, () => tile))) };
}

let context: CanvasRenderingContext2D;
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  const canvasContext = document.createElement("canvas").getContext("2d");
  if (!canvasContext) throw new Error("Canvas test context unavailable");
  context = canvasContext;
  context.setLineDash = vi.fn();
  const canvasPrototype: { getContext: (kind: "2d") => CanvasRenderingContext2D | null } = HTMLCanvasElement.prototype;
  vi.spyOn(canvasPrototype, "getContext").mockReturnValue(context);
  vi.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect")
    .mockReturnValue(new DOMRect(10, 20, 400, 300));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

describe("MapRenderer input", () => {
  it("emits numeric coordinates from CSS-scaled input without delaying single clicks", () => {
    const properties = props();
    render(<MapRenderer {...properties} />);
    fireEvent.click(screen.getByLabelText("Game Map"), { clientX: 242, clientY: 186 });
    expect(properties.onTileClick).toHaveBeenCalledWith({ x: 2, y: 1, z: 0 }, expect.anything());
    fireEvent.click(screen.getByLabelText("Game Map"), { clientX: 242, clientY: 186 });
    expect(properties.onTileClick).toHaveBeenCalledTimes(2);
  });
  it("distinguishes double clicks and delayed singles", () => {
    const properties = props({ onTileDoubleClick: vi.fn() });
    render(<MapRenderer {...properties} />);
    const canvas = screen.getByLabelText("Game Map");
    fireEvent.click(canvas, { clientX: 210, clientY: 170 });
    fireEvent.click(canvas, { clientX: 210, clientY: 170 });
    act(() => vi.advanceTimersByTime(300));
    expect(properties.onTileDoubleClick).toHaveBeenCalledWith({ x: 0, y: 0, z: 0 });
    expect(properties.onTileClick).not.toHaveBeenCalled();
    fireEvent.click(canvas, { clientX: 210, clientY: 170 });
    act(() => vi.advanceTimersByTime(300));
    expect(properties.onTileClick).toHaveBeenCalledTimes(1);
  });
  it("cancels delayed clicks on room changes, layer changes, and unmount", () => {
    const properties = props({ interactionKey: "room-a", onTileDoubleClick: vi.fn() });
    const { rerender, unmount } = render(<MapRenderer {...properties} />);
    const click = (): void => { fireEvent.click(screen.getByLabelText("Game Map"), { clientX: 210, clientY: 170 }); };
    click(); rerender(<MapRenderer {...properties} interactionKey="room-b" />);
    act(() => vi.advanceTimersByTime(300));
    click(); rerender(<MapRenderer {...properties} interactionKey="room-b" viewZ={1} />);
    act(() => vi.advanceTimersByTime(300));
    click(); unmount(); act(() => vi.advanceTimersByTime(300));
    expect(properties.onTileClick).not.toHaveBeenCalled();
  });
  it("pans in canvas pixels and suppresses the drag's click", () => {
    const properties = props({ onPan: vi.fn(), onZoom: vi.fn() });
    render(<MapRenderer {...properties} />);
    const canvas = screen.getByLabelText("Game Map");
    fireEvent.mouseDown(canvas, { clientX: 210, clientY: 170 });
    fireEvent.mouseMove(canvas, { clientX: 230, clientY: 180 });
    fireEvent.mouseUp(canvas);
    fireEvent.click(canvas, { clientX: 230, clientY: 180 });
    expect(properties.onPan).toHaveBeenCalledWith(40, 20);
    expect(properties.onTileClick).not.toHaveBeenCalled();
    fireEvent.wheel(canvas, { clientX: 210, clientY: 170, deltaY: -1 });
    expect(properties.onZoom).toHaveBeenCalledWith(-1, 400, 300);
  });
});

describe("MapRenderer drawing", () => {
  it.each([16, 32])("uses %i-tile chunks including negative coordinates", (size) => {
    const getChunk = vi.fn((x: number, y: number) => chunk(size, x, y));
    render(<MapRenderer {...props({ width: 32, height: 32, center: { x: -1, y: -1, z: 0 },
      chunkSize: size, chunkProvider: { getChunk }, restrictView: true,
      visibleTiles: new Set(["-1,-1,0"]) })} />);
    expect(getChunk).toHaveBeenCalledWith(-1, -1);
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 32, 32);
    expect(context.fillRect).toHaveBeenCalledTimes(2);
  });
  it.each([16, 32])("crosses the positive %i-tile chunk boundary", (size) => {
    const getChunk = vi.fn((x: number, y: number) => chunk(size, x, y));
    render(<MapRenderer {...props({ width: 32, height: 32, center: { x: size, y: size, z: 0 },
      chunkSize: size, chunkProvider: { getChunk }, restrictView: true,
      visibleTiles: new Set([`${size},${size},0`]) })} />);
    expect(getChunk).toHaveBeenCalledWith(1, 1);
    expect(context.fillRect).toHaveBeenCalledTimes(2);
  });
  it("hides unknown terrain and overlays in a restricted empty projection", () => {
    const getChunk = vi.fn(() => chunk(16));
    render(<MapRenderer {...props({ restrictView: true, chunkProvider: { getChunk },
      entities: [{ position: { x: 0, y: 0, z: 0 } }],
      ghostEntities: [{ position: { x: 0, y: 0, z: 0 } }] })} />);
    expect(getChunk).not.toHaveBeenCalled();
    expect(context.arc).not.toHaveBeenCalled();
  });
  it("does not join visible path sections through hidden tiles", () => {
    render(<MapRenderer {...props({ restrictView: true, visibleTiles: new Set(["0,0,0", "2,0,0"]),
      previewPath: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }] })} />);
    expect(context.moveTo).toHaveBeenCalledTimes(2);
    expect(context.lineTo).not.toHaveBeenCalled();
  });
  it("redraws god mode and lighting while retaining explicit legacy XY visibility", () => {
    const properties = props({ width: 32, height: 32, chunkProvider: { getChunk: () => chunk(32) },
      restrictView: true, visibilityKeyFormat: "xy", visibleTiles: new Set(["0,0"]),
      entities: [{ position: { x: 0, y: 0, z: 0 } }, { position: { x: 1, y: 0, z: 0 } }] });
    const { rerender } = render(<MapRenderer {...properties} />);
    expect(context.arc).toHaveBeenCalledTimes(1);
    vi.mocked(context.arc).mockClear();
    rerender(<MapRenderer {...properties} godMode />);
    expect(context.arc).toHaveBeenCalledTimes(2);
    vi.mocked(context.fillRect).mockClear();
    rerender(<MapRenderer {...properties} lightLevel={0} />);
    expect(context.fillRect).toHaveBeenCalledTimes(3);
  });
  it("uses historical entities and safely falls back for missing history", () => {
    const properties = props({ entities: [{ position: { x: 0, y: 0, z: 0 } }], isLive: false });
    const { rerender } = render(<MapRenderer {...properties} currentTimeFrame={{ gameState: {
      entities: [{ position: { x: 2, y: 0, z: 0 } }] } }} />);
    expect(context.arc).toHaveBeenLastCalledWith(464, 300, 12.8, 0, Math.PI * 2);
    rerender(<MapRenderer {...properties} currentTimeFrame={{}} />);
    expect(context.arc).toHaveBeenLastCalledWith(400, 300, 12.8, 0, Math.PI * 2);
  });
});
