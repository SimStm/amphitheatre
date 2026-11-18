import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";

const tones = {
  info: "border-border-input bg-surface-bright text-ink-muted",
  warning: "border-transparent bg-attention-soft text-attention-text",
  danger: "border-transparent bg-danger-soft text-danger-text",
} as const;

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: keyof typeof tones;
  title: string;
  children?: ReactNode;
  className?: string;
}) {
  const Icon = tone === "info" ? IconInfoCircle : IconAlertTriangle;
  return (
    <div
      role="status"
      className={cn("flex gap-3 rounded-[var(--radius-control)] border p-3 text-sm", tones[tone], className)}
    >
      <Icon aria-hidden size={18} stroke={1.75} className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="font-display font-bold">{title}</p>
        {children ? <div className="mt-1 text-ink-muted">{children}</div> : null}
      </div>
    </div>
  );
}
