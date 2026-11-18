import { motion, type HTMLMotionProps } from "motion/react";
import { useId, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn.ts";
import { pageRise } from "../../lib/page-motion.ts";
import { IconTile } from "./icon-tile.tsx";

type CardProps = Omit<HTMLMotionProps<"section">, "title" | "children"> & {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

export function Card({ icon, title, children, className, ...props }: CardProps) {
  const titleId = useId();
  return (
    <motion.section
      variants={pageRise}
      aria-labelledby={titleId}
      className={cn(
        "flex min-w-0 flex-col rounded-[var(--radius-panel)] border border-border-soft bg-surface-raised",
        className,
      )}
      {...props}
    >
      <header className="flex items-center gap-3.5 px-5 pt-6 sm:px-7">
        <IconTile>{icon}</IconTile>
        <h2 id={titleId} className="font-display text-[19px] font-bold leading-6 text-ink">
          {title}
        </h2>
      </header>
      {children}
    </motion.section>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-1 flex-col gap-4 px-5 pb-6 pt-4 sm:px-7", className)} {...props} />;
}
