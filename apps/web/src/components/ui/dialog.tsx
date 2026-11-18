import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn.ts";
import { Button } from "./button.tsx";

export type DialogSize = "md" | "lg" | "xl" | "full";

const EXIT_SECONDS = 0.16;
const exitTransition = { duration: EXIT_SECONDS, ease: "easeIn" } as const;

export function DialogFrame({
  open,
  onClose,
  size = "md",
  labelledBy,
  dismissable = true,
  children,
}: {
  open: boolean;
  onClose: () => void;
  size?: DialogSize;
  labelledBy?: string;
  dismissable?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const full = size === "full";

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open) {
      if (!element.open) element.showModal();
      return;
    }
    // A modal dialog keeps the page inert, so it closes as soon as it has faded out.
    const timer = window.setTimeout(() => element.close(), EXIT_SECONDS * 1000 + 20);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      className="ui-dialog"
      onCancel={(event) => {
        event.preventDefault();
        if (dismissable) onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="scrim"
            className="ui-dialog__scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: exitTransition }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={dismissable && !full ? onClose : undefined}
          />
        ) : null}
        {open ? (
          <motion.div
            key="panel"
            className="ui-dialog__panel"
            data-size={size}
            initial={full ? { opacity: 0, y: 24 } : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: full ? 24 : 8,
              scale: full ? 1 : 0.98,
              transition: exitTransition,
            }}
            transition={{ type: "spring", bounce: 0.14, visualDuration: 0.32 }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  bodyClassName,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: DialogSize;
  bodyClassName?: string;
}) {
  const { t } = useTranslation();
  const full = size === "full";
  const fill = size === "xl" || full;

  return (
    <DialogFrame open={open} onClose={onClose} size={size}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-between gap-3 border-b border-border px-5",
          full ? "py-4" : "py-3",
        )}
      >
        <h2 className="text-lg font-bold leading-6 text-ink">{title}</h2>
        <Button
          variant="ghost"
          size={full ? "iconTouch" : "icon"}
          aria-label={t("app.close")}
          onClick={onClose}
        >
          <IconX aria-hidden stroke={1.75} />
        </Button>
      </div>
      <div
        className={cn(
          "text-sm text-ink-muted",
          fill ? "flex min-h-0 flex-1 flex-col overflow-hidden" : "min-h-0 flex-1 overflow-y-auto px-5 py-4",
          bodyClassName,
        )}
      >
        {children}
      </div>
      {footer ? (
        <div className="flex shrink-0 justify-end gap-2 border-t border-border px-5 py-4">{footer}</div>
      ) : null}
    </DialogFrame>
  );
}
