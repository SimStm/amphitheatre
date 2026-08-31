import { IconUsers } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { ParticipantMedia, Role, RoomMember } from "../../shared-types.ts";
import { useRoomStore } from "../../stores/room-store.ts";
import { MemberRow } from "./member-row.tsx";

type MemberListProps = {
  members: RoomMember[];
  selfId?: string;
  actorRole?: Role;
  omeLive: boolean;
  mediaByUserId: Record<string, ParticipantMedia>;
  roomId: string;
};

export function MemberList({
  members,
  selfId,
  actorRole,
  omeLive,
  mediaByUserId,
  roomId,
}: MemberListProps) {
  const { t } = useTranslation();
  const localMutedUserIds = useRoomStore((s) => s.localMutedUserIds);
  const visible = members.filter((member) => member.present);
  const sorted = [...visible].sort((a, b) => {
    const rank = (role: Role) =>
      role === "owner" ? 0 : role === "admin" ? 1 : role === "moderator" ? 2 : 3;
    const roleDelta = rank(a.role) - rank(b.role);
    if (roleDelta !== 0) return roleDelta;
    if (a.connected !== b.connected) return a.connected ? -1 : 1;
    return a.displayName.localeCompare(b.displayName);
  });

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 p-4 text-ink-muted">
        <IconUsers aria-hidden="true" />
        <p className="font-medium text-ink">{t("theater.membersEmptyTitle")}</p>
        <p className="text-sm">{t("theater.membersEmptyBody")}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 h-full overflow-y-auto p-4" aria-label={t("a11y.membersRegion")}>
      {sorted.map((member) => (
        <MemberRow
          key={member.userId}
          member={member}
          selfId={selfId}
          actorRole={actorRole}
          omeLive={omeLive}
          media={mediaByUserId[member.userId]}
          roomId={roomId}
          localMuted={Boolean(localMutedUserIds[member.userId])}
        />
      ))}
    </ul>
  );
}
