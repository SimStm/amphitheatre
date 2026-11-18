import type { ParticipantMedia, Role, RoomMember } from "../shared-types.ts";

export type RoomPerson = {
  member: RoomMember;
  media?: ParticipantMedia;
  isSelf: boolean;
  inVoice: boolean;
};

export type RoomPeople = { voice: RoomPerson[]; chatOnly: RoomPerson[] };

const roleRank: Record<Role, number> = { owner: 0, admin: 1, moderator: 2, member: 3 };

export function buildPeople(input: {
  members: RoomMember[];
  mediaByUserId: Record<string, ParticipantMedia>;
  voiceUserIds: Record<string, true>;
  selfId?: string;
  selfLeftVoice: boolean;
}): RoomPeople {
  const { members, mediaByUserId, voiceUserIds, selfId, selfLeftVoice } = input;
  const people = members
    .filter((member) => member.present)
    .sort(
      (a, b) =>
        roleRank[a.role] - roleRank[b.role] || a.displayName.localeCompare(b.displayName),
    )
    .map((member): RoomPerson => {
      const isSelf = member.userId === selfId;
      return {
        member,
        media: mediaByUserId[member.userId],
        isSelf,
        inVoice: Boolean(voiceUserIds[member.userId]) && !(isSelf && selfLeftVoice),
      };
    });
  return {
    voice: people.filter((person) => person.inVoice),
    chatOnly: people.filter((person) => !person.inVoice),
  };
}

export function isWeakConnection(media?: ParticipantMedia): boolean {
  return media?.quality === "poor" || media?.quality === "lost";
}

export function isMicMuted(person: RoomPerson): boolean {
  return person.member.muted || person.media?.mic === "muted";
}

export function isListeningOnly(person: RoomPerson): boolean {
  return person.inVoice && !person.member.muted && (person.media?.mic ?? "none") === "none";
}
