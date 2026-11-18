import { IconMoon, IconSun } from "@tabler/icons-react";
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { useUiStore } from "../../stores/ui-store.ts";
import { OptionGroup } from "../ui/option-group.tsx";
import { Select } from "../ui/select.tsx";

export function AppearanceFields() {
  const { t } = useTranslation();
  const { theme, locale, setTheme, setLocale } = useUiStore();
  const themeName = useId();
  const localeId = useId();

  return (
    <div className="flex flex-col gap-6 text-ink">
      <div className="flex flex-col gap-2">
        <p className="label-caps text-ink-muted">{t("theme.label")}</p>
        <OptionGroup
          name={themeName}
          label={t("theme.label")}
          value={theme}
          onChange={setTheme}
          className="grid grid-cols-2"
          options={[
            { value: "light", label: t("theme.light"), icon: <IconSun stroke={1.75} aria-hidden="true" /> },
            { value: "dark", label: t("theme.dark"), icon: <IconMoon stroke={1.75} aria-hidden="true" /> },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="label-caps text-ink-muted" htmlFor={localeId}>
          {t("locale.label")}
        </label>
        <Select
          id={localeId}
          value={locale}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "en" || value === "pt-BR" || value === "es") setLocale(value);
          }}
        >
          <option value="en">{t("locale.en")}</option>
          <option value="pt-BR">{t("locale.ptBR")}</option>
          <option value="es">{t("locale.es")}</option>
        </Select>
      </div>
    </div>
  );
}
