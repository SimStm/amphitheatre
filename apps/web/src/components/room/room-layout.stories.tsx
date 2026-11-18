import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Track } from "livekit-client";
import { useMemo, useState } from "react";
import type { StageStream } from "../../hooks/use-stage-streams.ts";
import { buildPeople } from "../../lib/room-people.ts";
import { resolveSelection } from "../../lib/stage-selection.ts";
import type { ChatMessage, ParticipantMedia, Room, RoomMember } from "../../shared-types.ts";
import { useStageStore } from "../../stores/stage-store.ts";
import { ChatPanel } from "../theater/chat-panel.tsx";
import { DesktopTheaterLayout } from "../theater/desktop-theater-layout.tsx";
import { MobileTheaterLayout } from "../theater/mobile-theater-layout.tsx";
import { RoomViewProvider, type RoomPanelKind, type RoomView } from "./room-view.tsx";

function member(userId: string, displayName: string, patch: Partial<RoomMember> = {}): RoomMember {
  return { userId, displayName, role: "member", muted: false, present: true, connected: true, ...patch };
}

function media(patch: Partial<ParticipantMedia> = {}): ParticipantMedia {
  return {
    speaking: false,
    audioLevel: 0,
    camera: false,
    screen: false,
    mic: "on",
    quality: "good",
    adaptive: false,
    ...patch,
  };
}

const members = [
  member("alex", "Alex", { role: "owner" }),
  member("marina", "Marina"),
  member("rafa", "Rafa"),
  member("bia", "Bia"),
  member("theo", "Theo"),
  member("nina", "Nina"),
  member("otto", "Otto"),
];

const mediaByUserId: Record<string, ParticipantMedia> = {
  alex: media({ camera: true }),
  marina: media({ screen: true, quality: "excellent" }),
  rafa: media({ speaking: true, camera: true }),
  bia: media({ mic: "muted", camera: true, quality: "poor" }),
  theo: media({ mic: "none" }),
};

const room: Room = {
  id: "Ab3Kxy9m",
  name: "Friday game night",
  isPublic: true,
  hasPassword: false,
  memberLimit: 20,
  memberCount: members.length,
  ownerId: "alex",
  createdAt: "2026-11-18T20:00:00.000Z",
  broadcast: { enabled: false, provider: "ome", embed: null } as unknown as Room["broadcast"],
  chatFloodBanSec: 60,
  members,
};

const messages: ChatMessage[] = [
  { id: "1", roomId: room.id, userId: "rafa", displayName: "Rafa", text: "Did everyone get the invite?", createdAt: room.createdAt },
  { id: "2", roomId: room.id, userId: "marina", displayName: "Marina", text: "@Alex can you see my screen?", createdAt: room.createdAt },
  { id: "3", roomId: room.id, userId: "alex", displayName: "Alex", text: "Yes, loud and clear.", createdAt: room.createdAt },
];

function canvasTrack(label: string, hue: number): Track {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const context = canvas.getContext("2d");
  let frame = 0;
  const draw = () => {
    if (!context) return;
    frame += 1;
    const gradient = context.createLinearGradient(0, 0, 1280, 720);
    gradient.addColorStop(0, `hsl(${hue} 48% 24%)`);
    gradient.addColorStop(1, `hsl(${hue + 40} 52% 12%)`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1280, 720);
    context.fillStyle = "rgb(255 255 255 / 0.12)";
    context.beginPath();
    context.arc(640 + Math.sin(frame / 30) * 300, 360, 150, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "white";
    context.font = "600 56px sans-serif";
    context.fillText(label, 64, 110);
  };
  draw();
  window.setInterval(draw, 100);
  const stream = canvas.captureStream(10);
  return {
    attach: (element: HTMLVideoElement) => {
      element.srcObject = stream;
      return element;
    },
    detach: (element: HTMLVideoElement) => {
      element.srcObject = null;
      return [element];
    },
  } as unknown as Track;
}

function stream(id: string, kind: "screen" | "camera", identity: string, name: string, hue: number): StageStream {
  return { id, kind, identity, name, label: name, isLocal: false, track: canvasTrack(name, hue) };
}

function RoomHarness({ mobile, withStreams }: { mobile?: boolean; withStreams?: boolean }) {
  const choice = useStageStore((s) => s.choice);
  const [panel, setPanel] = useState<RoomPanelKind | null>(null);
  const streams = useMemo(
    () =>
      withStreams
        ? [
            stream("s1", "screen", "marina", "Marina", 24),
            stream("c1", "camera", "alex", "Alex", 200),
            stream("c2", "camera", "rafa", "Rafa", 140),
            stream("c3", "camera", "bia", "Bia", 310),
          ]
        : [],
    [withStreams],
  );
  const people = buildPeople({
    members,
    mediaByUserId,
    voiceUserIds: { alex: true, marina: true, rafa: true, bia: true, theo: true },
    selfId: "alex",
    selfLeftVoice: false,
  });
  const action = async () => undefined;
  const view: RoomView = {
    roomId: room.id,
    room,
    selfId: "alex",
    selfName: "Alex",
    selfRole: "owner",
    people,
    peopleCount: members.length,
    mediaByUserId,
    localMutedUserIds: {},
    streams,
    selected: resolveSelection(choice, streams),
    broadcast: room.broadcast,
    ome: null,
    omeLive: false,
    micEnabled: true,
    cameraEnabled: true,
    screenEnabled: false,
    micLocked: false,
    voiceLeft: false,
    voiceConnecting: false,
    livekitUnavailable: false,
    unreadChat: panel === "chat" ? 0 : 2,
    panel,
    chat: <ChatPanel messages={messages} selfId="alex" selfName="Alex" roomName={room.name} onSend={() => true} />,
    setPanel,
    togglePanel: (next) => setPanel((current) => (current === next ? null : next)),
    onMic: action,
    onCamera: action,
    onScreen: action,
    onLeaveVoice: action,
    onJoinVoice: () => undefined,
    onInvite: action,
    onSettings: () => undefined,
    onLeave: () => undefined,
  };

  return (
    <RoomViewProvider value={view}>
      <div className="fixed inset-0 z-50">
        {mobile ? <MobileTheaterLayout /> : <DesktopTheaterLayout />}
      </div>
    </RoomViewProvider>
  );
}

const meta: Meta<typeof RoomHarness> = {
  title: "Room/Layout",
  component: RoomHarness,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof RoomHarness>;

export const PeopleOnline: Story = {};
export const SeveralStreams: Story = { args: { withStreams: true } };
export const MobilePeople: Story = { args: { mobile: true } };
export const MobileStreams: Story = { args: { mobile: true, withStreams: true } };
