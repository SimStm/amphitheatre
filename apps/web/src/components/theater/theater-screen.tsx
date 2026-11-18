import { emptyBroadcast } from "@coliseum/shared";
import { useQuery } from "@tanstack/react-query";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useInvite } from "../../hooks/use-invite.ts";
import { useJoinFlow } from "../../hooks/use-join-flow.ts";
import { useLivekitRoom } from "../../hooks/use-livekit.ts";
import { useDelayedFlag, useTheaterLayout } from "../../hooks/use-media.ts";
import { useRoomSocket } from "../../hooks/use-room-socket.ts";
import { useStageStreams } from "../../hooks/use-stage-streams.ts";
import { useUnreadChat } from "../../hooks/use-unread-chat.ts";
import { getMedia, getRoom, getSession, leaveRoom } from "../../lib/api.ts";
import { canManageBroadcast, canSeeIngest } from "../../lib/permissions.ts";
import { buildPeople } from "../../lib/room-people.ts";
import { resolveSelection } from "../../lib/stage-selection.ts";
import type { JoinResponse } from "../../shared-types.ts";
import { useRoomStore } from "../../stores/room-store.ts";
import { useSessionStore } from "../../stores/session-store.ts";
import { useStageStore } from "../../stores/stage-store.ts";
import { HomeLayout } from "../home/home-screen.tsx";
import { JoinDialogs } from "../join/join-dialogs.tsx";
import { RoomViewProvider, type RoomPanelKind, type RoomView } from "../room/room-view.tsx";
import { TheaterSkeleton } from "../ui/skeleton.tsx";
import { hasBroadcastPlayback } from "./broadcast-pane.tsx";
import { ChatPanel } from "./chat-panel.tsx";
import { DesktopTheaterLayout } from "./desktop-theater-layout.tsx";
import { LeaveRoomDialog } from "./leave-room-dialog.tsx";
import { MobileTheaterLayout } from "./mobile-theater-layout.tsx";
import { RoomSettingsModal } from "./room-settings-modal.tsx";

export function TheaterScreen({ roomId }: { roomId: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const layout = useTheaterLayout();
  const user = useSessionStore((s) => s.user);
  const setSession = useSessionStore((s) => s.setSession);
  const room = useRoomStore((s) => s.room);
  const messages = useRoomStore((s) => s.messages);
  const ome = useRoomStore((s) => s.ome);
  const mediaByUserId = useRoomStore((s) => s.mediaByUserId);
  const voiceUserIds = useRoomStore((s) => s.voiceUserIds);
  const voiceLeft = useRoomStore((s) => s.voiceLeft);
  const localMutedUserIds = useRoomStore((s) => s.localMutedUserIds);
  const livekitStatus = useRoomStore((s) => s.livekitStatus);
  const micEnabled = useRoomStore((s) => s.micEnabled);
  const cameraEnabled = useRoomStore((s) => s.cameraEnabled);
  const screenEnabled = useRoomStore((s) => s.screenEnabled);
  const chatMutedUntil = useRoomStore((s) => s.chatMutedUntil);
  const setRoom = useRoomStore((s) => s.setRoom);
  const setOme = useRoomStore((s) => s.setOme);
  const setBroadcast = useRoomStore((s) => s.setBroadcast);
  const setLivekitCreds = useRoomStore((s) => s.setLivekitCreds);
  const reset = useRoomStore((s) => s.reset);
  const stageChoice = useStageStore((s) => s.choice);
  const clearStage = useStageStore((s) => s.clear);

  const [joined, setJoined] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [panel, setPanel] = useState<RoomPanelKind | null>(null);
  const allowNavRef = useRef(false);
  const startedRef = useRef<string | null>(null);

  useEffect(() => {
    allowNavRef.current = false;
    clearStage();
    return clearStage;
  }, [clearStage, roomId]);

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: getSession,
  });

  useEffect(() => {
    if (sessionQuery.data) setSession(sessionQuery.data);
  }, [sessionQuery.data, setSession]);

  const roomQuery = useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoom(roomId),
    retry: false,
    enabled: sessionQuery.isFetched,
  });

  useEffect(() => {
    if (roomQuery.data) setRoom(roomQuery.data);
  }, [roomQuery.data, setRoom]);

  const unreadChat = useUnreadChat({
    messages,
    selfId: user?.userId,
    chatVisible: panel === "chat",
    enabled: joined,
  });

  useEffect(() => {
    const base = room?.name ? `${room.name} · Amphitheatre` : "Amphitheatre";
    const badge = unreadChat > 99 ? "99+" : String(unreadChat);
    document.title = unreadChat > 0 ? `(${badge}) ${base}` : base;
    return () => {
      document.title = "Amphitheatre";
    };
  }, [room?.name, unreadChat]);

  const applyJoin = useCallback(
    (result: JoinResponse) => {
      setRoom(result.room);
      if (result.ome) setOme(result.ome);
      if (result.livekitToken && result.livekitUrl) {
        setLivekitCreds({ token: result.livekitToken, url: result.livekitUrl });
      }
      setJoined(true);
    },
    [setLivekitCreds, setOme, setRoom],
  );

  const flow = useJoinFlow({
    onJoined: (result, { interactive }) => {
      applyJoin(result);
      if (interactive) toast.success(t("toast.joined"));
    },
  });
  const { begin } = flow;

  useEffect(() => {
    if (!sessionQuery.isFetched || !roomQuery.isFetched) return;
    if (joined || startedRef.current === roomId) return;
    startedRef.current = roomId;
    const current = useSessionStore.getState().user;
    const fetched = roomQuery.data ?? null;
    const alreadyIn = fetched?.members?.some(
      (member) => member.userId === current?.userId && member.present,
    );
    if (alreadyIn) setJoined(true);
    else void begin(roomId, { room: fetched });
  }, [begin, joined, roomId, roomQuery.data, roomQuery.isFetched, sessionQuery.isFetched]);

  useQuery({
    queryKey: ["media", roomId],
    queryFn: async () => {
      const media = await getMedia(roomId);
      setOme(media.ome);
      if (media.broadcast) setBroadcast(media.broadcast);
      return media;
    },
    enabled: joined,
    refetchInterval: 8000,
  });

  const { sendChat, sendPresence } = useRoomSocket(roomId, joined);
  const livekit = useLivekitRoom(roomId, joined);

  useEffect(() => {
    if (!joined) return;
    sendPresence({ camera: cameraEnabled, screen: screenEnabled });
  }, [joined, cameraEnabled, screenEnabled, sendPresence]);

  const loading = sessionQuery.isLoading || roomQuery.isLoading;
  const showSkeleton = useDelayedFlag(loading);
  const invite = useInvite(roomId, room?.name ?? "");

  const broadcast = room?.broadcast ?? emptyBroadcast();
  const streams = useStageStreams(livekit.tiles, hasBroadcastPlayback(broadcast, ome));
  const stageIds = resolveSelection(stageChoice, streams);
  const stageKey = stageIds.join("|");
  const { setStageStreams } = livekit;

  useEffect(() => {
    setStageStreams(stageKey ? stageKey.split("|") : []);
  }, [stageKey, setStageStreams]);

  const people = useMemo(
    () =>
      buildPeople({
        members: room?.members ?? [],
        mediaByUserId,
        voiceUserIds,
        selfId: user?.userId,
        selfLeftVoice: voiceLeft,
      }),
    [mediaByUserId, room?.members, user?.userId, voiceLeft, voiceUserIds],
  );

  const selfMember = room?.members?.find((member) => member.userId === user?.userId);
  const omeLive = Boolean(ome?.healthy && ome.live);

  const shouldBlockFn = useCallback(
    ({ current, next }: { current: { pathname: string }; next: { pathname: string } }) => {
      if (allowNavRef.current) return false;
      if (!joined) return false;
      return current.pathname !== next.pathname;
    },
    [joined],
  );

  const blocker = useBlocker({
    shouldBlockFn,
    withResolver: true,
    enableBeforeUnload: false,
  });

  useEffect(() => {
    if (blocker.status === "blocked") setLeaveOpen(true);
  }, [blocker.status]);

  const cancelLeave = () => {
    setLeaveOpen(false);
    if (blocker.status === "blocked") blocker.reset();
  };

  const confirmLeave = () => {
    allowNavRef.current = true;
    setLeaveOpen(false);
    void leaveRoom(roomId).catch(() => undefined);
    reset();
    toast.success(t("toast.left"));
    if (blocker.status === "blocked") {
      blocker.proceed();
      return;
    }
    void navigate({ to: "/" });
  };

  if (showSkeleton) return <TheaterSkeleton />;
  if (loading) return <div className="min-h-dvh bg-surface-page" />;

  if (!joined || !room) {
    return (
      <>
        {flow.step ? <HomeLayout flow={flow} focusToken={0} /> : <div className="min-h-dvh bg-surface-page" />}
        <JoinDialogs
          flow={flow}
          onExit={() => void navigate({ to: "/" })}
          onOtherCode={() => {
            flow.close();
            void navigate({ to: "/", hash: "join" });
          }}
        />
      </>
    );
  }

  const selfName = user?.displayName ?? selfMember?.displayName ?? t("home.guestName");
  const view: RoomView = {
    roomId,
    room,
    selfId: user?.userId,
    selfName,
    selfRole: selfMember?.role,
    people,
    peopleCount: people.voice.length + people.chatOnly.length,
    mediaByUserId,
    localMutedUserIds,
    streams,
    selected: stageIds,
    broadcast,
    ome,
    omeLive,
    micEnabled,
    cameraEnabled,
    screenEnabled,
    micLocked: Boolean(selfMember?.muted),
    voiceLeft,
    voiceConnecting: livekitStatus === "connecting",
    livekitUnavailable: livekitStatus === "unavailable",
    unreadChat,
    panel,
    chat: (
      <ChatPanel
        messages={messages}
        selfId={user?.userId}
        selfName={selfName}
        roomName={room.name}
        mutedUntil={chatMutedUntil}
        onSend={(text) => sendChat(text)}
      />
    ),
    setPanel,
    togglePanel: (next) => setPanel((current) => (current === next ? null : next)),
    onMic: livekit.setMic,
    onCamera: livekit.setCamera,
    onScreen: livekit.setScreen,
    onLeaveVoice: livekit.leaveVoice,
    onJoinVoice: livekit.joinVoice,
    onInvite: invite,
    onSettings: () => setSettingsOpen(true),
    onLeave: () => setLeaveOpen(true),
  };

  return (
    <RoomViewProvider value={view}>
      {layout === "mobile" ? <MobileTheaterLayout /> : <DesktopTheaterLayout />}
      <LeaveRoomDialog open={leaveOpen} onCancel={cancelLeave} onConfirm={confirmLeave} />
      <RoomSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        roomId={roomId}
        broadcast={broadcast}
        floodBanSec={room.chatFloodBanSec ?? 60}
        ingest={selfMember && canSeeIngest(selfMember.role) ? ome?.ingest : null}
        canAdmin={Boolean(selfMember && canManageBroadcast(selfMember.role))}
        listDevices={livekit.listDevices}
        switchDevice={livekit.switchDevice}
        setOutputVolume={livekit.setOutputVolume}
        setInputVolume={livekit.setInputVolume}
        micEnabled={micEnabled}
        micLocked={Boolean(selfMember?.muted)}
        setMic={livekit.setMic}
        applyMediaQuality={livekit.applyMediaQuality}
        onChatSaved={(sec) => setRoom({ ...room, chatFloodBanSec: sec })}
      />
    </RoomViewProvider>
  );
}
