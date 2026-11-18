export type Locale = "en" | "pt-BR" | "es";
export type ThemeMode = "light" | "dark";

export type { AssignableRole, Role } from "@coliseum/shared";
export type {
  ChatMessage,
  ConnectionQuality,
  JoinResponse,
  MediaStatus,
  OmeInfo,
  PresenceState,
  Room,
  RoomBroadcast,
  RoomMember,
  SessionResponse,
  SessionUser,
  StreamProvider,
} from "@coliseum/shared";

import type { ConnectionQuality } from "@coliseum/shared";

export type ParticipantMedia = {
  speaking: boolean;
  audioLevel: number;
  camera: boolean;
  screen: boolean;
  mic: "on" | "muted" | "none";
  quality: ConnectionQuality | "unknown";
  adaptive: boolean;
};
