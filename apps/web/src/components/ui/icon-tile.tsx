import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";

const tones = {
  accent: "bg-accent-soft text-accent-text",
  neutral: "bg-surface-bright text-ink-muted",
  danger: "bg-danger-soft text-danger-text",
} as const;

const sizes = {
  sm: "size-9 rounded-[10px] [&_svg]:size-5",
  lg: "size-12 rounded-[var(--radius-tile)] [&_svg]:size-6",
} as const;

export function IconTile({
  tone = "accent",
  size = "sm",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex shrink-0 items-center justify-center", tones[tone], sizes[size], className)}
    >
      {children}
    </span>
  );
}
