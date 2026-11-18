import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { shareOrCopyInvite } from "../lib/share-invite.ts";

export function useInvite(roomId: string, roomName: string) {
  const { t } = useTranslation();
  return useCallback(async () => {
    const url = `${window.location.origin}/rooms/${roomId}`;
    const name = roomName.trim() || t("join.untitled");
    try {
      const result = await shareOrCopyInvite({
        title: t("theater.shareInviteTitle", { name }),
        text: t("theater.shareInviteText", { name, url }),
        url,
      });
      if (result === "copied") toast.success(t("toast.copied"));
    } catch {
      toast.error(t("toast.copyFailed"));
    }
  }, [roomId, roomName, t]);
}
