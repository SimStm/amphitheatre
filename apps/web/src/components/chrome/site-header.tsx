import { IconSettings } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "../ui/dialog.tsx";
import { IconButton } from "../ui/icon-button.tsx";
import { AppearanceFields } from "./appearance-fields.tsx";
import { BrandWordmark } from "./brand-mark.tsx";
import { PwaInstallAction } from "./pwa-install.tsx";

export function SkipLink() {
  const { t } = useTranslation();
  return (
    <a href="#main" className="skip-link">
      {t("app.skipToContent")}
    </a>
  );
}

export function SiteHeader({ trailing }: { trailing?: ReactNode }) {
  const { t } = useTranslation();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-3 px-4 sm:px-[26px]">
      <Link
        to="/"
        aria-label={t("app.name")}
        className="flex min-h-11 min-w-0 items-center rounded-[var(--radius-tile)] focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
      >
        <BrandWordmark decorative className="h-8 max-w-[10rem] sm:h-10 sm:max-w-[14rem]" />
      </Link>
      <div className="flex shrink-0 items-center gap-1.5">
        <IconButton
          label={t("settings.generalTab")}
          size="md"
          tooltipSide="bottom"
          className="sm:size-9"
          onClick={() => setSettingsOpen(true)}
        >
          <IconSettings aria-hidden="true" stroke={1.75} />
        </IconButton>
        {trailing}
      </div>

      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} title={t("settings.generalTab")}>
        <div className="flex flex-col gap-6">
          <AppearanceFields />
          <PwaInstallAction />
        </div>
      </Dialog>
    </header>
  );
}
