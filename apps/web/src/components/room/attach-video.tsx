import type { Track } from "livekit-client";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn.ts";

export function AttachVideo({
  track,
  muted = false,
  className,
}: {
  track: Track;
  muted?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    track.attach(element);
    return () => {
      track.detach(element);
    };
  }, [track]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-contain", className)}
      autoPlay
      playsInline
      muted={muted}
    />
  );
}
