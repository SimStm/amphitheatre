import { IconMicrophoneOff, IconMinus, IconPlus } from "@tabler/icons-react";
import { motion } from "motion/react";
import type { MouseEvent, Ref } from "react";
import { useTranslation } from "react-i18next";
import type { StageStream } from "../../hooks/use-stage-streams.ts";
import { cn } from "../../lib/cn.ts";
import { useStageStore } from "../../stores/stage-store.ts";
import { SignalBars } from "../ui/signal-bars.tsx";
import { AttachVideo } from "./attach-video.tsx";
import { useRoomView } from "./room-view.tsx";
import { StreamIcon } from "./stage-view.tsx";

const qualityKey = {
  excellent: "indicator.qualityExcellent",
  good: "indicator.qualityGood",
  poor: "indicator.qualityPoor",
  lost: "indicator.qualityLost",
  unknown: "indicator.qualityUnknown",
} as const;

type StreamCardProps = {
  stream: StageStream;
  compact?: boolean;
  ref?: Ref<HTMLLIElement>;
};

export function StreamCard({ stream, compact, ref }: StreamCardProps) {
  const { t } = useTranslation();
  const { streams, selected, mediaByUserId, room } = useRoomView();
  const focus = useStageStore((s) => s.focus);
  const toggle = useStageStore((s) => s.toggle);

  const onStage = selected.includes(stream.id);
  const canToggle = !onStage || selected.length > 1;
  const media = stream.identity ? mediaByUserId[stream.identity] : undefined;
  const member = room.members?.find((item) => item.userId === stream.identity);
  const speaking = stream.kind === "camera" && Boolean(media?.speaking);
  const micOff = stream.kind === "camera" && (member?.muted || media?.mic === "muted");
  const quality = media?.quality ?? "unknown";

  const open = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) toggle(streams, stream.id);
    else focus(stream.id);
  };

  const description = [
    stream.label,
    onStage ? t("room.onStage") : t("room.putOnStage"),
    speaking ? t("indicator.speaking") : null,
    micOff ? t("indicator.muted") : null,
    stream.identity ? t(qualityKey[quality]) : null,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.li
      ref={ref}
      layout="position"
      className={cn("group relative shrink-0", compact ? "h-[74px] w-[132px]" : "h-28 w-full")}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
      transition={{ type: "spring", bounce: 0.14, visualDuration: 0.32 }}
    >
      <button
        type="button"
        aria-pressed={onStage}
        aria-label={description}
        onClick={open}
        className="relative block size-full overflow-hidden rounded-[var(--radius-tile)] bg-surface-sunken"
      >
        {stream.track ? (
          <AttachVideo track={stream.track} muted className="object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-accent-text">
            <StreamIcon kind={stream.kind} className="size-7" />
          </span>
        )}
        {!onStage && !compact ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <span className="float-surface-strong rounded-lg px-2.5 py-1 text-xs font-bold text-ink">
              {t("room.putOnStage")}
            </span>
          </span>
        ) : null}
        <span className="float-surface-strong absolute bottom-1.5 left-1.5 inline-flex h-6 max-w-[calc(100%-12px)] items-center gap-1 rounded-lg px-1.5 font-display text-xs font-bold text-ink">
          {stream.kind !== "camera" ? <StreamIcon kind={stream.kind} className="size-3 shrink-0" /> : null}
          <span className="truncate">{stream.label}</span>
        </span>
      </button>

      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[var(--radius-tile)] border-2 transition-colors duration-150",
          onStage ? "border-accent" : speaking ? "border-speaking" : "border-transparent",
        )}
      />

      <span className="pointer-events-none absolute right-1.5 top-1.5 flex items-center gap-1">
        {micOff ? (
          <span className="flex size-[22px] items-center justify-center rounded-md bg-danger text-white">
            <IconMicrophoneOff className="size-3" stroke={1.9} aria-hidden="true" />
          </span>
        ) : null}
        {onStage ? (
          <span className="flex h-[22px] items-center rounded-full bg-accent px-2.5 font-display text-[11px] font-bold text-ink-on-accent">
            {t("room.onStage")}
          </span>
        ) : stream.identity ? (
          <span className="float-surface-strong flex h-[22px] w-[30px] items-center justify-center rounded-md">
            <SignalBars quality={quality} label={t(qualityKey[quality])} />
          </span>
        ) : null}
      </span>

      {canToggle ? (
        <button
          type="button"
          aria-label={`${onStage ? t("room.removeFromStage") : t("room.addToStage")}: ${stream.label}`}
          title={onStage ? t("room.removeFromStage") : t("room.addToStage")}
          onClick={() => toggle(streams, stream.id)}
          className={cn(
            "float-surface-strong absolute left-1.5 top-1.5 flex items-center justify-center rounded-md text-ink transition-opacity duration-150 focus-visible:opacity-100 group-hover:opacity-100",
            compact
              ? "size-7 opacity-100 before:absolute before:-inset-2 before:content-['']"
              : "size-[22px] opacity-0",
          )}
        >
          {onStage ? (
            <IconMinus className="size-3.5" stroke={2} aria-hidden="true" />
          ) : (
            <IconPlus className="size-3.5" stroke={2} aria-hidden="true" />
          )}
        </button>
      ) : null}
    </motion.li>
  );
}
