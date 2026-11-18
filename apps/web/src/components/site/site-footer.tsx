import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

const linkClass =
  "inline-flex min-h-11 items-center no-underline transition-colors hover:text-accent-text sm:min-h-0";

export function SiteFooter({ note }: { note: string }) {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto flex justify-center pt-12">
      <div className="float-surface-strong flex max-w-full flex-col items-center gap-x-5 gap-y-1 rounded-[var(--radius-panel)] px-4 py-2.5 text-center text-[13px] leading-5 text-ink-dim sm:flex-row sm:text-left">
        <p>{note}</p>
        <nav aria-label={t("nav.label")} className="flex shrink-0 items-center gap-4 font-display font-bold">
          <Link
            to="/what-is"
            className={linkClass}
            activeProps={{ className: "text-accent-text", "aria-current": "page" }}
            inactiveProps={{ className: "text-ink-muted" }}
          >
            {t("nav.whatIs")}
          </Link>
          <Link
            to="/about"
            className={linkClass}
            activeProps={{ className: "text-accent-text", "aria-current": "page" }}
            inactiveProps={{ className: "text-ink-muted" }}
          >
            {t("nav.about")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
