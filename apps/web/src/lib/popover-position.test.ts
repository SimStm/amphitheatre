import { describe, expect, test } from "bun:test";
import { placePopover } from "./popover-position.ts";

const size = { width: 272, height: 200 };
const viewport = { width: 1440, height: 900 };

describe("placePopover", () => {
  test("centers beside the anchor with the arrow in the middle", () => {
    expect(placePopover({ anchor: { left: 34, right: 80, centerY: 450 }, size, viewport })).toEqual({
      left: 94,
      top: 350,
      arrowTop: 100,
      side: "right",
    });
  });

  test("stays inside the top edge and keeps the arrow on the anchor", () => {
    const place = placePopover({ anchor: { left: 34, right: 80, centerY: 60 }, size, viewport });
    expect(place.top).toBe(12);
    expect(place.arrowTop).toBe(48);
  });

  test("stays inside the bottom edge and keeps the arrow on the anchor", () => {
    const place = placePopover({ anchor: { left: 34, right: 80, centerY: 860 }, size, viewport });
    expect(place.top).toBe(688);
    expect(place.arrowTop).toBe(172);
  });

  test("keeps the arrow on the popover when the anchor is past its corner", () => {
    const place = placePopover({ anchor: { left: 34, right: 80, centerY: 2 }, size, viewport });
    expect(place.arrowTop).toBe(22);
  });

  test("opens on the left when the right side has no room", () => {
    const place = placePopover({ anchor: { left: 1380, right: 1420, centerY: 450 }, size, viewport });
    expect(place.side).toBe("left");
    expect(place.left).toBe(1094);
  });

  test("stays inside a narrow viewport", () => {
    const place = placePopover({
      anchor: { left: 154, right: 200, centerY: 300 },
      size,
      viewport: { width: 400, height: 600 },
    });
    expect(place.left).toBe(116);
    expect(place.side).toBe("none");
  });
});
