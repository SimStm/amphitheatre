import type { Role } from "../shared-types.ts";

export const roleLabelKey = {
  owner: "indicator.roleOwner",
  admin: "indicator.roleAdmin",
  moderator: "indicator.roleModerator",
  member: "indicator.roleMember",
} as const satisfies Record<Role, string>;

export type HighlightedRole = Exclude<Role, "member">;

export function isHighlightedRole(role: Role | undefined): role is HighlightedRole {
  return role !== undefined && role !== "member";
}

export const roleTextClass: Record<HighlightedRole, string> = {
  owner: "text-role-owner",
  admin: "text-role-admin",
  moderator: "text-role-moderator",
};
