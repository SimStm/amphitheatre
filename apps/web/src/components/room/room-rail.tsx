import {
  IconHeadphones,
  IconMicrophoneOff,
  IconScreenShare,
  IconVideo,
  IconWifi1,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { StageStream } from "../../hooks/use-stage-streams.ts";
import { cn } from "../../lib/cn.ts";
import {
  isListeningOnly,
  isMicMuted,
  isWeakConnection,
  type RoomPerson,
} from "../../lib/room-people.ts";
import { MemberPopover } from "../theater/member-popover.tsx";
import { Avatar } from "../ui/avatar.tsx";
import { FloatSurface } from "../ui/float-surface.tsx";
import { RoleMark } from "../ui/role-badge.tsx";
import { describePerson, personName } from "./person-label.ts";
import { useRoomView } from "./room-view.tsx";
import { StreamCard } from "./stream-card.tsx";

function RailBadge({
  position,
  tone = "neutral",
  children,
}: {
  position: "top" | "bottom";
  tone?: "neutral" | "danger" | "attention";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "absolute -right-1 flex size-5 items-center justify-center rounded-full border border-border-float [&_svg]:size-3",
        position === "top" ? "-top-1" : "-bottom-1",
        tone === "danger" && "bg-danger text-white",
        tone === "attention" && "bg-attention text-surface-inverse",
        tone === "neutral" && "bg-surface-raised text-ink-soft",
      )}
    >
      {children}
    </span>
  );
}

function PersonButton({
  person,
  small,
  index,
  expanded,
  onToggle,
}: {
  person: RoomPerson;
  small?: boolean;
  index: number;
  expanded: boolean;
  onToggle: (person: RoomPerson, anchor: HTMLElement) => void;
}) {
  const { t } = useTranslation();
  const { media } = person;
  const speaking = Boolean(media?.speaking);
  const name = person.member.displayName;
  const lower = isMicMuted(person) ? (
    <RailBadge position="bottom" tone="danger">
      <IconMicrophoneOff stroke={1.9} aria-hidden="true" />
    </RailBadge>
  ) : isWeakConnection(media) ? (
    <RailBadge position="bottom" tone="attention">
      <IconWifi1 stroke={1.9} aria-hidden="true" />
    </RailBadge>
  ) : isListeningOnly(person) ? (
    <RailBadge position="bottom">
      <IconHeadphones stroke={1.9} aria-hidden="true" />
    </RailBadge>
  ) : null;

  return (
    <motion.li
      layout="position"
      className="relative flex items-center"
      initial={{ opacity: 0, x: -18, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -12, scale: 0.9, transition: { duration: 0.15 } }}
      transition={{ type: "spring", bounce: 0.22, visualDuration: 0.36, delay: index * 0.035 }}
    >
      <button
        type="button"
        data-floating=""
        aria-label={`${describePerson(person, t)}. ${t("room.memberActions", { name })}`}
        aria-haspopup="dialog"
        aria-expanded={expanded}
        onClick={(event) => onToggle(person, event.currentTarget)}
        className="group pointer-events-auto relative rounded-full transition-transform duration-150 hover:scale-105"
      >
        <Avatar
          id={person.member.userId}
          name={name}
          size={small ? "railSmall" : "rail"}
          speaking={speaking}
          self={person.isSelf}
          dimmed={small}
        />
        <RoleMark role={person.member.role} small={small} className="absolute -left-1 -top-1" />
        {!small && media?.screen ? (
          <RailBadge position="top">
            <IconScreenShare stroke={1.9} aria-hidden="true" />
          </RailBadge>
        ) : !small && media?.camera ? (
          <RailBadge position="top">
            <IconVideo stroke={1.9} aria-hidden="true" />
          </RailBadge>
        ) : null}
        {small ? null : lower}
        {speaking ? null : (
          <span className="float-surface-strong pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs text-ink opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
            {personName(person, t)}
          </span>
        )}
      </button>
      <AnimatePresence>
        {speaking ? (
          <motion.span
            className="pointer-events-none absolute left-[calc(100%+10px)] whitespace-nowrap rounded-lg bg-speaking-soft px-2 py-1 text-xs font-bold text-speaking"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.16 }}
          >
            {t("room.speakingShort", { name })}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}

function PeopleRail() {
  const { t } = useTranslation();
  const { people, roomId, selfRole, localMutedUserIds } = useRoomView();
  const [selected, setSelected] = useState<{ id: string; anchor: HTMLElement } | null>(null);
  const [open, setOpen] = useState(false);
  const everyone = [...people.voice, ...people.chatOnly];
  const active = everyone.find((person) => person.member.userId === selected?.id);
  const isOpen = (person: RoomPerson) => open && selected?.id === person.member.userId;
  const toggle = (person: RoomPerson, anchor: HTMLElement) => {
    setOpen(!isOpen(person));
    setSelected({ id: person.member.userId, anchor });
  };

  return (
    <motion.nav
      key="people"
      aria-label={t("room.peopleRail")}
      className="hide-scrollbar pointer-events-none! flex max-h-full w-[200px] flex-col gap-4 overflow-y-auto py-2 pl-[21px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.16 } }}
    >
      <ul className="flex flex-col items-start gap-5">
        <AnimatePresence initial={false}>
          {people.voice.map((person, index) => (
            <PersonButton
              key={person.member.userId}
              person={person}
              index={index}
              expanded={isOpen(person)}
              onToggle={toggle}
            />
          ))}
        </AnimatePresence>
      </ul>
      {people.voice.length > 0 && people.chatOnly.length > 0 ? (
        <span className="ml-[5px] h-px w-9 shrink-0 bg-border-strong/50" aria-hidden="true" />
      ) : null}
      {people.chatOnly.length > 0 ? (
        <ul className="flex flex-col items-start gap-2 pl-[5px]" aria-label={t("room.chatOnly")}>
          <AnimatePresence initial={false}>
            {people.chatOnly.map((person, index) => (
              <PersonButton
                key={person.member.userId}
                person={person}
                index={index}
                small
                expanded={isOpen(person)}
                onToggle={toggle}
              />
            ))}
          </AnimatePresence>
        </ul>
      ) : null}
      {active ? (
        <MemberPopover
          open={open}
          onClose={() => setOpen(false)}
          anchor={selected?.anchor ?? null}
          roomId={roomId}
          actorRole={selfRole}
          member={active.member}
          isSelf={active.isSelf}
          localMuted={Boolean(localMutedUserIds[active.member.userId])}
        />
      ) : null}
    </motion.nav>
  );
}

function StreamGroup({ title, streams }: { title: string; streams: StageStream[] }) {
  if (streams.length === 0) return null;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="flex items-center justify-between px-1 font-display text-[13px] font-bold text-ink-soft">
        {title}
        <span className="font-normal text-ink-subtle">{streams.length}</span>
      </h2>
      <ul className="flex flex-col gap-2.5">
        <AnimatePresence mode="popLayout" initial={false}>
          {streams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

function StreamRail() {
  const { t } = useTranslation();
  const { streams } = useRoomView();
  const of = (kind: StageStream["kind"]) => streams.filter((stream) => stream.kind === kind);

  return (
    <FloatSurface
      key="streams"
      role="navigation"
      aria-label={t("room.streams")}
      className="hide-scrollbar flex max-h-full w-56 flex-col gap-4 overflow-y-auto p-2"
      initial={{ opacity: 0, x: -24, clipPath: "inset(0 40% 0 0 round 20px)" }}
      animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0 round 20px)" }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.16 } }}
      transition={{ type: "spring", bounce: 0.12, visualDuration: 0.4 }}
    >
      <StreamGroup title={t("theater.broadcastTile")} streams={of("broadcast")} />
      <StreamGroup title={t("room.screens")} streams={of("screen")} />
      <StreamGroup title={t("room.cameras")} streams={of("camera")} />
      <p className="px-1 pb-1 text-[11.5px] leading-4 text-ink-subtle">{t("room.stageHint")}</p>
    </FloatSurface>
  );
}

export function RoomRail() {
  const { streams } = useRoomView();
  return (
    <AnimatePresence mode="wait" initial={false}>
      {streams.length > 1 ? <StreamRail key="streams" /> : <PeopleRail key="people" />}
    </AnimatePresence>
  );
}

export function StreamStrip() {
  const { t } = useTranslation();
  const { streams } = useRoomView();
  return (
    <ul
      aria-label={t("room.streams")}
      data-floating=""
      className="hide-scrollbar flex gap-2 overflow-x-auto px-2 py-1"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {streams.map((stream) => (
          <StreamCard key={stream.id} stream={stream} compact />
        ))}
      </AnimatePresence>
    </ul>
  );
}
