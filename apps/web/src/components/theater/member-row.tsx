import {
  IconCircleOff,
  IconHeadphones,
  IconMicrophoneOff,
  IconScreenShare,
  IconVideo,
  IconVolumeOff,
} from "@tabler/icons-react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { isListeningOnly, isMicMuted, type RoomPerson } from "../../lib/room-people.ts";
import type { Role } from "../../shared-types.ts";
import { Avatar } from "../ui/avatar.tsx";
import { RoleBadge } from "../ui/role-badge.tsx";
import { SignalBars } from "../ui/signal-bars.tsx";
import { MemberPermissionsModal } from "./member-permissions-modal.tsx";

const qualityKey = {
  excellent: "indicator.qualityExcellent",
  good: "indicator.qualityGood",
  poor: "indicator.qualityPoor",
  lost: "indicator.qualityLost",
  unknown: "indicator.qualityUnknown",
} as const;

type MemberRowProps = {
  person: RoomPerson;
  actorRole?: Role;
  omeLive?: boolean;
  roomId: string;
  localMuted?: boolean;
};

function Status({ icon, label, danger }: { icon: ReactNode; label: string; danger?: boolean }) {
  return (
    <span className={danger ? "inline-flex items-center gap-1 text-danger-text" : "inline-flex items-center gap-1"}>
      {icon}
      {label}
    </span>
  );
}

export function MemberRow({ person, actorRole, omeLive, roomId, localMuted }: MemberRowProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { member, media, isSelf } = person;
  const quality = media?.quality ?? "unknown";
  const iconClass = "size-3.5";

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 w-full items-center gap-2.5 rounded-[var(--radius-tile)] px-2 py-1.5 text-left transition-colors hover:bg-surface-bright"
      >
        <Avatar
          id={member.userId}
          name={member.displayName}
          size="sm"
          speaking={media?.speaking}
          self={isSelf}
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate font-display text-[13.5px] font-bold text-ink">
              {isSelf ? t("room.you", { name: member.displayName }) : member.displayName}
            </span>
            {member.role !== "member" ? <RoleBadge role={member.role} className="shrink-0" /> : null}
          </span>
          <span className="mt-0.5 flex flex-wrap gap-x-2.5 gap-y-0.5 text-xs text-ink-dim">
            {media?.speaking ? <span className="font-bold text-speaking">{t("indicator.speaking")}</span> : null}
            {isMicMuted(person) ? (
              <Status
                danger
                icon={<IconMicrophoneOff className={iconClass} stroke={1.75} aria-hidden="true" />}
                label={t("indicator.muted")}
              />
            ) : null}
            {isListeningOnly(person) ? (
              <Status
                icon={<IconHeadphones className={iconClass} stroke={1.75} aria-hidden="true" />}
                label={t("room.listening")}
              />
            ) : null}
            {localMuted ? (
              <Status
                icon={<IconVolumeOff className={iconClass} stroke={1.75} aria-hidden="true" />}
                label={t("indicator.locallyMuted")}
              />
            ) : null}
            {media?.camera ? (
              <Status
                icon={<IconVideo className={iconClass} stroke={1.75} aria-hidden="true" />}
                label={t("indicator.camera")}
              />
            ) : null}
            {media?.screen ? (
              <Status
                icon={<IconScreenShare className={iconClass} stroke={1.75} aria-hidden="true" />}
                label={t("indicator.screen")}
              />
            ) : null}
            {member.connected === false ? (
              <Status
                icon={<IconCircleOff className={iconClass} stroke={1.75} aria-hidden="true" />}
                label={t("indicator.offline")}
              />
            ) : null}
            {omeLive ? <span>{t("indicator.ome")}</span> : null}
          </span>
        </span>
        {person.inVoice ? <SignalBars quality={quality} label={t(qualityKey[quality])} /> : null}
      </button>
      <MemberPermissionsModal
        open={open}
        onClose={() => setOpen(false)}
        roomId={roomId}
        actorRole={actorRole}
        member={member}
        isSelf={isSelf}
        localMuted={localMuted}
      />
    </li>
  );
}
