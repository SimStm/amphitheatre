import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn.ts";

export const fieldClass = [
  "w-full rounded-[var(--radius-control)] border bg-surface-sunken text-[15px] text-ink",
  "placeholder:text-ink-faint",
  "transition-[border-color,box-shadow] duration-150",
  "focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--accent-faint)] focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-50",
];

export function borderClass(error?: boolean) {
  return error
    ? "border-danger focus-visible:border-danger focus-visible:shadow-[0_0_0_3px_var(--danger-soft)]"
    : "border-border-input hover:border-border-strong";
}

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  ref?: Ref<HTMLInputElement>;
};

export function Input({ className, error, leading, trailing, ref, ...props }: InputProps) {
  const input = (
    <input
      ref={ref}
      className={cn(
        fieldClass,
        borderClass(error),
        "flex h-12 px-3.5",
        Boolean(leading) && "pl-10",
        Boolean(trailing) && "pr-11",
        className,
      )}
      aria-invalid={error || undefined}
      {...props}
    />
  );
  if (!leading && !trailing) return input;
  return (
    <div className="relative">
      {leading ? (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint [&_svg]:size-[18px]">
          {leading}
        </span>
      ) : null}
      {input}
      {trailing ? <span className="absolute right-1.5 top-1/2 -translate-y-1/2">{trailing}</span> : null}
    </div>
  );
}

export function Textarea({
  className,
  error,
  ref,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean; ref?: Ref<HTMLTextAreaElement> }) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldClass, borderClass(error), "min-h-12 px-3.5 py-3", className)}
      aria-invalid={error || undefined}
      {...props}
    />
  );
}
