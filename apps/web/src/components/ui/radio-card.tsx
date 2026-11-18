import type { InputHTMLAttributes, Ref } from "react";
import { cn } from "../../lib/cn.ts";

export function RadioCard({
  title,
  description,
  className,
  ref,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "title"> & {
  title: string;
  description: string;
  ref?: Ref<HTMLInputElement>;
}) {
  return (
    <label
      className={cn(
        "group/radio flex cursor-pointer items-start gap-2.5 rounded-[var(--radius-control)] border border-border-input bg-surface-sunken p-3",
        "transition-[background-color,border-color] duration-150 hover:border-border-strong",
        "has-checked:border-accent has-checked:bg-accent-faint",
        "has-focus-visible:shadow-[var(--shadow-focus)]",
        className,
      )}
    >
      <input ref={ref} type="radio" className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-ink-faint",
          "transition-colors duration-150 group-has-checked/radio:border-accent",
        )}
      >
        <span className="size-2 scale-0 rounded-full bg-accent transition-transform duration-150 group-has-checked/radio:scale-100" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-[14.5px] font-bold leading-5 text-ink-soft group-has-checked/radio:text-ink">
          {title}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-4 text-ink-dim">{description}</span>
      </span>
    </label>
  );
}
