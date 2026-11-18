import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";

export type TooltipSide = "top" | "bottom" | "left" | "right";

const sideClass: Record<TooltipSide, string> = {
  top: "bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0",
  bottom:
    "left-1/2 top-full mt-2 -translate-x-1/2 -translate-y-1 group-hover/tooltip:translate-y-0 group-focus-within/tooltip:translate-y-0",
  left: "right-full top-1/2 mr-2 -translate-y-1/2 translate-x-1 group-hover/tooltip:translate-x-0 group-focus-within/tooltip:translate-x-0",
  right:
    "left-full top-1/2 ml-2 -translate-y-1/2 -translate-x-1 group-hover/tooltip:translate-x-0 group-focus-within/tooltip:translate-x-0",
};

export function Tooltip({
  label,
  children,
  className,
  side = "bottom",
}: {
  label: string;
  children: ReactNode;
  className?: string;
  side?: TooltipSide;
}) {
  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "float-surface-strong pointer-events-none absolute z-50 whitespace-nowrap rounded-lg px-2 py-1",
          "font-sans text-xs text-ink opacity-0 transition-[opacity,transform] duration-150",
          "group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
          sideClass[side],
        )}
      >
        {label}
      </span>
    </span>
  );
}
