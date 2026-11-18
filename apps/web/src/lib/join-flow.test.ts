import { describe, expect, test } from "bun:test";
import { ApiError } from "./api.ts";
import { attemptJoin, attemptsLeft, nameToSave, type JoinApi } from "./join-flow.ts";
import type { JoinResponse, Room } from "../shared-types.ts";

const room = { id: "Ab3Kxy9m", name: "Friday", hasPassword: true } as Room;
const joined = { room, role: "member" } as JoinResponse;

function apiError(status: number, code: string, remainingMs?: number) {
  return new ApiError({ status, code, message: code, remainingMs });
}

function api(join: () => Promise<JoinResponse>, get: () => Promise<Room> = async () => room): JoinApi {
  return { getRoom: get, joinRoom: join };
}

function failing(error: unknown): JoinApi {
  return api(async () => {
    throw error;
  });
}

describe("attemptJoin", () => {
  test("returns the join result", async () => {
    const step = await attemptJoin({ code: room.id, api: api(async () => joined) });
    expect(step).toEqual({ kind: "joined", result: joined });
  });

  test("a missing room is an invalid code and keeps its exact case", async () => {
    const step = await attemptJoin({
      code: "Xk7pQ2",
      api: api(
        async () => joined,
        async () => {
          throw apiError(404, "not_found");
        },
      ),
    });
    expect(step).toEqual({ kind: "invalid", code: "Xk7pQ2" });
  });

  test("asking for a password without sending one is not a failure", async () => {
    const step = await attemptJoin({ code: room.id, api: failing(apiError(403, "invalid_password")) });
    expect(step).toEqual({ kind: "password", room, wrong: false, failures: 0 });
  });

  test("a wrong password counts as a failure", async () => {
    const step = await attemptJoin({
      code: room.id,
      password: "nope",
      failures: 1,
      room,
      api: failing(apiError(403, "invalid_password")),
    });
    expect(step).toEqual({ kind: "password", room, wrong: true, failures: 2 });
  });

  test("a lockout carries the time it ends", async () => {
    const step = await attemptJoin({
      code: room.id,
      password: "nope",
      room,
      now: 1000,
      api: failing(apiError(429, "locked_out", 5000)),
    });
    expect(step).toEqual({ kind: "locked", room, until: 6000 });
  });

  test("a full room opens the full step", async () => {
    const step = await attemptJoin({ code: room.id, room, api: failing(apiError(409, "room_full")) });
    expect(step).toEqual({ kind: "full", room });
  });

  test("no session asks for a name", async () => {
    const step = await attemptJoin({ code: room.id, room, api: failing(apiError(401, "unauthorized")) });
    expect(step).toEqual({ kind: "needs-name", room });
  });

  test("a taken name asks for another", async () => {
    const step = await attemptJoin({
      code: room.id,
      room,
      api: failing(apiError(409, "duplicate_display_name")),
    });
    expect(step).toEqual({ kind: "duplicate-name", room });
  });

  test("a ban shows its own message", async () => {
    const step = await attemptJoin({ code: room.id, room, api: failing(apiError(403, "banned")) });
    expect(step).toEqual({ kind: "failed", room, messageKey: "join.banned" });
  });

  test("a network failure stays generic", async () => {
    const step = await attemptJoin({ code: room.id, room, api: failing(new TypeError("offline")) });
    expect(step).toEqual({ kind: "failed", room, messageKey: "toast.joinFailed" });
  });
});

describe("attemptsLeft", () => {
  test("counts down and never reaches zero", () => {
    expect(attemptsLeft(0)).toBe(3);
    expect(attemptsLeft(2)).toBe(1);
    expect(attemptsLeft(5)).toBe(1);
  });
});

describe("nameToSave", () => {
  test("returns a typed name that differs from the session", () => {
    expect(nameToSave("  Ana  ", "Bia")).toBe("Ana");
    expect(nameToSave("Ana", null)).toBe("Ana");
  });

  test("ignores the same name and invalid drafts", () => {
    expect(nameToSave(" Ana ", "Ana")).toBeNull();
    expect(nameToSave("   ", "Ana")).toBeNull();
    expect(nameToSave("x".repeat(200), "Ana")).toBeNull();
  });
});
