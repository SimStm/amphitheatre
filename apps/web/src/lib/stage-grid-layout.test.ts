import { describe, expect, test } from "bun:test";
import { computeGrid } from "./stage-grid-layout.ts";

describe("computeGrid", () => {
  test("one tile fills the limiting side", () => {
    const grid = computeGrid(1, 1600, 900, 16 / 9, 8);
    expect(grid.columns).toBe(1);
    expect(grid.tileWidth).toBeCloseTo(1600);
    expect(grid.tileHeight).toBeCloseTo(900);
  });

  test("two tiles sit side by side on a wide stage", () => {
    expect(computeGrid(2, 1600, 900, 16 / 9, 8).columns).toBe(2);
  });

  test("two tiles stack on a tall stage", () => {
    const grid = computeGrid(2, 400, 800, 16 / 9, 8);
    expect(grid.columns).toBe(1);
    expect(grid.rows).toBe(2);
  });

  test("tiles always fit inside the stage", () => {
    const grid = computeGrid(7, 1440, 900, 16 / 9, 8);
    expect(grid.columns * grid.tileWidth + (grid.columns - 1) * 8).toBeLessThanOrEqual(1440);
    expect(grid.rows * grid.tileHeight + (grid.rows - 1) * 8).toBeLessThanOrEqual(900);
    expect(grid.columns * grid.rows).toBeGreaterThanOrEqual(7);
  });

  test("an unmeasured stage gives an empty layout", () => {
    expect(computeGrid(3, 0, 0, 16 / 9, 8).columns).toBe(0);
  });
});
