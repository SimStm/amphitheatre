import type { TFunction } from "i18next";
import { isHighlightedRole, roleLabelKey } from "../../lib/role-style.ts";
import { isListeningOnly, isMicMuted, type RoomPerson } from "../../lib/room-people.ts";

export function personName(person: RoomPerson, t: TFunction): string {
  const name = person.member.displayName;
  return person.isSelf ? t("room.you", { name }) : name;
}

export function describePerson(person: RoomPerson, t: TFunction): string {
  const { media } = person;
  const parts = [personName(person, t)];
  if (isHighlightedRole(person.member.role)) parts.push(t(roleLabelKey[person.member.role]));
  if (media?.speaking) parts.push(t("indicator.speaking"));
  if (isMicMuted(person)) parts.push(t("indicator.muted"));
  else if (isListeningOnly(person)) parts.push(t("room.listening"));
  if (media?.camera) parts.push(t("indicator.camera"));
  if (media?.screen) parts.push(t("indicator.screen"));
  if (media?.quality === "poor") parts.push(t("indicator.qualityPoor"));
  if (media?.quality === "lost") parts.push(t("indicator.qualityLost"));
  return parts.join(", ");
}
