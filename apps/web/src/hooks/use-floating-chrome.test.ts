import { describe, expect, test } from "bun:test";
import { shouldHoldChrome } from "./use-floating-chrome.ts";

const free = { overFloat: false, paused: false, textFocused: false, dialogOpen: false };

describe("shouldHoldChrome", () => {
  test("nothing in use lets the interface hide", () => {
    expect(shouldHoldChrome(free)).toBe(false);
  });

  test("the pointer over a float keeps it", () => {
    expect(shouldHoldChrome({ ...free, overFloat: true })).toBe(true);
  });

  test("typing keeps it", () => {
    expect(shouldHoldChrome({ ...free, textFocused: true })).toBe(true);
  });

  test("an open dialog keeps it", () => {
    expect(shouldHoldChrome({ ...free, dialogOpen: true })).toBe(true);
  });

  test("an open mobile sheet keeps it", () => {
    expect(shouldHoldChrome({ ...free, paused: true })).toBe(true);
  });
});
