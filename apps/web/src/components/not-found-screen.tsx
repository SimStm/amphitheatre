import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrandMark } from "./chrome/brand-mark.tsx";
import { SkipLink } from "./chrome/site-header.tsx";
import { InfiniteGrid3D } from "./home/infinite-grid-3d.tsx";
import { buttonVariants } from "./ui/button.tsx";

type NotFoundScreenProps = {
  kind?: "page" | "room";
};

export function NotFoundScreen({ kind = "page" }: NotFoundScreenProps) {
  const { t } = useTranslation();
  const title = kind === "room" ? t("error.roomNotFoundTitle") : t("error.notFoundTitle");
  const body = kind === "room" ? t("error.roomNotFoundBody") : t("error.notFoundBody");

  useEffect(() => {
    document.title = `${title} · Amphitheatre`;
    return () => {
      document.title = "Amphitheatre";
    };
  }, [title]);

  return (
    <div className="home-shell relative flex min-h-dvh flex-col overflow-x-hidden">
      <InfiniteGrid3D />
      <SkipLink />
      <main
        id="main"
        className="relative z-10 flex min-h-dvh flex-1 flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div className="flex max-w-[36ch] flex-col items-center gap-6">
          <BrandMark className="size-14" />
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-display text-4xl font-bold tracking-tight text-ink">{title}</h1>
            <p className="text-base text-ink-muted">{body}</p>
          </div>
          <Link
            to="/"
            className={buttonVariants({ variant: "primary", size: "touch" })}
          >
            {t("error.goHome")}
          </Link>
        </div>
      </main>
    </div>
  );
}
