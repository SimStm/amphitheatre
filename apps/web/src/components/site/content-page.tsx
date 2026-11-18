import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "../chrome/site-header.tsx";
import { PageIntro, SiteShell } from "./site-shell.tsx";

type ContentPageProps = {
  title: string;
  lead: string;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
};

export function ContentPage({ title, lead, eyebrow, actions, children }: ContentPageProps) {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${title} · Amphitheatre`;
    return () => {
      document.title = "Amphitheatre";
    };
  }, [title]);

  return (
    <SiteShell header={<SiteHeader />} footerNote={t("home.footer")}>
      <PageIntro title={title} lead={lead} eyebrow={eyebrow} actions={actions} />
      {children}
    </SiteShell>
  );
}
