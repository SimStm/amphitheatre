import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn.ts";

const tones = {
  neutral: "bg-surface-bright text-ink-muted",
  muted: "bg-transparent text-ink-subtle",
  accent: "bg-accent-soft text-accent-text",
  stage: "bg-accent text-ink-on-accent",
  danger: "bg-danger-soft text-danger-text",
  live: "bg-live text-white",
  speaking: "bg-speaking-soft text-speaking",
  selfhost: "bg-selfhost-soft text-selfhost",
  attention: "bg-attention-soft text-attention-text",
} as const;

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-display text-xs font-bold leading-4",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
