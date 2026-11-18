import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import { Tooltip, type TooltipSide } from "./tooltip.tsx";

const iconButtonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center",
    "transition-[color,background-color,transform] duration-150 active:scale-95",
    "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      tone: {
        neutral: "text-ink-muted hover:bg-surface-bright hover:text-ink",
        raised: "bg-surface-bright text-ink-soft hover:text-ink",
        active: "bg-accent-soft text-accent-text hover:bg-accent-soft",
        off: "text-danger-text hover:bg-danger-soft",
        danger: "bg-danger text-white hover:bg-danger-hover",
      },
      size: {
        xs: "size-[30px] rounded-full [&_svg]:size-4",
        sm: "size-9 rounded-[var(--radius-tile)] [&_svg]:size-[18px]",
        md: "size-11 rounded-[var(--radius-tile)] [&_svg]:size-5",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> &
  VariantProps<typeof iconButtonVariants> & {
    label: string;
    tooltipSide?: TooltipSide;
    badge?: ReactNode;
  };

export function IconButton({
  label,
  tone,
  size,
  className,
  children,
  badge,
  tooltipSide = "top",
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <Tooltip label={label} side={tooltipSide}>
      <button
        type={type}
        aria-label={label}
        className={cn(iconButtonVariants({ tone, size }), className)}
        {...props}
      >
        {children}
        {badge ? (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 font-display text-[11px] font-bold text-ink-on-accent">
            {badge}
          </span>
        ) : null}
      </button>
    </Tooltip>
  );
}
