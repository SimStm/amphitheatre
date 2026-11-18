import type { Variants } from "motion/react";

export const pageStagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const pageRise: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.15, visualDuration: 0.5 },
  },
};
