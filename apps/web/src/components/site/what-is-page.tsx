import { IconDoor, IconEyeOff, IconHome, IconUsers } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "../ui/badge.tsx";
import { buttonVariants } from "../ui/button.tsx";
import { Card, CardBody } from "../ui/card.tsx";
import { ContentPage } from "./content-page.tsx";

function StoryCard({ icon, title, body }: { icon: ReactNode; title: string; body: string }) {
  return (
    <Card icon={icon} title={title}>
      <CardBody>
        <p className="text-[15px] leading-6 text-ink-dim">{body}</p>
      </CardBody>
    </Card>
  );
}

export function WhatIsPage() {
  const { t } = useTranslation();
  return (
    <ContentPage
      title={t("pages.whatIsTitle")}
      lead={t("pages.whatIsLead")}
      eyebrow={<Badge tone="accent">{t("pages.whatIsKicker")}</Badge>}
      actions={
        <Link to="/" className={buttonVariants({ size: "lg" })}>
          {t("pages.goHome")}
        </Link>
      }
    >
      <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2">
        <StoryCard
          icon={<IconUsers stroke={1.75} />}
          title={t("pages.whatIsForTitle")}
          body={t("pages.whatIsFor")}
        />
        <StoryCard
          icon={<IconDoor stroke={1.75} />}
          title={t("pages.whatIsRoomTitle")}
          body={t("pages.whatIsRoom")}
        />
        <StoryCard
          icon={<IconHome stroke={1.75} />}
          title={t("pages.whatIsDesignedTitle")}
          body={t("pages.whatIsDesigned")}
        />
        <StoryCard
          icon={<IconEyeOff stroke={1.75} />}
          title={t("pages.whatIsLeaveTitle")}
          body={t("pages.whatIsLeave")}
        />
      </div>
    </ContentPage>
  );
}
