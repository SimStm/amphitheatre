import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const arcs = [
  { radius: 70, opacity: 0.9 },
  { radius: 118, opacity: 0.6 },
  { radius: 166, opacity: 0.38 },
  { radius: 214, opacity: 0.22 },
  { radius: 262, opacity: 0.12 },
];

function arcPath(radius: number): string {
  return `M ${280 - radius} 280 A ${radius} ${radius * 0.72} 0 0 1 ${280 + radius} 280`;
}

export function EmptyStage() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <svg
        viewBox="0 84 560 204"
        fill="none"
        className="mb-5 w-[min(420px,78vw)] text-accent"
        aria-hidden="true"
      >
        {arcs.map((arc, index) => (
          <motion.path
            key={arc.radius}
            d={arcPath(arc.radius)}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeOpacity={arc.opacity}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </svg>
      <motion.h2
        className="font-display text-[26px] font-bold leading-8 text-ink"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, type: "spring", bounce: 0.15, visualDuration: 0.5 }}
      >
        {t("room.emptyTitle")}
      </motion.h2>
      <motion.p
        className="mt-2 max-w-sm text-[15px] leading-[22px] text-ink-dim"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, type: "spring", bounce: 0.15, visualDuration: 0.5 }}
      >
        {t("room.emptyBody")}
      </motion.p>
    </div>
  );
}
