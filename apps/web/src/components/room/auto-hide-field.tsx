import { useTranslation } from "react-i18next";
import { useUiStore } from "../../stores/ui-store.ts";
import { OptionGroup } from "../ui/option-group.tsx";

const options = [5, 10, 20, 30, 0];

export function AutoHideField() {
  const { t } = useTranslation();
  const seconds = useUiStore((s) => s.autoHideSeconds);
  const setSeconds = useUiStore((s) => s.setAutoHideSeconds);

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="label-caps mb-1 text-ink-muted">{t("settings.interfaceTitle")}</legend>
      <p className="text-sm text-ink">{t("settings.autoHide")}</p>
      <OptionGroup
        name="auto-hide"
        label={t("settings.autoHide")}
        value={seconds}
        onChange={setSeconds}
        options={options.map((option) => ({
          value: option,
          label:
            option === 0 ? t("settings.autoHideNever") : t("settings.autoHideSeconds", { count: option }),
        }))}
      />
      <p className="text-[13px] leading-5 text-ink-subtle">{t("settings.autoHideHint")}</p>
    </fieldset>
  );
}
