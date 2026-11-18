import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Track } from "livekit-client";
import type { StageStreamKind } from "../lib/stage-selection.ts";
import type { StageTile } from "./use-livekit.ts";

export type StageStream = {
  id: string;
  kind: StageStreamKind;
  identity: string | null;
  name: string;
  label: string;
  isLocal: boolean;
  track?: Track;
};

export const BROADCAST_STREAM_ID = "broadcast";

const kindOrder: Record<StageStreamKind, number> = { broadcast: 0, screen: 1, camera: 2 };

export function useStageStreams(tiles: StageTile[], broadcastLive: boolean): StageStream[] {
  const { t } = useTranslation();
  return useMemo(() => {
    const streams: StageStream[] = tiles.map((tile) => ({
      id: tile.id,
      kind: tile.source,
      identity: tile.identity,
      name: tile.name,
      label: tile.isLocal ? t("room.you", { name: tile.name }) : tile.name,
      isLocal: tile.isLocal,
      track: tile.track,
    }));
    if (broadcastLive) {
      const name = t("theater.broadcastTile");
      streams.push({
        id: BROADCAST_STREAM_ID,
        kind: "broadcast",
        identity: null,
        name,
        label: name,
        isLocal: false,
      });
    }
    return streams.sort((a, b) => kindOrder[a.kind] - kindOrder[b.kind]);
  }, [broadcastLive, t, tiles]);
}
