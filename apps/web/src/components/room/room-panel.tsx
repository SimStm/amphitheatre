import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { MemberList } from "../theater/member-list.tsx";
import { FloatSurface } from "../ui/float-surface.tsx";
import { IconButton } from "../ui/icon-button.tsx";
import { useRoomView } from "./room-view.tsx";

export function PeoplePanelBody() {
  const view = useRoomView();
  return (
    <MemberList
      people={view.people}
      actorRole={view.selfRole}
      omeLive={view.omeLive}
      roomId={view.roomId}
      localMutedUserIds={view.localMutedUserIds}
    />
  );
}

export function RoomPanel() {
  const { t } = useTranslation();
  const view = useRoomView();
  const { panel } = view;

  return (
    <AnimatePresence>
      {panel ? (
        <FloatSurface
          key="panel"
          strong
          className="pointer-events-auto flex h-[min(444px,calc(100dvh-216px))] w-[356px] flex-col overflow-hidden"
          initial={{ opacity: 0, x: 36, clipPath: "inset(0 0 0 30% round 20px)" }}
          animate={{ opacity: 1, x: 0, clipPath: "inset(0 0 0 0% round 20px)" }}
          exit={{ opacity: 0, x: 28, transition: { duration: 0.18, ease: "easeIn" } }}
          transition={{ type: "spring", bounce: 0.12, visualDuration: 0.38 }}
        >
          <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-border pl-4 pr-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.h2
                key={panel}
                className="font-display text-[15px] font-bold text-ink"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.12 }}
              >
                {panel === "chat" ? t("room.chatTitle") : t("room.peopleTitle")}
              </motion.h2>
            </AnimatePresence>
            <IconButton size="sm" label={t("room.closePanel")} onClick={() => view.setPanel(null)}>
              <IconX aria-hidden="true" stroke={1.75} />
            </IconButton>
          </header>
          <div className="min-h-0 flex-1">{panel === "chat" ? view.chat : <PeoplePanelBody />}</div>
        </FloatSurface>
      ) : null}
    </AnimatePresence>
  );
}
