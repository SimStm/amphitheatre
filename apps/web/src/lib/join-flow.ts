import type { JoinResponse, Room } from "../shared-types.ts";
import { ApiError, isLockoutError, isNotFoundError } from "./api.ts";
import { joinErrorMessageKey } from "./join-errors.ts";
import { displayNameSchema } from "./schemas.ts";

export const MAX_PASSWORD_ATTEMPTS = 3;
const DEFAULT_LOCKOUT_MS = 5 * 60 * 1000;

/** The typed name when it is valid and differs from the session's name. */
export function nameToSave(draft: string, current: string | null | undefined): string | null {
  const parsed = displayNameSchema.safeParse(draft);
  if (!parsed.success || parsed.data === current) return null;
  return parsed.data;
}

export type JoinStep =
  | { kind: "joined"; result: JoinResponse }
  | { kind: "password"; room: Room; failures: number; wrong: boolean }
  | { kind: "locked"; room: Room; until: number }
  | { kind: "full"; room: Room }
  | { kind: "invalid"; code: string }
  | { kind: "needs-name"; room: Room | null }
  | { kind: "duplicate-name"; room: Room }
  | { kind: "failed"; room: Room | null; messageKey: string };

export type JoinApi = {
  getRoom: (code: string) => Promise<Room>;
  joinRoom: (code: string, password?: string) => Promise<JoinResponse>;
};

export type JoinAttempt = {
  code: string;
  password?: string;
  failures?: number;
  room?: Room | null;
  now?: number;
  api: JoinApi;
};

export function attemptsLeft(failures: number): number {
  return Math.max(1, MAX_PASSWORD_ATTEMPTS - failures);
}

export async function attemptJoin({
  code,
  password,
  failures = 0,
  room: known,
  now = Date.now(),
  api,
}: JoinAttempt): Promise<JoinStep> {
  let room = known ?? null;
  if (!room) {
    try {
      room = await api.getRoom(code);
    } catch (error) {
      if (isNotFoundError(error)) return { kind: "invalid", code };
      return { kind: "failed", room: null, messageKey: joinErrorMessageKey(error) };
    }
  }

  try {
    const result = await api.joinRoom(code, password || undefined);
    return { kind: "joined", result };
  } catch (error) {
    if (isLockoutError(error)) {
      return { kind: "locked", room, until: now + (error.remainingMs ?? DEFAULT_LOCKOUT_MS) };
    }
    if (!(error instanceof ApiError)) {
      return { kind: "failed", room, messageKey: joinErrorMessageKey(error) };
    }
    switch (error.code) {
      case "invalid_password":
        return {
          kind: "password",
          room,
          wrong: Boolean(password),
          failures: failures + (password ? 1 : 0),
        };
      case "room_full":
      case "conflict":
        return { kind: "full", room };
      case "duplicate_display_name":
        return { kind: "duplicate-name", room };
      case "not_found":
        return { kind: "invalid", code };
      case "unauthorized":
        return { kind: "needs-name", room };
      default:
        return { kind: "failed", room, messageKey: joinErrorMessageKey(error) };
    }
  }
}
