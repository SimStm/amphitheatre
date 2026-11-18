import {
  IconEye,
  IconEyeOff,
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff,
  IconUserPlus,
} from "@tabler/icons-react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { canShareInvite } from "../../lib/share-invite.ts";
import { cn } from "../../lib/cn.ts";
import { BrandMark, BrandWordmark } from "../chrome/brand-mark.tsx";
import { AvatarStack } from "../ui/avatar-stack.tsx";
import { Button } from "../ui/button.tsx";
import { FloatSurface } from "../ui/float-surface.tsx";
import { IconButton } from "../ui/icon-button.tsx";
import { useRoomView, type RoomView } from "./room-view.tsx";
import { StreamIcon } from "./stage-view.tsx";

function peopleLabel(count: number, t: TFunction): string {
  return count === 1 ? t("home.peopleOne") : t("home.people", { count });
}

function stageLabel(view: RoomView, t: TFunction): string {
  const shown = view.streams.filter((stream) => view.selected.includes(stream.id));
  if (shown.length > 1) return t("room.stageMany", { count: shown.length });
  const stream = shown[0];
  if (stream?.kind === "broadcast") return t("room.stageBroadcast");
  if (stream?.kind === "screen") return t("room.stageScreen", { name: stream.name });
  if (stream?.kind === "camera") return t("room.stageCamera", { name: stream.name });
  const people = peopleLabel(view.peopleCount, t);
  return view.room.isPublic ? t("room.publicMeta", { people }) : t("room.privateMeta", { people });
}

export function RoomTitle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const view = useRoomView();
  const lead = view.streams.find((stream) => view.selected.includes(stream.id));
  return (
    <FloatSurface className={cn("flex h-[60px] w-[232px] items-center gap-2.5 px-2 xl:w-[372px]", className)}>
      <button
        type="button"
        aria-label={t("theater.leave")}
        title={t("theater.leave")}
        onClick={view.onLeave}
        className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-tile)] transition-colors hover:bg-surface-bright focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none xl:h-11 xl:w-auto xl:px-1.5"
      >
        <BrandMark overrideClasses className="block size-9 xl:hidden" />
        <BrandWordmark decorative overrideClasses className="hidden h-7 w-auto xl:block" />
      </button>
      <span className="h-8 w-px shrink-0 bg-border" aria-hidden="true" />
      <div className="min-w-0 flex-1 pr-2">
        <h1 className="truncate font-display text-[15px] font-bold leading-5 text-ink">{view.room.name}</h1>
        <p className="flex min-w-0 items-center gap-1.5 text-[12.5px] leading-4 text-ink-dim">
          {lead ? <StreamIcon kind={lead.kind} className="size-3.5 shrink-0 text-accent-text" /> : null}
          <span className="truncate">{stageLabel(view, t)}</span>
        </p>
      </div>
    </FloatSurface>
  );
}

function voiceCount(view: RoomView, t: TFunction): string {
  const count = view.people.voice.length;
  if (view.people.voice.some((person) => person.isSelf)) {
    const others = count - 1;
    if (others === 0) return t("room.voiceOnlyYou");
    if (others === 1) return t("room.voiceYouAndOne");
    return t("room.voiceYouAndMany", { count: others });
  }
  if (count === 0) return t("room.voiceNobody");
  if (count === 1) return t("room.voiceOne");
  return t("room.voiceMany", { count });
}

function speakingLine(view: RoomView, t: TFunction): string | null {
  const speakers = view.people.voice.filter((person) => person.media?.speaking);
  const first = speakers[0];
  if (!first) return null;
  if (speakers.length > 1) return t("room.speakingMany", { count: speakers.length });
  return t("room.speaking", { name: first.member.displayName });
}

export function VoicePill({ className, compact }: { className?: string; compact?: boolean }) {
  const { t } = useTranslation();
  const view = useRoomView();
  const speaking = speakingLine(view, t);
  const summary = view.voiceConnecting ? t("room.connecting") : voiceCount(view, t);
  const stack = view.people.voice.map((person) => ({
    id: person.member.userId,
    name: person.member.displayName,
    speaking: person.media?.speaking,
  }));
  const buttonSize = compact ? "md" : "xs";
  const micLabel = view.micLocked
    ? t("theater.mutedLocked")
    : view.micEnabled
      ? t("theater.micOn")
      : t("theater.micOff");

  return (
    <FloatSurface
      className={cn(
        "flex items-center gap-2.5 rounded-full pl-2.5 pr-1.5",
        compact ? "h-14" : "h-11",
        className,
      )}
    >
      {stack.length > 0 ? <AvatarStack people={stack} max={3} /> : null}
      <div role="status" className="min-w-0 flex-1 leading-4">
        {speaking ? <p className="truncate text-[13px] text-speaking">{speaking}</p> : null}
        <p className={cn("truncate text-ink-dim", speaking ? "text-[11.5px]" : "text-[13px]")}>{summary}</p>
      </div>
      {view.voiceLeft ? (
        <Button
          size="sm"
          className={cn("rounded-full px-3 text-[13px]", compact ? "h-11" : "h-[30px]")}
          disabled={view.livekitUnavailable}
          onClick={view.onJoinVoice}
        >
          {t("room.joinVoice")}
        </Button>
      ) : (
        <div className="flex shrink-0 items-center gap-1.5">
          <IconButton
            size={buttonSize}
            tone={view.micEnabled ? "raised" : "off"}
            label={micLabel}
            tooltipSide="bottom"
            aria-pressed={view.micEnabled}
            disabled={view.micLocked || view.livekitUnavailable}
            onClick={() => void view.onMic(!view.micEnabled)}
          >
            {view.micEnabled ? (
              <IconMicrophone aria-hidden="true" stroke={1.75} />
            ) : (
              <IconMicrophoneOff aria-hidden="true" stroke={1.75} />
            )}
          </IconButton>
          <IconButton
            size={buttonSize}
            tone="danger"
            label={t("room.leaveVoice")}
            tooltipSide="bottom"
            disabled={view.livekitUnavailable}
            onClick={() => void view.onLeaveVoice()}
          >
            <IconPhoneOff aria-hidden="true" stroke={1.75} />
          </IconButton>
        </div>
      )}
    </FloatSurface>
  );
}

export function RoomTopActions({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const view = useRoomView();
  const stack = [...view.people.voice, ...view.people.chatOnly].map((person) => ({
    id: person.member.userId,
    name: person.member.displayName,
    speaking: person.media?.speaking,
  }));
  const inviteLabel = canShareInvite() ? t("theater.shareInvite") : t("theater.copyInvite");

  return (
    <div className="flex items-center gap-3">
      <FloatSurface className="rounded-full">
        <button
          type="button"
          aria-label={inviteLabel}
          title={inviteLabel}
          onClick={() => void view.onInvite()}
          className={cn(
            "flex items-center gap-2 rounded-full font-display text-[13.5px] font-bold text-ink transition-colors hover:text-accent-text",
            compact ? "size-11 justify-center" : "h-9 px-4",
          )}
        >
          <IconUserPlus className="size-4 text-accent-text" stroke={1.75} aria-hidden="true" />
          <span className={compact ? "sr-only" : "hidden lg:inline"}>{t("room.invite")}</span>
        </button>
      </FloatSurface>
      {compact ? null : (
        <FloatSurface className="rounded-full">
          <button
            type="button"
            aria-label={t("room.peopleButton", { count: view.peopleCount })}
            aria-pressed={view.panel === "people"}
            onClick={() => view.togglePanel("people")}
            className="flex h-9 items-center gap-2 rounded-full pl-2 pr-3 text-[13px] font-bold text-ink"
          >
            <AvatarStack people={stack} max={3} />
            {view.peopleCount}
          </button>
        </FloatSurface>
      )}
    </div>
  );
}

export function ChromeToggle({
  visible,
  onToggle,
  className,
}: {
  visible: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const { t } = useTranslation();
  const label = visible ? t("room.hideInterface") : t("room.showInterface");
  return (
    <FloatSurface
      className={cn(
        "absolute z-30 rounded-full transition-opacity duration-300 hover:opacity-100 focus-within:opacity-100",
        !visible && "opacity-40",
        className,
      )}
    >
      <IconButton
        size="sm"
        label={label}
        tooltipSide="bottom"
        aria-pressed={!visible}
        className="rounded-full"
        onClick={onToggle}
      >
        {visible ? (
          <IconEyeOff aria-hidden="true" stroke={1.75} />
        ) : (
          <IconEye aria-hidden="true" stroke={1.75} />
        )}
      </IconButton>
    </FloatSurface>
  );
}
