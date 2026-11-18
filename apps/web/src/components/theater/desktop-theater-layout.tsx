import { useTranslation } from "react-i18next";
import { useFloatingChrome } from "../../hooks/use-floating-chrome.ts";
import { cn } from "../../lib/cn.ts";
import { useUiStore } from "../../stores/ui-store.ts";
import { SkipLink } from "../chrome/site-header.tsx";
import { Float, RoomScrims } from "../room/float.tsx";
import { RoomDock } from "../room/room-dock.tsx";
import { RoomPanel } from "../room/room-panel.tsx";
import { RoomRail } from "../room/room-rail.tsx";
import { ChromeToggle, RoomTitle, RoomTopActions, VoicePill } from "../room/room-top.tsx";
import { useRoomView } from "../room/room-view.tsx";
import { StageView } from "../room/stage-view.tsx";
import { Alert } from "../ui/alert.tsx";

export function DesktopTheaterLayout() {
  const { t } = useTranslation();
  const seconds = useUiStore((s) => s.autoHideSeconds);
  const { livekitUnavailable, streams } = useRoomView();
  const chrome = useFloatingChrome({ seconds });
  const { visible } = chrome;

  return (
    <div className={cn("room-stage relative h-dvh overflow-hidden", chrome.asleep && "cursor-none")}>
      <SkipLink />
      <StageView />
      {chrome.asleep ? <div className="absolute inset-0 z-[6]" aria-hidden="true" /> : null}
      <RoomScrims visible={visible} />

      <Float visible={visible} edge="left" className="left-4 top-4">
        <RoomTitle />
      </Float>
      <Float
        visible={visible}
        edge="top"
        delay={0.04}
        className="inset-x-0 top-4 flex justify-center pl-[250px] pr-[300px] xl:px-0"
      >
        <VoicePill className="w-[328px] max-w-full" />
      </Float>
      <Float visible={visible} edge="right" delay={0.06} className="right-[68px] top-5">
        <RoomTopActions />
      </Float>
      <ChromeToggle visible={visible} onToggle={chrome.toggle} className="right-5 top-5" />

      {livekitUnavailable ? (
        <Float visible={visible} edge="top" delay={0.08} className="inset-x-0 top-[72px] flex justify-center">
          <Alert title={t("theater.livekitDown")} className="w-auto max-w-md" />
        </Float>
      ) : null}

      <Float
        visible={visible}
        edge="left"
        delay={0.08}
        className={cn(
          "bottom-2 left-2 top-[92px] flex",
          streams.length > 1 ? "items-start" : "items-center",
        )}
      >
        <RoomRail />
      </Float>
      <Float visible={visible} edge="right" delay={0.1} className="bottom-[126px] right-6">
        <RoomPanel />
      </Float>
      <Float
        visible={visible}
        edge="bottom"
        delay={0.06}
        className={cn(
          "inset-x-0 bottom-6 flex justify-center",
          streams.length > 1 && "pl-[232px] xl:pl-0",
        )}
      >
        <RoomDock />
      </Float>
    </div>
  );
}
