import { describe, expect, test } from "bun:test";
import {
  defaultSelection,
  focusStream,
  resolveSelection,
  toggleStream,
  type SelectableStream,
} from "./stage-selection.ts";

const camera: SelectableStream = { id: "cam", kind: "camera" };
const screen: SelectableStream = { id: "screen", kind: "screen" };
const broadcast: SelectableStream = { id: "broadcast", kind: "broadcast" };

describe("defaultSelection", () => {
  test("prefers the broadcast, then a screen, then a camera", () => {
    expect(defaultSelection([camera, screen, broadcast])).toEqual(["broadcast"]);
    expect(defaultSelection([camera, screen])).toEqual(["screen"]);
    expect(defaultSelection([camera])).toEqual(["cam"]);
    expect(defaultSelection([])).toEqual([]);
  });
});

describe("resolveSelection", () => {
  test("an ended stream leaves the selection", () => {
    expect(resolveSelection(["cam", "gone"], [camera, screen])).toEqual(["cam"]);
  });

  test("an empty result falls back to the default", () => {
    expect(resolveSelection(["gone"], [camera, screen])).toEqual(["screen"]);
  });
});

describe("selection changes", () => {
  test("focus keeps only one stream", () => {
    expect(focusStream("cam")).toEqual(["cam"]);
  });

  test("toggle adds to what is currently shown", () => {
    expect(toggleStream(null, [camera, screen], "cam")).toEqual(["screen", "cam"]);
  });

  test("toggle removes a stream", () => {
    expect(toggleStream(["screen", "cam"], [camera, screen], "cam")).toEqual(["screen"]);
  });

  test("removing the last stream returns to the default", () => {
    expect(toggleStream(["cam"], [camera, screen], "cam")).toBeNull();
  });
});
