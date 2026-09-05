import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { MouseEvent } from "react";
import type { MapRendererProps } from "@/features/debug/components/map/types";
import { PlayerMap } from "../PlayerMap";
import type { PlayerRoomFragment } from "../generated";

const captured = vi.hoisted(() => ({ scene: null as MapRendererProps | null }));
vi.mock("@/features/debug/components/MapRenderer", () => ({ MapRenderer: (props: MapRendererProps): null => { captured.scene = props; return null; } }));
const fixture = (size = 16): PlayerRoomFragment => ({
  roomId: "room", world: { worldId: "world", config: { chunkSize: size } }, turn: { number: 1 },
  myself: { characterSheetId: "sheet", position: { x: -1, y: 0, z: 0 } },
  visibleEntities: [{ characterSheetId: "sheet", position: { x: -1, y: 0, z: 0 } }],
  capabilities: { canSubmit: true },
  terrain: { worldId: "world", revision: "visible", chunkSize: size, minZ: -3, maxZ: 3, tiles: [
    { x: -1, y: 0, z: 0, block: "grass", biome: "plains", isWalkable: true, isTransparent: true },
    { x: 0, y: 0, z: 0, block: "wall_stone", biome: "plains", isWalkable: false, isTransparent: false },
  ] },
}) as PlayerRoomFragment;

describe("authorized gameplay map", () => {
  afterEach(cleanup);
  it.each([16, 32])("maps negative coordinates into %i-sized sparse chunks and drafts only visible walkable targets", (size) => {
    const suggest = vi.fn(); render(<PlayerMap view={fixture(size)} onSuggestIntent={suggest} />);
    const scene = captured.scene!;
    expect(scene.chunkProvider.getChunk(-1, 0)?.tiles[3]?.[0]?.[size - 1]?.block).toBe("grass");
    expect(scene.chunkProvider.getChunk(-1, 0)?.tiles[3]?.[0]?.[size - 2]).toBeUndefined();
    expect(scene.visibleTiles).toEqual(new Set(["-1,0,0", "0,0,0"]));
    scene.onTileClick({ x: 0, y: 0, z: 0 }, {} as MouseEvent);
    scene.onTileClick({ x: 1, y: 0, z: 0 }, {} as MouseEvent);
    scene.onTileClick({ x: -1, y: 0, z: 1 }, {} as MouseEvent);
    expect(suggest).not.toHaveBeenCalled();
    scene.onTileClick({ x: -1, y: 0, z: 0 }, {} as MouseEvent);
    expect(suggest).toHaveBeenCalledExactlyOnceWith("I move to tile (-1, 0, 0).");
  });
  it("ignores foreign worlds, mismatched dimensions and input while reconnecting", () => {
    const view = fixture(), suggest = vi.fn();
    const { rerender } = render(<PlayerMap view={view} disabled onSuggestIntent={suggest} />);
    captured.scene!.onTileClick({ x: -1, y: 0, z: 0 }, {} as MouseEvent); expect(suggest).not.toHaveBeenCalled();
    rerender(<PlayerMap view={{ ...view, terrain: { ...view.terrain!, worldId: "foreign" } }} />);
    expect(captured.scene!.visibleTiles.size).toBe(0);
    rerender(<PlayerMap view={{ ...view, terrain: { ...view.terrain!, chunkSize: 32 } }} />);
    expect(captured.scene!.visibleTiles.size).toBe(0);
  });
});
