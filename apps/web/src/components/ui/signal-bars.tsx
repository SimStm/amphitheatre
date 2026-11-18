import type { ConnectionQuality } from "@coliseum/shared";
import { cn } from "../../lib/cn.ts";

const levels: Record<ConnectionQuality | "unknown", number> = {
  excellent: 3,
  good: 2,
  poor: 1,
  lost: 0,
  unknown: 0,
};

const heights = ["h-1", "h-[7px]", "h-2.5"];

export function SignalBars({
  quality,
  label,
  className,
}: {
  quality: ConnectionQuality | "unknown";
  label: string;
  className?: string;
}) {
  const level = levels[quality];
  const color = quality === "poor" ? "bg-attention" : "bg-speaking";
  return (
    <span role="img" aria-label={label} title={label} className={cn("inline-flex items-end gap-0.5", className)}>
      {heights.map((height, index) => (
        <span
          key={height}
          className={cn("w-[3px] rounded-[1px]", height, index < level ? color : "bg-ink-off")}
        />
      ))}
    </span>
  );
}
