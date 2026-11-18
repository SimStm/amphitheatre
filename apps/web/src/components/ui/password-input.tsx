import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input, type InputProps } from "./input.tsx";

export function PasswordInput(props: Omit<InputProps, "type" | "trailing">) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const label = visible ? t("join.hidePassword") : t("join.showPassword");
  const Icon = visible ? IconEyeOff : IconEye;
  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      trailing={
        <button
          type="button"
          aria-label={label}
          aria-pressed={visible}
          title={label}
          onClick={() => setVisible((value) => !value)}
          className="flex size-9 items-center justify-center rounded-[10px] text-ink-subtle transition-colors hover:text-ink focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none"
        >
          <Icon aria-hidden size={18} stroke={1.75} />
        </button>
      }
    />
  );
}
