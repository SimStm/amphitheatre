import { motion } from "motion/react";
import type { ReactNode } from "react";
import { pageRise, pageStagger } from "../../lib/page-motion.ts";
import { SkipLink } from "../chrome/site-header.tsx";
import { InfiniteGrid3D } from "../home/infinite-grid-3d.tsx";
import { SiteFooter } from "./site-footer.tsx";

type SiteShellProps = {
  header: ReactNode;
  footerNote: string;
  children: ReactNode;
};

export function SiteShell({ header, footerNote, children }: SiteShellProps) {
  return (
    <div className="home-shell flex min-h-dvh flex-col overflow-x-hidden">
      <InfiniteGrid3D />
      <SkipLink />
      <div className="relative z-10">{header}</div>
      <motion.main
        id="main"
        className="relative z-10 mx-auto flex w-full max-w-[1152px] flex-1 flex-col px-4 pb-6 pt-8 sm:pt-12"
        variants={pageStagger}
        initial="hidden"
        animate="shown"
      >
        {children}
        <motion.div variants={pageRise} className="mt-auto">
          <SiteFooter note={footerNote} />
        </motion.div>
      </motion.main>
    </div>
  );
}

type PageIntroProps = {
  title: string;
  lead: string;
  eyebrow?: ReactNode;
  actions?: ReactNode;
};

export function PageIntro({ title, lead, eyebrow, actions }: PageIntroProps) {
  return (
    <>
      {eyebrow ? (
        <motion.div variants={pageRise} className="mb-3">
          {eyebrow}
        </motion.div>
      ) : null}
      <motion.h1
        variants={pageRise}
        className="font-display text-[28px] font-bold leading-9 text-ink sm:text-[34px] sm:leading-[42px]"
      >
        {title}
      </motion.h1>
      <motion.p variants={pageRise} className="mt-1.5 max-w-2xl text-base leading-6 text-ink-dim">
        {lead}
      </motion.p>
      {actions ? (
        <motion.div variants={pageRise} className="mt-5 flex flex-wrap gap-2">
          {actions}
        </motion.div>
      ) : null}
    </>
  );
}
