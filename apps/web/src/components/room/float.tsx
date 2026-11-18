import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "../../lib/cn.ts";

const offsets = {
  left: { x: -28 },
  right: { x: 28 },
  top: { y: -22 },
  bottom: { y: 30 },
} as const;

type FloatProps = {
  visible: boolean;
  edge: keyof typeof offsets;
  delay?: number;
  className?: string;
  children: ReactNode;
};

export function Float({ visible, edge, delay = 0, className, children }: FloatProps) {
  const offset = offsets[edge];
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className={cn("pointer-events-none absolute z-20 [&>*]:pointer-events-auto", className)}
          initial={{ opacity: 0, filter: "blur(4px)", ...offset }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            filter: "blur(0px)",
            transition: { type: "spring", bounce: 0.16, visualDuration: 0.42, delay },
          }}
          exit={{
            opacity: 0,
            filter: "blur(3px)",
            ...offset,
            transition: { duration: 0.22, ease: "easeIn" },
          }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function RoomScrims({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="scrims"
          className="pointer-events-none absolute inset-0 z-10"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="room-scrim-top" />
          <div className="room-scrim-bottom" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
