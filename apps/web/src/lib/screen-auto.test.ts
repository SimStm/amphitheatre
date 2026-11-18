import { describe, expect, test } from "bun:test";
import { AUTO_SCREEN_START_TIER, autoScreenTiers } from "./media-quality.ts";
import {
  initialAutoScreenState,
  isConnectionStrained,
  nextAutoScreenState,
  type AutoScreenSample,
} from "./screen-auto.ts";

const calm: AutoScreenSample = {
  sentBps: 4_000_000,
  availableBps: 20_000_000,
  limitation: "none",
  lossRatio: 0,
  rttMs: 30,
};

function run(samples: AutoScreenSample[], start = initialAutoScreenState(), highest = 3, from = 0) {
  return samples.reduce(
    (state, sample, index) => nextAutoScreenState(state, sample, from + index * 3_000, highest),
    start,
  );
}

describe("autoScreenTiers", () => {
  test("only video and games can reach 60 fps", () => {
    expect(autoScreenTiers("detail").every((tier) => tier.frameRate === 30)).toBe(true);
    expect(autoScreenTiers("motion").at(-1)?.frameRate).toBe(60);
  });
});

describe("isConnectionStrained", () => {
  test("detects limits, loss, and rising delay", () => {
    expect(isConnectionStrained(calm, 30)).toBe(false);
    expect(isConnectionStrained({ ...calm, limitation: "bandwidth" }, 30)).toBe(true);
    expect(isConnectionStrained({ ...calm, limitation: "cpu" }, 30)).toBe(true);
    expect(isConnectionStrained({ ...calm, lossRatio: 0.08 }, 30)).toBe(true);
    expect(isConnectionStrained({ ...calm, rttMs: 220 }, 30)).toBe(true);
  });

  test("an estimate close to the current limit is not a problem", () => {
    expect(isConnectionStrained({ ...calm, sentBps: 5_000_000, availableBps: 5_100_000 }, 30)).toBe(false);
  });
});

describe("nextAutoScreenState", () => {
  test("rises one step after a stable period", () => {
    const state = run(Array.from({ length: 5 }, () => calm));
    expect(state.tier).toBe(AUTO_SCREEN_START_TIER + 1);
    expect(state.stableSamples).toBe(0);
  });

  test("never passes the highest tier", () => {
    const state = run(Array.from({ length: 30 }, () => calm), undefined, 2);
    expect(state.tier).toBe(2);
  });

  test("drops at once and waits before rising again", () => {
    const dropped = nextAutoScreenState(
      initialAutoScreenState(),
      { ...calm, limitation: "bandwidth" },
      10_000,
      3,
    );
    expect(dropped.tier).toBe(AUTO_SCREEN_START_TIER - 1);
    const held = run(Array.from({ length: 6 }, () => calm), dropped, 3, 13_000);
    expect(held.tier).toBe(dropped.tier);
    const later = run(Array.from({ length: 5 }, () => calm), held, 3, 80_000);
    expect(later.tier).toBe(dropped.tier + 1);
  });

  test("does not rise while the estimate cannot carry the current level", () => {
    const low = { ...calm, availableBps: 2_000_000 };
    let state = initialAutoScreenState();
    for (let index = 0; index < 8; index += 1) {
      state = nextAutoScreenState(state, low, index * 3_000, 3, 5_000_000);
    }
    expect(state.tier).toBe(AUTO_SCREEN_START_TIER);
  });

  test("waits longer only when the problem comes back later", () => {
    const strained = { ...calm, limitation: "bandwidth" };
    const first = nextAutoScreenState({ ...initialAutoScreenState(), tier: 3 }, strained, 10_000, 3);
    const sameProblem = nextAutoScreenState(first, strained, 20_000, 3);
    const later = nextAutoScreenState({ ...sameProblem, tier: 3 }, strained, 100_000, 3);
    expect(first.holdUntil).toBe(70_000);
    expect(sameProblem.holdUntil).toBe(80_000);
    expect(later.holdUntil).toBe(220_000);
  });

  test("does not fall twice in a row without time to settle", () => {
    const start = { ...initialAutoScreenState(), tier: 3 };
    const strained = { ...calm, limitation: "bandwidth" };
    const first = nextAutoScreenState(start, strained, 10_000, 3);
    const second = nextAutoScreenState(first, strained, 13_000, 3);
    const third = nextAutoScreenState(second, strained, 16_000, 3);
    expect([first.tier, second.tier, third.tier]).toEqual([2, 2, 1]);
  });
});
