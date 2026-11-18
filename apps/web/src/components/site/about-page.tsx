import {
  IconBrandGithub,
  IconCode,
  IconExternalLink,
  IconHeart,
  IconStack2,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import {
  ABOUT_TOOLS,
  AUTHOR_HREF,
  COFFEE_HREF,
  GITHUB_HREF,
  LICENSE_HREF,
} from "../../lib/about-credits.ts";
import { APP_VERSION } from "../../lib/app-meta.ts";
import { Badge } from "../ui/badge.tsx";
import { buttonVariants } from "../ui/button.tsx";
import { Card, CardBody } from "../ui/card.tsx";
import { ContentPage } from "./content-page.tsx";

const textLink = "text-accent-text underline-offset-2 hover:underline";

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <ContentPage
      title={t("pages.aboutTitle")}
      lead={t("pages.aboutLead")}
      eyebrow={<Badge>{t("about.version", { version: APP_VERSION })}</Badge>}
    >
      <div className="mt-8 grid items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Card icon={<IconCode stroke={1.75} />} title={t("pages.aboutProjectTitle")}>
          <CardBody>
            <p className="text-[15px] leading-6 text-ink-dim">{t("pages.aboutContribute")}</p>
            <p className="text-[13.5px] leading-5 text-ink-subtle">
              {t("pages.aboutLicenseLead")}{" "}
              <a href={LICENSE_HREF} className={textLink} target="_blank" rel="noreferrer">
                GNU AGPLv3
              </a>
              {t("pages.aboutLicenseTail")}{" "}
              <a href={AUTHOR_HREF} className={textLink} target="_blank" rel="noreferrer">
                {t("about.creatorName")}
              </a>
              .
            </p>
            <div className="mt-1 flex flex-wrap gap-2">
              <a
                href={COFFEE_HREF}
                className={buttonVariants({ size: "lg", className: "flex-1" })}
                target="_blank"
                rel="noreferrer"
              >
                <IconHeart aria-hidden="true" stroke={1.75} />
                {t("about.coffee")}
              </a>
              <a
                href={GITHUB_HREF}
                className={buttonVariants({ variant: "secondary", size: "lg", className: "flex-1" })}
                target="_blank"
                rel="noreferrer"
              >
                <IconBrandGithub aria-hidden="true" stroke={1.75} />
                {t("about.github")}
              </a>
            </div>
          </CardBody>
        </Card>

        <Card icon={<IconStack2 stroke={1.75} />} title={t("pages.aboutToolsTitle")}>
          <CardBody>
            <p className="text-[15px] leading-6 text-ink-dim">{t("pages.aboutToolsLead")}</p>
            <ul className="flex flex-col gap-2">
              {ABOUT_TOOLS.map((tool) => (
                <li key={tool.name}>
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-3 rounded-[var(--radius-tile)] bg-surface-row px-3.5 py-3 no-underline transition-colors hover:bg-surface-bright"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-display text-[14.5px] font-bold leading-[18px] text-ink">
                          {tool.name}
                        </span>
                        <span className="text-xs leading-4 text-ink-subtle">
                          {t("about.toolMeta", { version: tool.version, license: tool.license })}
                        </span>
                      </span>
                      <span className="mt-1 block text-[13.5px] leading-5 text-ink-dim">{t(tool.descKey)}</span>
                    </span>
                    <IconExternalLink
                      className="mt-0.5 size-4 shrink-0 text-ink-faint transition-colors group-hover:text-accent-text"
                      stroke={1.75}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </ContentPage>
  );
}
