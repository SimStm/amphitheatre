import { createContext, useContext, type ReactNode } from "react";
import type { StageStream } from "../../hooks/use-stage-streams.ts";
import type { RoomPeople } from "../../lib/room-people.ts";
import type {
  OmeInfo,
  ParticipantMedia,
  Role,
  Room,
  RoomBroadcast,
} from "../../shared-types.ts";

export type RoomPanelKind = "chat" | "people";

export type RoomView = {
  roomId: string;
  room: Room;
  selfId?: string;
  selfName: string;
  selfRole?: Role;
  people: RoomPeople;
  peopleCount: number;
  mediaByUserId: Record<string, ParticipantMedia>;
  localMutedUserIds: Record<string, true>;
  streams: StageStream[];
  selected: string[];
  broadcast: RoomBroadcast;
  ome: OmeInfo | null;
  omeLive: boolean;
  micEnabled: boolean;
  cameraEnabled: boolean;
  screenEnabled: boolean;
  micLocked: boolean;
  voiceLeft: boolean;
  voiceConnecting: boolean;
  livekitUnavailable: boolean;
  unreadChat: number;
  panel: RoomPanelKind | null;
  chat: ReactNode;
  setPanel: (panel: RoomPanelKind | null) => void;
  togglePanel: (panel: RoomPanelKind) => void;
  onMic: (next: boolean) => Promise<void>;
  onCamera: (next: boolean) => Promise<void>;
  onScreen: (next: boolean) => Promise<void>;
  onLeaveVoice: () => Promise<void>;
  onJoinVoice: () => void;
  onInvite: () => Promise<void>;
  onSettings: () => void;
  onLeave: () => void;
};

const RoomViewContext = createContext<RoomView | null>(null);

export const RoomViewProvider = RoomViewContext.Provider;

export function useRoomView(): RoomView {
  const view = useContext(RoomViewContext);
  if (!view) throw new Error("useRoomView must be used inside RoomViewProvider");
  return view;
}
