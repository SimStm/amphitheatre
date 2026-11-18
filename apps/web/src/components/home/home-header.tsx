import { IconChevronDown } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { SiteHeader } from "../chrome/site-header.tsx";
import { Avatar } from "../ui/avatar.tsx";

type HomeHeaderProps = {
  id: string;
  name: string;
  onRename: () => void;
};

export function HomeHeader({ id, name, onRename }: HomeHeaderProps) {
  const { t } = useTranslation();

  return (
    <SiteHeader
      trailing={
        <button
          type="button"
          onClick={onRename}
          aria-label={t("home.changeName")}
          className="flex h-11 max-w-36 items-center gap-2 rounded-full border border-border bg-surface-raised pl-1.5 pr-2.5 text-ink-soft transition-colors hover:border-border-input sm:h-9 sm:max-w-44"
        >
          <Avatar id={id} name={name} size="xs" />
          <span className="truncate text-[13.5px]">{name}</span>
          <IconChevronDown className="size-3.5 shrink-0 text-ink-subtle" stroke={1.75} aria-hidden="true" />
        </button>
      }
    />
  );
}
