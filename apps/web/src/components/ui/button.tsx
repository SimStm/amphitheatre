import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn.ts";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-display font-bold",
    "rounded-[var(--radius-control)]",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-150",
    "active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-ink-on-accent hover:bg-accent-hover active:bg-accent-pressed",
        secondary: "border border-border-input bg-surface-bright text-ink hover:border-border-strong",
        ghost: "bg-transparent text-ink-muted hover:bg-surface-bright hover:text-ink",
        danger: "bg-danger-soft text-danger-text hover:bg-danger hover:text-white",
      },
      size: {
        sm: "h-9 px-3 text-[13px] [&_svg]:size-4",
        md: "h-10 px-4 text-sm [&_svg]:size-4",
        lg: "h-12 px-5 text-[15px] [&_svg]:size-5",
        touch: "h-11 min-h-[44px] min-w-[44px] px-4 text-sm [&_svg]:size-5",
        icon: "size-10 [&_svg]:size-5",
        iconTouch: "size-11 min-h-[44px] min-w-[44px] [&_svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  loading,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}

export { buttonVariants };
