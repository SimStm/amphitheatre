import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn.ts";
import { placePopover } from "../../lib/popover-position.ts";
import { Button } from "./button.tsx";

type PopoverProps = {
  open: boolean;
  onClose: () => void;
  anchor: HTMLElement | null;
  label: string;
  className?: string;
  children: ReactNode;
};

/** Speech-bubble popover in the top layer, placed to the right of its anchor. */
export function Popover({ open, onClose, anchor, label, className, children }: PopoverProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useLayoutEffect(() => {
    openRef.current = open;
    const element = ref.current;
    if (!open || !anchor || !element) return;
    if (!element.matches(":popover-open")) element.showPopover();
    element.focus({ preventScroll: true });

    // The anchor can move with list changes and scrolling, so it is followed while open.
    let frame = 0;
    let placed = "";
    const follow = () => {
      const box = anchor.getBoundingClientRect();
      const place = placePopover({
        anchor: {
          right: box.left + box.width / 2 + anchor.offsetWidth / 2,
          centerY: box.top + box.height / 2,
        },
        size: { width: element.offsetWidth, height: element.offsetHeight },
        viewport: { width: window.innerWidth, height: window.innerHeight },
      });
      const next = `${place.left}|${place.top}|${place.arrowTop}`;
      if (next !== placed) {
        placed = next;
        element.style.setProperty("--popover-left", `${place.left}px`);
        element.style.setProperty("--popover-top", `${place.top}px`);
        element.style.setProperty("--popover-arrow-top", `${place.arrowTop}px`);
      }
      frame = requestAnimationFrame(follow);
    };
    follow();
    return () => cancelAnimationFrame(frame);
  }, [open, anchor]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (ref.current?.contains(target) || anchor?.contains(target)) return;
      onCloseRef.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, anchor]);

  const finishClosing = () => {
    const element = ref.current;
    if (openRef.current || !element?.matches(":popover-open")) return;
    const active = document.activeElement;
    const focusWasHere = !active || active === document.body || element.contains(active);
    element.hidePopover();
    if (focusWasHere) anchor?.focus({ preventScroll: true });
  };

  return (
    <div
      ref={ref}
      popover="manual"
      role="dialog"
      aria-label={label}
      tabIndex={-1}
      data-floating=""
      className="ui-popover"
    >
      <AnimatePresence onExitComplete={finishClosing}>
        {open ? (
          <motion.div
            key="surface"
            className="ui-popover__surface"
            initial={{ opacity: 0, x: -8, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -5, scale: 0.98, transition: { duration: 0.12, ease: "easeIn" } }}
            transition={{ type: "spring", bounce: 0.14, visualDuration: 0.24 }}
          >
            <span className="ui-popover__arrow" aria-hidden="true" />
            <div className={cn("ui-popover__body text-sm text-ink-muted", className)}>{children}</div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("app.close")}
              onClick={onClose}
              className="absolute right-2 top-2 size-8 [&_svg]:size-4"
            >
              <IconX aria-hidden stroke={1.75} />
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
