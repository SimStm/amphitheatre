import {
  IconLogout,
  IconMessageCircle,
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff,
  IconScreenShare,
  IconSettings,
  IconUsers,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { canShareScreen } from "../../hooks/use-media.ts";
import { cn } from "../../lib/cn.ts";
import { Avatar } from "../ui/avatar.tsx";
import { Button } from "../ui/button.tsx";
import { FloatSurface } from "../ui/float-surface.tsx";
import { IconButton } from "../ui/icon-button.tsx";
import { StatusDot } from "../ui/status-dot.tsx";
import { useRoomView } from "./room-view.tsx";

const dockGroup: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.035, delayChildren: 0.06 } },
};

const dockItem: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.86 },
  shown: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0.3, visualDuration: 0.32 },
  },
};

function DockItem({ children }: { children: ReactNode }) {
  return (
    <motion.span variants={dockItem} className="inline-flex">
      {children}
    </motion.span>
  );
}

function DockDivider() {
  return <span className="mx-0.5 h-7 w-px shrink-0 bg-border" aria-hidden="true" />;
}

function useUnreadLabel(): string {
  const { t } = useTranslation();
  const { unreadChat } = useRoomView();
  const chat = t("room.chatTitle");
  if (unreadChat === 0) return chat;
  const unread =
    unreadChat === 1
      ? t("a11y.unreadChatOne", { count: unreadChat })
      : t("a11y.unreadChat", { count: unreadChat });
  return `${chat}, ${unread}`;
}

export function RoomDock({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const view = useRoomView();
  const chatLabel = useUnreadLabel();
  const shareOk = canShareScreen();
  const badge = view.unreadChat > 99 ? "99+" : view.unreadChat || undefined;
  const micLabel = view.micLocked
    ? t("theater.mutedLocked")
    : view.micEnabled
      ? t("theater.micOn")
      : t("theater.micOff");
  const shareLabel = !shareOk
    ? t("theater.shareUnavailable")
    : view.screenEnabled
      ? t("theater.shareOn")
      : t("theater.shareAudioHint");

  return (
    <FloatSurface
      role="toolbar"
      aria-label={t("a11y.controlsRegion")}
      variants={dockGroup}
      initial="hidden"
      animate="shown"
      className={cn(
        "flex h-16 items-center",
        compact ? "w-full justify-between rounded-[var(--radius-control)] px-1.5" : "gap-2 px-2.5",
      )}
    >
      {compact ? (
        <DockItem>
          <IconButton
            label={micLabel}
            tone={view.micEnabled ? "raised" : "off"}
            aria-pressed={view.micEnabled}
            disabled={view.micLocked || view.livekitUnavailable || view.voiceLeft}
            onClick={() => void view.onMic(!view.micEnabled)}
          >
            {view.micEnabled ? (
              <IconMicrophone aria-hidden="true" stroke={1.75} />
            ) : (
              <IconMicrophoneOff aria-hidden="true" stroke={1.75} />
            )}
          </IconButton>
        </DockItem>
      ) : null}
      <DockItem>
        <IconButton
          label={view.cameraEnabled ? t("theater.camOn") : t("theater.camOff")}
          tone={view.cameraEnabled ? "active" : "raised"}
          aria-pressed={view.cameraEnabled}
          disabled={view.livekitUnavailable}
          onClick={() => void view.onCamera(!view.cameraEnabled)}
        >
          {view.cameraEnabled ? (
            <IconVideo aria-hidden="true" stroke={1.75} />
          ) : (
            <IconVideoOff aria-hidden="true" stroke={1.75} />
          )}
        </IconButton>
      </DockItem>
      <DockItem>
        <IconButton
          label={shareLabel}
          tone={view.screenEnabled ? "active" : "raised"}
          aria-pressed={view.screenEnabled}
          disabled={view.livekitUnavailable || !shareOk}
          onClick={() => void view.onScreen(!view.screenEnabled)}
        >
          <IconScreenShare aria-hidden="true" stroke={1.75} />
        </IconButton>
      </DockItem>
      {compact ? null : <DockDivider />}
      <DockItem>
        <IconButton
          label={chatLabel}
          tone={view.panel === "chat" ? "active" : "raised"}
          aria-pressed={view.panel === "chat"}
          badge={badge}
          onClick={() => view.togglePanel("chat")}
        >
          <IconMessageCircle aria-hidden="true" stroke={1.75} />
        </IconButton>
      </DockItem>
      <DockItem>
        <IconButton
          label={t("room.peopleButton", { count: view.peopleCount })}
          tone={view.panel === "people" ? "active" : "raised"}
          aria-pressed={view.panel === "people"}
          onClick={() => view.togglePanel("people")}
        >
          <IconUsers aria-hidden="true" stroke={1.75} />
        </IconButton>
      </DockItem>
      {compact ? null : (
        <>
          <DockDivider />
          <DockItem>
            <span className="relative inline-flex" title={view.selfName}>
              <Avatar id={view.selfId ?? view.selfName} name={view.selfName} size="md" className="size-9" />
              <StatusDot
                tone={view.micEnabled ? "speaking" : "idle"}
                className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-surface-raised"
              />
            </span>
          </DockItem>
        </>
      )}
      <DockItem>
        <IconButton label={t("theater.dockSettings")} onClick={view.onSettings}>
          <IconSettings aria-hidden="true" stroke={1.75} />
        </IconButton>
      </DockItem>
      <DockItem>
        {compact ? (
          <IconButton label={t("theater.leave")} tone="danger" onClick={view.onLeave}>
            <IconLogout aria-hidden="true" stroke={1.75} />
          </IconButton>
        ) : (
          <Button
            variant="danger"
            className="h-11 gap-2 rounded-[var(--radius-tile)] px-3.5 font-display"
            onClick={view.onLeave}
          >
            <IconPhoneOff className="size-[18px]" stroke={1.75} aria-hidden="true" />
            {t("theater.leave")}
          </Button>
        )}
      </DockItem>
    </FloatSurface>
  );
}
