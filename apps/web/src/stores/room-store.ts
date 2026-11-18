import { create } from "zustand";
import type { RoomBroadcast } from "@coliseum/shared";
import type { ChatMessage, OmeInfo, ParticipantMedia, Room, RoomMember } from "../shared-types.ts";
import type { AutoScreenTier } from "../lib/media-quality.ts";

type LivekitStatus = "idle" | "connecting" | "connected" | "reconnecting" | "unavailable";

type RoomState = {
  room: Room | null;
  messages: ChatMessage[];
  ome: OmeInfo | null;
  mediaByUserId: Record<string, ParticipantMedia>;
  livekitStatus: LivekitStatus;
  livekitCreds: { token: string; url: string } | null;
  micEnabled: boolean;
  cameraEnabled: boolean;
  screenEnabled: boolean;
  screenAutoTier: AutoScreenTier | null;
  chatMutedUntil: number | null;
  localMutedUserIds: Record<string, true>;
  voiceUserIds: Record<string, true>;
  voiceLeft: boolean;
  chatDraft: string;
  setRoom: (room: Room | null) => void;
  setBroadcast: (broadcast: RoomBroadcast) => void;
  patchMembers: (members: RoomMember[]) => void;
  upsertMember: (member: RoomMember) => void;
  removeMember: (userId: string) => void;
  addMessage: (message: ChatMessage) => void;
  setOme: (ome: OmeInfo | null) => void;
  setMedia: (userId: string, media: Partial<ParticipantMedia>) => void;
  resetMedia: () => void;
  setLivekitStatus: (livekitStatus: LivekitStatus) => void;
  setLivekitCreds: (livekitCreds: { token: string; url: string } | null) => void;
  setScreenAutoTier: (tier: AutoScreenTier | null) => void;
  setLocalMediaFlags: (flags: {
    micEnabled?: boolean;
    cameraEnabled?: boolean;
    screenEnabled?: boolean;
  }) => void;
  setChatMutedUntil: (until: number | null) => void;
  setLocalMuted: (userId: string, muted: boolean) => void;
  setVoiceUsers: (userIds: string[]) => void;
  setVoiceLeft: (voiceLeft: boolean) => void;
  setChatDraft: (chatDraft: string) => void;
  reset: () => void;
};

const emptyMedia: ParticipantMedia = {
  speaking: false,
  audioLevel: 0,
  camera: false,
  screen: false,
  mic: "none",
  quality: "unknown",
  adaptive: false,
};

const initial = {
  room: null as Room | null,
  messages: [] as ChatMessage[],
  ome: null as OmeInfo | null,
  mediaByUserId: {} as Record<string, ParticipantMedia>,
  livekitStatus: "idle" as LivekitStatus,
  livekitCreds: null as { token: string; url: string } | null,
  micEnabled: false,
  cameraEnabled: false,
  screenEnabled: false,
  screenAutoTier: null,
  chatMutedUntil: null as number | null,
  localMutedUserIds: {} as Record<string, true>,
  voiceUserIds: {} as Record<string, true>,
  voiceLeft: false,
  chatDraft: "",
};

export const useRoomStore = create<RoomState>((set) => ({
  ...initial,
  setRoom: (room) => set({ room }),
  setBroadcast: (broadcast) =>
    set((state) => (state.room ? { room: { ...state.room, broadcast } } : state)),
  patchMembers: (members) =>
    set((state) => (state.room ? { room: { ...state.room, members, memberCount: members.length } } : state)),
  upsertMember: (member) =>
    set((state) => {
      if (!state.room) return state;
      const existing = state.room.members ?? [];
      const exists = existing.some((item) => item.userId === member.userId);
      const members = exists
        ? existing.map((item) => (item.userId === member.userId ? member : item))
        : [...existing, member];
      return { room: { ...state.room, members, memberCount: members.length } };
    }),
  removeMember: (userId) =>
    set((state) => {
      if (!state.room?.members) return state;
      const members = state.room.members.filter((item) => item.userId !== userId);
      return { room: { ...state.room, members, memberCount: members.length } };
    }),
  addMessage: (message) =>
    set((state) => ({
      messages: state.messages.some((item) => item.id === message.id)
        ? state.messages
        : [...state.messages.slice(-199), message],
    })),
  setOme: (ome) => set({ ome }),
  setMedia: (userId, media) =>
    set((state) => ({
      mediaByUserId: {
        ...state.mediaByUserId,
        [userId]: { ...(state.mediaByUserId[userId] ?? emptyMedia), ...media },
      },
    })),
  resetMedia: () => set({ mediaByUserId: {} }),
  setLivekitStatus: (livekitStatus) => set({ livekitStatus }),
  setLivekitCreds: (livekitCreds) => set({ livekitCreds }),
  setScreenAutoTier: (screenAutoTier) => set({ screenAutoTier }),
  setLocalMediaFlags: (flags) => set(flags),
  setChatMutedUntil: (until) => set({ chatMutedUntil: until }),
  setLocalMuted: (userId, muted) =>
    set((state) => {
      const next = { ...state.localMutedUserIds };
      if (muted) next[userId] = true;
      else delete next[userId];
      return { localMutedUserIds: next };
    }),
  setVoiceUsers: (userIds) =>
    set({ voiceUserIds: Object.fromEntries(userIds.map((id) => [id, true as const])) }),
  setVoiceLeft: (voiceLeft) => set({ voiceLeft }),
  setChatDraft: (chatDraft) => set({ chatDraft }),
  reset: () => set({ ...initial }),
}));
