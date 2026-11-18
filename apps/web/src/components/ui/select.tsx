import { IconChevronDown } from "@tabler/icons-react";
import type { ReactNode, Ref, SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn.ts";
import { borderClass, fieldClass } from "./input.tsx";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  leading?: ReactNode;
  ref?: Ref<HTMLSelectElement>;
};

export function Select({ className, leading, ref, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      {leading ? (
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint [&_svg]:size-[18px]"
          aria-hidden="true"
        >
          {leading}
        </span>
      ) : null}
      <select
        ref={ref}
        className={cn(
          fieldClass,
          borderClass(),
          "h-12 appearance-none truncate pl-3.5 pr-10",
          Boolean(leading) && "pl-10",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <IconChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
        stroke={1.75}
        aria-hidden="true"
      />
    </div>
  );
}
