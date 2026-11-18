import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "../../lib/cn.ts";

export function FloatSurface({
  strong,
  className,
  ref,
  ...props
}: HTMLMotionProps<"div"> & { strong?: boolean; ref?: React.Ref<HTMLDivElement> }) {
  return (
    <motion.div
      ref={ref}
      data-floating=""
      className={cn(
        strong ? "float-surface-strong" : "float-surface",
        "rounded-[var(--radius-panel)]",
        className,
      )}
      {...props}
    />
  );
}
