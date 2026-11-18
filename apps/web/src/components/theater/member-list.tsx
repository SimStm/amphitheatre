import { IconUsers } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { RoomPeople, RoomPerson } from "../../lib/room-people.ts";
import type { Role } from "../../shared-types.ts";
import { MemberRow } from "./member-row.tsx";

type MemberListProps = {
  people: RoomPeople;
  actorRole?: Role;
  omeLive: boolean;
  roomId: string;
  localMutedUserIds: Record<string, true>;
};

export function MemberList({ people, actorRole, omeLive, roomId, localMutedUserIds }: MemberListProps) {
  const { t } = useTranslation();

  if (people.voice.length === 0 && people.chatOnly.length === 0) {
    return (
      <div className="flex flex-col items-start gap-2 p-4 text-ink-muted">
        <IconUsers aria-hidden="true" />
        <p className="font-medium text-ink">{t("theater.membersEmptyTitle")}</p>
        <p className="text-sm">{t("theater.membersEmptyBody")}</p>
      </div>
    );
  }

  const group = (title: string, items: RoomPerson[]) =>
    items.length > 0 ? (
      <section className="flex flex-col gap-1">
        <h3 className="flex justify-between px-2 pb-1 font-display text-xs font-bold text-ink-subtle">
          {title}
          <span className="font-normal">{items.length}</span>
        </h3>
        <ul className="flex flex-col gap-0.5">
          {items.map((person) => (
            <MemberRow
              key={person.member.userId}
              person={person}
              actorRole={actorRole}
              omeLive={omeLive}
              roomId={roomId}
              localMuted={Boolean(localMutedUserIds[person.member.userId])}
            />
          ))}
        </ul>
      </section>
    ) : null;

  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-2.5" aria-label={t("a11y.membersRegion")}>
      {group(t("room.inVoice"), people.voice)}
      {group(t("room.chatOnly"), people.chatOnly)}
    </div>
  );
}
