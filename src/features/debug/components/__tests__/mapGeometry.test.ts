import { describe, expect, it } from "vitest";
import { canvasPoint, locateTile, tileAtPoint } from "../map/geometry";

describe("chunk and canvas coordinates", () => {
  it.each([16, 32])("maps both sides of boundaries for chunk size %i", (size) => {
    expect(locateTile(-1, size)).toEqual({ chunk: -1, local: size - 1 });
    expect(locateTile(-size, size)).toEqual({ chunk: -1, local: 0 });
    expect(locateTile(-size - 1, size)).toEqual({ chunk: -2, local: size - 1 });
    expect(locateTile(size, size)).toEqual({ chunk: 1, local: 0 });
    expect(locateTile(size - 1, size)).toEqual({ chunk: 0, local: size - 1 });
  });
  it("converts CSS scale and rejects a hidden canvas", () => {
    expect(canvasPoint(242, 186, { left: 10, top: 20, width: 400, height: 300 }, 800, 600))
      .toEqual({ x: 464, y: 332 });
    expect(canvasPoint(0, 0, { left: 0, top: 0, width: 0, height: 0 }, 800, 600)).toBeNull();
  });
  it("retains numeric negative coordinates and rejects invalid layers/scales", () => {
    const scene = { center: { x: -10, y: -20, z: 0 as const }, width: 800, height: 600, scale: 1, viewZ: -3 };
    expect(tileAtPoint({ x: 368, y: 268 }, scene)).toEqual({ x: -11, y: -21, z: -3 });
    expect(tileAtPoint({ x: 0, y: 0 }, { ...scene, scale: 0 })).toBeNull();
    expect(tileAtPoint({ x: 0, y: 0 }, { ...scene, viewZ: 4 })).toBeNull();
    expect(tileAtPoint({ x: Infinity, y: 0 }, scene)).toBeNull();
  });
});
