import {
  IconArrowsMaximize,
  IconBroadcast,
  IconRefresh,
  IconScreenShare,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode, type Ref } from "react";
import { useTranslation } from "react-i18next";
import { useElementSize } from "../../hooks/use-element-size.ts";
import type { StageStream } from "../../hooks/use-stage-streams.ts";
import { cn } from "../../lib/cn.ts";
import { computeGrid } from "../../lib/stage-grid-layout.ts";
import { useStageStore } from "../../stores/stage-store.ts";
import { BroadcastOfflineCard, BroadcastPane, hasBroadcastPlayback } from "../theater/broadcast-pane.tsx";
import { AttachVideo } from "./attach-video.tsx";
import { EmptyStage } from "./empty-stage.tsx";
import { useRoomView } from "./room-view.tsx";

const STAGE_ASPECT = 16 / 9;
const tileSpring = { type: "spring", bounce: 0.12, visualDuration: 0.4 } as const;

export function StreamIcon({ kind, className }: { kind: StageStream["kind"]; className?: string }) {
  const Icon = kind === "screen" ? IconScreenShare : kind === "camera" ? IconVideo : IconBroadcast;
  return <Icon className={className} stroke={1.75} aria-hidden="true" />;
}

function TileControl({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="float-surface-strong flex size-9 items-center justify-center rounded-[var(--radius-tile)] text-ink-soft transition-colors hover:text-ink [&_svg]:size-[18px]"
    >
      {children}
    </button>
  );
}

function StageTile({
  stream,
  single,
  compact,
  width,
  height,
  reloadToken,
  onReload,
  ref,
}: {
  stream: StageStream;
  single: boolean;
  compact?: boolean;
  width: number;
  height: number;
  reloadToken: number;
  onReload: () => void;
  ref?: Ref<HTMLElement>;
}) {
  const { t } = useTranslation();
  const { broadcast, ome, streams, selected } = useRoomView();
  const focus = useStageStore((s) => s.focus);
  const toggle = useStageStore((s) => s.toggle);
  const several = selected.length > 1;

  return (
    <motion.article
      ref={ref}
      layout
      aria-label={stream.label}
      className={cn(
        "group relative shrink-0 overflow-hidden bg-black",
        !single && "rounded-[var(--radius-tile)]",
      )}
      style={single ? { width: "100%", height: "100%" } : { width, height }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.18 } }}
      transition={tileSpring}
    >
      <div className="absolute inset-0">
        {stream.kind === "broadcast" ? (
          <BroadcastPane key={reloadToken} broadcast={broadcast} ome={ome} onReload={onReload} />
        ) : stream.track ? (
          <AttachVideo track={stream.track} />
        ) : null}
      </div>

      {!single ? (
        <span className="float-surface-strong pointer-events-none absolute bottom-2 left-2 inline-flex h-6 max-w-[70%] items-center gap-1.5 rounded-lg px-2 text-xs text-ink">
          <StreamIcon kind={stream.kind} className="size-3.5 shrink-0" />
          <span className="truncate">{stream.label}</span>
        </span>
      ) : null}

      <div
        className={cn(
          "absolute flex gap-1.5 transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100",
          single ? "bottom-6 right-6" : "right-2 top-2",
          compact ? "opacity-100" : "opacity-0",
        )}
      >
        {stream.kind === "broadcast" ? (
          <TileControl label={t("theater.reloadStream")} onClick={onReload}>
            <IconRefresh stroke={1.75} aria-hidden="true" />
          </TileControl>
        ) : null}
        {several ? (
          <>
            <TileControl label={t("room.showOnly")} onClick={() => focus(stream.id)}>
              <IconArrowsMaximize stroke={1.75} aria-hidden="true" />
            </TileControl>
            <TileControl label={t("room.removeFromStage")} onClick={() => toggle(streams, stream.id)}>
              <IconX stroke={1.75} aria-hidden="true" />
            </TileControl>
          </>
        ) : null}
      </div>
    </motion.article>
  );
}

export function StageView({ compact }: { compact?: boolean }) {
  const { t } = useTranslation();
  const { streams, selected, broadcast, ome } = useRoomView();
  const { ref, width, height } = useElementSize<HTMLDivElement>();
  const [reloadToken, setReloadToken] = useState(0);

  const shown = streams.filter((stream) => selected.includes(stream.id));
  const single = shown.length === 1;
  const gap = compact ? 6 : 10;
  const padding = single ? 0 : compact ? 6 : 16;
  const grid = computeGrid(
    shown.length,
    width - padding * 2,
    height - padding * 2,
    STAGE_ASPECT,
    gap,
  );
  const gridWidth = grid.columns * grid.tileWidth + Math.max(0, grid.columns - 1) * gap;
  const waiting = broadcast.enabled && !hasBroadcastPlayback(broadcast, ome);

  return (
    <main id="main" aria-label={t("a11y.stageRegion")} className="absolute inset-0">
      <div ref={ref} className="relative flex h-full w-full items-center justify-center overflow-hidden">
        <div
          className="relative flex flex-wrap content-center justify-center"
          style={single ? { width: "100%", height: "100%" } : { width: gridWidth, gap }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((stream) => (
              <StageTile
                key={stream.id}
                stream={stream}
                single={single}
                compact={compact}
                width={grid.tileWidth}
                height={grid.tileHeight}
                reloadToken={reloadToken}
                onReload={() => setReloadToken((value) => value + 1)}
              />
            ))}
          </AnimatePresence>
        </div>

        {shown.length === 0 && !waiting ? (
          <div className="absolute inset-0">
            <EmptyStage />
          </div>
        ) : null}

        {waiting ? (
          <div
            className={cn(
              "absolute z-[5] w-[min(28rem,calc(100%-2rem))]",
              shown.length === 0 ? "" : "top-24 left-1/2 -translate-x-1/2",
            )}
          >
            <BroadcastOfflineCard ome={ome} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
