import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion, useDragControls } from "motion/react";
import { useTranslation } from "react-i18next";
import { useFloatingChrome } from "../../hooks/use-floating-chrome.ts";
import { cn } from "../../lib/cn.ts";
import { useUiStore } from "../../stores/ui-store.ts";
import { SkipLink } from "../chrome/site-header.tsx";
import { Float, RoomScrims } from "../room/float.tsx";
import { RoomDock } from "../room/room-dock.tsx";
import { PeoplePanelBody } from "../room/room-panel.tsx";
import { StreamStrip } from "../room/room-rail.tsx";
import { ChromeToggle, RoomTitle, RoomTopActions, VoicePill } from "../room/room-top.tsx";
import { useRoomView, type RoomPanelKind } from "../room/room-view.tsx";
import { StageView } from "../room/stage-view.tsx";
import { Alert } from "../ui/alert.tsx";
import { IconButton } from "../ui/icon-button.tsx";

const tabs: { id: RoomPanelKind; key: "room.chatTitle" | "room.peopleTitle" }[] = [
  { id: "chat", key: "room.chatTitle" },
  { id: "people", key: "room.peopleTitle" },
];

function RoomSheet() {
  const { t } = useTranslation();
  const view = useRoomView();
  const drag = useDragControls();
  const { panel } = view;

  return (
    <AnimatePresence>
      {panel ? (
        <motion.section
          key="sheet"
          data-floating=""
          aria-label={t("theater.sidePanel")}
          className="float-surface-strong absolute inset-x-0 bottom-0 z-40 flex h-[min(68dvh,34rem)] flex-col rounded-t-[var(--radius-panel)] pb-[env(safe-area-inset-bottom)]"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%", transition: { duration: 0.2, ease: "easeIn" } }}
          transition={{ type: "spring", bounce: 0.1, visualDuration: 0.36 }}
          drag="y"
          dragListener={false}
          dragControls={drag}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.7 }}
          onDragEnd={(_, info) => {
            if (info.offset.y > 90 || info.velocity.y > 500) view.setPanel(null);
          }}
        >
          <div
            className="flex h-5 shrink-0 touch-none items-center justify-center"
            onPointerDown={(event) => drag.start(event)}
            aria-hidden="true"
          >
            <span className="h-1 w-10 rounded-full bg-border-strong" />
          </div>
          <div className="flex shrink-0 items-center gap-1 border-b border-border px-2 pb-1">
            <div role="tablist" aria-label={t("theater.sidePanel")} className="flex flex-1 gap-1">
              {tabs.map((tab) => {
                const active = panel === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="room-sheet-panel"
                    onClick={() => view.setPanel(tab.id)}
                    className={cn(
                      "relative min-h-11 flex-1 rounded-[var(--radius-tile)] font-display text-sm font-bold",
                      active ? "text-accent-text" : "text-ink-muted",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="room-sheet-tab"
                        className="absolute inset-0 rounded-[var(--radius-tile)] bg-accent-soft"
                        transition={{ type: "spring", bounce: 0.16, visualDuration: 0.28 }}
                      />
                    ) : null}
                    <span className="relative">{t(tab.key)}</span>
                  </button>
                );
              })}
            </div>
            <IconButton label={t("room.closePanel")} onClick={() => view.setPanel(null)}>
              <IconX aria-hidden="true" stroke={1.75} />
            </IconButton>
          </div>
          <div id="room-sheet-panel" role="tabpanel" className="min-h-0 flex-1">
            {panel === "chat" ? view.chat : <PeoplePanelBody />}
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

export function MobileTheaterLayout() {
  const { t } = useTranslation();
  const seconds = useUiStore((s) => s.autoHideSeconds);
  const { panel, streams, livekitUnavailable } = useRoomView();
  const chrome = useFloatingChrome({ seconds, paused: panel !== null });
  const { visible } = chrome;

  return (
    <div className="room-stage relative h-dvh overflow-hidden">
      <SkipLink />
      <StageView compact />
      <RoomScrims visible={visible} />

      <Float
        visible={visible}
        edge="top"
        className="inset-x-2 top-[calc(env(safe-area-inset-top)+8px)] flex flex-col gap-2"
      >
        <div className="pointer-events-none flex items-start justify-between gap-2 pr-12 [&>*]:pointer-events-auto">
          <RoomTitle className="w-auto min-w-0 flex-1" />
          <RoomTopActions compact />
        </div>
        <VoicePill compact />
        {livekitUnavailable ? <Alert title={t("theater.livekitDown")} /> : null}
      </Float>
      <ChromeToggle
        visible={visible}
        onToggle={chrome.toggle}
        className="right-2 top-[calc(env(safe-area-inset-top)+8px)] [&_button]:size-11"
      />

      <Float
        visible={visible}
        edge="bottom"
        className="inset-x-2 bottom-[calc(env(safe-area-inset-bottom)+8px)] flex flex-col gap-1.5"
      >
        {streams.length > 1 ? <StreamStrip /> : null}
        <RoomDock compact />
      </Float>

      <RoomSheet />
    </div>
  );
}
