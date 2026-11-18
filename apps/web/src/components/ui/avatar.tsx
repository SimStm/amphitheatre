import { cn } from "../../lib/cn.ts";
import { hueFromId, initials } from "../../lib/format.ts";

const AVATAR_COLORS = 7;

const sizes = {
  xs: "size-[22px] text-[9px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  rail: "size-[46px] text-sm",
  railSmall: "size-9 text-xs",
} as const;

export type AvatarSize = keyof typeof sizes;

export function Avatar({
  id,
  name,
  size = "md",
  speaking,
  self,
  dimmed,
  className,
}: {
  id: string;
  name: string;
  size?: AvatarSize;
  speaking?: boolean;
  self?: boolean;
  dimmed?: boolean;
  className?: string;
}) {
  const color = (hueFromId(id) % AVATAR_COLORS) + 1;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full font-display font-bold",
        sizes[size],
        speaking ? "speaking-ring" : self ? "self-ring" : null,
        dimmed && "opacity-70",
        className,
      )}
      style={{ background: `var(--avatar-${color})`, color: "var(--avatar-ink)" }}
    >
      {initials(name)}
    </span>
  );
}
