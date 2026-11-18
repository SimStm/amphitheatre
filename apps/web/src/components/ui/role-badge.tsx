import { IconCrown, IconGavel, IconShieldCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn.ts";
import {
  isHighlightedRole,
  roleLabelKey,
  roleTextClass,
  type HighlightedRole,
} from "../../lib/role-style.ts";
import type { Role } from "../../shared-types.ts";

const roleIcons = {
  owner: IconCrown,
  admin: IconShieldCheck,
  moderator: IconGavel,
} as const satisfies Record<HighlightedRole, unknown>;

const badgeTones: Record<HighlightedRole, string> = {
  owner: "bg-role-owner-soft",
  admin: "bg-role-admin-soft",
  moderator: "bg-role-moderator-soft",
};

const markTones: Record<HighlightedRole, string> = {
  owner: "bg-role-owner",
  admin: "bg-role-admin",
  moderator: "bg-role-moderator",
};

/** Role name in a pill. Owners, admins, and moderators also get their icon and color. */
export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const { t } = useTranslation();
  const highlighted = isHighlightedRole(role);
  const Icon = highlighted ? roleIcons[role] : null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-display text-xs font-bold leading-4",
        highlighted
          ? [badgeTones[role], roleTextClass[role]]
          : "bg-surface-bright text-ink-muted",
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" stroke={2} aria-hidden="true" /> : null}
      {t(roleLabelKey[role])}
    </span>
  );
}

/** Solid round mark for avatars. The surrounding control names the role. */
export function RoleMark({
  role,
  small,
  className,
}: {
  role: Role;
  small?: boolean;
  className?: string;
}) {
  if (!isHighlightedRole(role)) return null;
  const Icon = roleIcons[role];
  return (
    <span
      aria-hidden="true"
      data-role={role}
      className={cn(
        "flex items-center justify-center rounded-full border border-border-float text-on-role",
        small ? "size-4 [&_svg]:size-2.5" : "size-5 [&_svg]:size-3",
        markTones[role],
        className,
      )}
    >
      <Icon stroke={2.25} />
    </span>
  );
}

/** Inline role icon for text, with the role name for screen readers. */
export function RoleIcon({ role, className }: { role: Role | undefined; className?: string }) {
  const { t } = useTranslation();
  if (!isHighlightedRole(role)) return null;
  const Icon = roleIcons[role];
  const label = t(roleLabelKey[role]);
  return (
    <span className={cn("inline-flex shrink-0", roleTextClass[role], className)} title={label}>
      <Icon className="size-3.5" stroke={2} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  );
}
