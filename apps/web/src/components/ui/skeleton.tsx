import { cn } from "../../lib/cn.ts";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-[var(--radius-control)]", className)} />;
}

export function TheaterSkeleton() {
  return (
    <div className="room-stage relative h-dvh overflow-hidden" aria-busy="true">
      <Skeleton className="absolute left-4 top-4 h-[60px] w-[232px] rounded-[var(--radius-panel)]" />
      <Skeleton className="absolute left-1/2 top-4 h-11 w-72 -translate-x-1/2 rounded-full" />
      <Skeleton className="absolute bottom-6 left-1/2 h-16 w-[min(462px,calc(100%-2rem))] -translate-x-1/2 rounded-[var(--radius-panel)]" />
    </div>
  );
}
