import { useCallback, useEffect, useRef, useState } from "react";

export type ChromeHold = {
  overFloat: boolean;
  paused: boolean;
  textFocused: boolean;
  dialogOpen: boolean;
};

export function shouldHoldChrome(hold: ChromeHold): boolean {
  return hold.overFloat || hold.paused || hold.textFocused || hold.dialogOpen;
}

function isTextField(element: Element | null): boolean {
  if (!element) return false;
  if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return true;
  if (element instanceof HTMLInputElement) {
    return !["button", "checkbox", "radio", "range", "submit"].includes(element.type);
  }
  return element instanceof HTMLElement && element.isContentEditable;
}

export function useFloatingChrome({ seconds, paused = false }: { seconds: number; paused?: boolean }) {
  const [manualHidden, setManualHidden] = useState(false);
  const [idle, setIdle] = useState(false);
  const timerRef = useRef(0);
  const overFloatRef = useRef(false);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const arm = useCallback(() => {
    const schedule = () => {
      window.clearTimeout(timerRef.current);
      if (seconds <= 0) return;
      timerRef.current = window.setTimeout(() => {
        const held = shouldHoldChrome({
          overFloat: overFloatRef.current,
          paused: pausedRef.current,
          textFocused: isTextField(document.activeElement),
          dialogOpen: document.querySelector("dialog[open], [popover]:popover-open") !== null,
        });
        if (held) schedule();
        else setIdle(true);
      }, seconds * 1000);
    };
    schedule();
  }, [seconds]);

  useEffect(() => {
    const wake = () => {
      setIdle(false);
      arm();
    };
    const onPointer = (event: PointerEvent) => {
      overFloatRef.current =
        event.target instanceof Element && event.target.closest("[data-floating]") !== null;
      wake();
    };
    const onLeaveWindow = () => {
      overFloatRef.current = false;
    };
    const root = document.documentElement;
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("keydown", wake);
    root.addEventListener("pointerleave", onLeaveWindow);
    wake();
    return () => {
      window.clearTimeout(timerRef.current);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", wake);
      root.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [arm]);

  const asleep = idle && seconds > 0;
  const visible = !manualHidden && !asleep;

  const toggle = useCallback(() => {
    if (!manualHidden && !asleep) {
      setManualHidden(true);
      return;
    }
    setManualHidden(false);
    setIdle(false);
    arm();
  }, [arm, asleep, manualHidden]);

  return { visible, asleep: asleep && !manualHidden, toggle };
}
