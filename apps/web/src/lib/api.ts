import type {
  AssignableRole,
  BroadcastUpdate,
  ChatMessage,
  JoinResponse,
  LivekitInfo,
  MediaStatus,
  OmeInfo,
  Room,
  RoomBroadcast,
  SessionResponse,
  SessionUser,
} from "@coliseum/shared";
import { apiPaths, emptyBroadcast } from "@coliseum/shared";

export class ApiError extends Error {
  status: number;
  code: string;
  remainingMs?: number;

  constructor(input: { status: number; code: string; message: string; remainingMs?: number }) {
    super(input.message);
    this.name = "ApiError";
    this.status = input.status;
    this.code = input.code;
    this.remainingMs = input.remainingMs;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

function toApiError(res: Response, body: unknown): ApiError {
  const record = isRecord(body) ? body : {};
  const remainingMs =
    asNumber(record.retryAfterMs) ??
    (res.headers.get("Retry-After")
      ? Number(res.headers.get("Retry-After")) * 1000
      : undefined);
  return new ApiError({
    status: res.status,
    code: asString(record.error) ?? "http_error",
    message: asString(record.message) ?? res.statusText,
    remainingMs: Number.isFinite(remainingMs) ? remainingMs : undefined,
  });
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (authToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }
  const res = await fetch(path, {
    credentials: "include",
    ...init,
    headers,
  });
  const body = await parseBody(res);
  if (!res.ok) throw toApiError(res, body);
  return body as T;
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    return await request<SessionUser>(apiPaths.session);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function createSession(displayName: string): Promise<SessionResponse> {
  const data = await request<SessionResponse>(apiPaths.session, {
    method: "POST",
    body: JSON.stringify({ displayName }),
  });
  setAuthToken(data.token);
  return data;
}

export async function createRoom(input: {
  name: string;
  password?: string;
  memberLimit?: number;
  isPublic?: boolean;
}): Promise<Room> {
  return request<Room>(apiPaths.rooms, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function listRooms(): Promise<Room[]> {
  return request<Room[]>(apiPaths.rooms);
}

export async function getRoom(roomId: string): Promise<Room> {
  return request<Room>(apiPaths.room(roomId));
}

export async function joinRoom(roomId: string, password?: string): Promise<JoinResponse> {
  return request<JoinResponse>(apiPaths.roomJoin(roomId), {
    method: "POST",
    body: JSON.stringify(password ? { password } : {}),
  });
}

export async function leaveRoom(roomId: string): Promise<void> {
  await request(apiPaths.roomLeave(roomId), { method: "POST" });
}

export async function kickMember(roomId: string, userId: string): Promise<void> {
  await request(apiPaths.roomKick(roomId), {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function muteMember(
  roomId: string,
  input: { userId: string; muted: boolean },
): Promise<void> {
  await request(apiPaths.roomMute(roomId), {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function banMember(roomId: string, userId: string): Promise<void> {
  await request(apiPaths.roomBan(roomId), {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function unbanMember(roomId: string, userId: string): Promise<void> {
  await request(apiPaths.roomUnban(roomId), {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function setMemberRole(
  roomId: string,
  input: { userId: string; role: AssignableRole },
): Promise<void> {
  await request(apiPaths.roomRoles(roomId), {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getLivekitToken(
  roomId: string,
): Promise<{ token: string; url: string } | null> {
  try {
    const data = await request<{ token?: string; livekitUrl?: string | null }>(
      apiPaths.roomLivekitToken(roomId),
    );
    if (!data.token || !data.livekitUrl) return null;
    return { token: data.token, url: data.livekitUrl };
  } catch (error) {
    if (error instanceof ApiError && error.code === "livekit_unavailable") return null;
    throw error;
  }
}

export async function getMedia(roomId: string): Promise<MediaStatus> {
  try {
    return await request<MediaStatus>(apiPaths.roomMedia(roomId));
  } catch {
    return {
      livekit: { ok: false } satisfies LivekitInfo,
      ome: { configured: false, healthy: false, live: false, reachable: false, playbackUrl: null, llhlsUrl: null },
      broadcast: emptyBroadcast(),
    };
  }
}

export async function updateRoomChat(
  roomId: string,
  floodBanSec: 60 | 120,
): Promise<{ room: Room }> {
  return request<{ room: Room }>(apiPaths.roomChat(roomId), {
    method: "PATCH",
    body: JSON.stringify({ floodBanSec }),
  });
}

export async function updateRoomStream(
  roomId: string,
  input: BroadcastUpdate,
): Promise<{ room: Room; ome?: OmeInfo }> {
  return request<{ room: Room; ome?: OmeInfo }>(apiPaths.roomStream(roomId), {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function parseRoomCode(input: string): string {
  const trimmed = input.trim();
  try {
    const url = new URL(trimmed);
    const match = url.pathname.match(/\/rooms\/([^/]+)/i);
    if (match?.[1]) return decodeURIComponent(match[1]);
  } catch {
    // not a URL
  }
  return trimmed.replace(/^#\/?/, "").replace(/^rooms\//i, "");
}

export function isLockoutError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    (error.code === "locked_out" ||
      (error.status === 429 && error.code !== "rate_limited" && error.remainingMs !== undefined))
  );
}

export function isNotFoundError(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    (error.status === 404 || error.status === 400 || error.code === "not_found")
  );
}

export function roomWsUrl(roomId: string): string {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const path = apiPaths.roomWs(roomId);
  const token = getAuthToken();
  const query = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${protocol}//${window.location.host}${path}${query}`;
}

export function asChat(value: unknown): ChatMessage | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  const text = asString(value.text);
  const userId = asString(value.userId);
  if (!id || !text || !userId) return null;
  return {
    id,
    roomId: asString(value.roomId) ?? "",
    userId,
    displayName: asString(value.displayName) ?? "Guest",
    text,
    createdAt: asString(value.createdAt) ?? new Date().toISOString(),
  };
}

export function asOme(value: unknown): OmeInfo | null {
  if (!isRecord(value)) return null;
  return {
    configured: Boolean(value.configured),
    healthy: Boolean(value.healthy),
    live: Boolean(value.live),
    reachable: value.reachable === undefined ? undefined : Boolean(value.reachable),
    playbackUrl: asString(value.playbackUrl) ?? null,
    llhlsUrl: asString(value.llhlsUrl) ?? null,
    ingest: isRecord(value.ingest)
      ? {
          rtmpUrl: asString(value.ingest.rtmpUrl) ?? "",
          streamKey: asString(value.ingest.streamKey) ?? "",
        }
      : null,
  };
}

export function asBroadcast(value: unknown): RoomBroadcast | null {
  if (!isRecord(value)) return null;
  const provider = asString(value.provider);
  if (
    provider !== "none" &&
    provider !== "ome" &&
    provider !== "twitch" &&
    provider !== "youtube" &&
    provider !== "kick" &&
    provider !== "custom"
  ) {
    return null;
  }
  return {
    enabled: Boolean(value.enabled),
    provider,
    embed: asString(value.embed) ?? null,
  };
}
