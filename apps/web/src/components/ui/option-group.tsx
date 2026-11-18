import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";

export type Option<T extends string | number> = {
  value: T;
  label: string;
  icon?: ReactNode;
};

type OptionGroupProps<T extends string | number> = {
  name: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export function OptionGroup<T extends string | number>({
  name,
  label,
  value,
  options,
  onChange,
  className,
}: OptionGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] border px-3.5 text-sm transition-colors has-[:focus-visible]:shadow-[var(--shadow-focus)] [&_svg]:size-[18px]",
              active
                ? "border-accent bg-accent-faint text-accent-text"
                : "border-border bg-surface-sunken text-ink-muted hover:text-ink",
            )}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={active}
              onChange={() => onChange(option.value)}
            />
            {option.icon}
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
