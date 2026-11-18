import { IconChevronRight, IconLock } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import type { Room } from "../../shared-types.ts";
import { StatusDot } from "../ui/status-dot.tsx";

function useRoomMeta(room: Room, full: boolean): string {
  const { t } = useTranslation();
  if (full) return t("home.metaFull", { count: room.memberCount, limit: room.memberLimit });
  const people =
    room.memberCount === 1 ? t("home.peopleOne") : t("home.people", { count: room.memberCount });
  const live = room.broadcast.enabled;
  if (live && room.hasPassword) return t("home.metaLiveLocked", { people });
  if (live) return t("home.metaLive", { people });
  if (room.hasPassword) return t("home.metaLocked", { people });
  return t("home.metaOpen", { people });
}

function RoomLead({ room }: { room: Room }) {
  if (room.broadcast.enabled) return <StatusDot tone="live" pulse />;
  if (room.hasPassword) return <IconLock className="size-3.5 text-ink-faint" stroke={1.75} aria-hidden="true" />;
  return <StatusDot tone={room.memberCount > 0 ? "speaking" : "idle"} />;
}

export function PublicRoomRow({ room, onOpen }: { room: Room; onOpen: (room: Room) => void }) {
  const { t } = useTranslation();
  const full = room.memberCount >= room.memberLimit;
  const meta = useRoomMeta(room, full);

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", bounce: 0.1, visualDuration: 0.3 }}
    >
      <button
        type="button"
        aria-label={t("home.openRoom", { name: room.name })}
        onClick={() => onOpen(room)}
        className="group flex min-h-[50px] w-full items-center gap-2 rounded-[var(--radius-tile)] bg-surface-row py-1.5 pl-3 pr-3 text-left transition-colors hover:bg-surface-bright sm:pl-7 sm:pr-5"
      >
        <span className="flex w-3.5 shrink-0 items-center justify-center">
          <RoomLead room={room} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[14.5px] font-bold leading-[18px] text-ink">
            {room.name}
          </span>
          <span className="block truncate text-[12.5px] leading-4 text-ink-dim">{meta}</span>
        </span>
        {full ? (
          <span className="rounded-full bg-surface-bright px-2.5 py-0.5 font-display text-xs font-bold text-ink-muted">
            {t("home.full")}
          </span>
        ) : null}
        <IconChevronRight
          className="size-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5"
          stroke={1.75}
          aria-hidden="true"
        />
      </button>
    </motion.li>
  );
}
