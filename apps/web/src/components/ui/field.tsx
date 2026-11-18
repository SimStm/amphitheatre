import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn.ts";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-[13px] leading-4 text-ink-muted", className)} {...props} />;
}

export function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-1.5">
        <Label htmlFor={id}>{label}</Label>
        {optional ? <span className="text-[13px] leading-4 text-ink-faint">{optional}</span> : null}
      </div>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-[12.5px] leading-4 text-ink-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[12.5px] font-bold leading-4 text-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}
