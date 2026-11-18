import { limits } from "@coliseum/shared";
import { z } from "zod";

export const displayNameSchema = z
  .string()
  .trim()
  .min(limits.displayName.min, "validation.displayNameMin")
  .max(limits.displayName.max, "validation.displayNameMax");

export const createRoomSchema = z.object({
  displayName: displayNameSchema,
  name: z
    .string()
    .trim()
    .min(limits.roomName.min, "validation.roomNameMin")
    .max(limits.roomName.max, "validation.roomNameMax"),
  visibility: z.enum(["public", "private"]),
  password: z.string().max(limits.roomPassword.max),
});

export const joinCodeSchema = z.object({
  roomId: z.string().trim().min(1, "validation.roomIdRequired"),
});

export const nameSchema = z.object({
  displayName: displayNameSchema,
});

export const chatSchema = z.object({
  text: z
    .string()
    .trim()
    .min(limits.chatText.min, "validation.chatRequired")
    .max(limits.chatText.max, "validation.chatMax"),
});

export type CreateRoomValues = z.infer<typeof createRoomSchema>;
export type JoinCodeValues = z.infer<typeof joinCodeSchema>;
export type NameValues = z.infer<typeof nameSchema>;
