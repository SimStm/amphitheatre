import { describe, expect, test } from "bun:test";
import type { ParticipantMedia, RoomMember } from "../shared-types.ts";
import { buildPeople, isListeningOnly, isMicMuted } from "./room-people.ts";

function member(userId: string, patch: Partial<RoomMember> = {}): RoomMember {
  return { userId, displayName: userId, role: "member", muted: false, present: true, ...patch };
}

const media = (mic: ParticipantMedia["mic"]): ParticipantMedia => ({
  speaking: false,
  audioLevel: 0,
  camera: false,
  screen: false,
  mic,
  quality: "good",
  adaptive: false,
});

describe("buildPeople", () => {
  test("splits people in voice from chat-only people and skips absent members", () => {
    const people = buildPeople({
      members: [member("ana"), member("bia"), member("caio", { present: false })],
      mediaByUserId: {},
      voiceUserIds: { ana: true },
      selfLeftVoice: false,
    });
    expect(people.voice.map((person) => person.member.userId)).toEqual(["ana"]);
    expect(people.chatOnly.map((person) => person.member.userId)).toEqual(["bia"]);
  });

  test("the owner comes first", () => {
    const people = buildPeople({
      members: [member("ana"), member("zeca", { role: "owner" })],
      mediaByUserId: {},
      voiceUserIds: { ana: true, zeca: true },
      selfLeftVoice: false,
    });
    expect(people.voice[0]?.member.userId).toBe("zeca");
  });

  test("leaving voice moves only yourself to chat-only", () => {
    const people = buildPeople({
      members: [member("ana"), member("bia")],
      mediaByUserId: {},
      voiceUserIds: { ana: true, bia: true },
      selfId: "ana",
      selfLeftVoice: true,
    });
    expect(people.voice.map((person) => person.member.userId)).toEqual(["bia"]);
    expect(people.chatOnly.map((person) => person.member.userId)).toEqual(["ana"]);
  });
});

describe("microphone state", () => {
  const base = { member: member("ana"), isSelf: false, inVoice: true };

  test("a muted microphone counts as muted", () => {
    expect(isMicMuted({ ...base, media: media("muted") })).toBe(true);
    expect(isMicMuted({ ...base, media: media("on") })).toBe(false);
  });

  test("a moderator mute counts as muted", () => {
    expect(isMicMuted({ ...base, member: member("ana", { muted: true }) })).toBe(true);
  });

  test("no microphone at all means listening only", () => {
    expect(isListeningOnly({ ...base, media: media("none") })).toBe(true);
    expect(isListeningOnly({ ...base, media: media("on") })).toBe(false);
  });
});
