import { cn } from "../../lib/cn.ts";

const tones = {
  live: "bg-live",
  speaking: "bg-speaking",
  attention: "bg-attention",
  idle: "bg-ink-faint",
} as const;

export function StatusDot({
  tone = "idle",
  pulse,
  className,
}: {
  tone?: keyof typeof tones;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span aria-hidden className={cn("relative inline-flex size-2 shrink-0", className)}>
      {pulse ? (
        <span
          className={cn(
            "absolute inset-0 rounded-full opacity-60 motion-safe:animate-ping",
            tones[tone],
          )}
        />
      ) : null}
      <span className={cn("relative size-full rounded-full", tones[tone])} />
    </span>
  );
}
