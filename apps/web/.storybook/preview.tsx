import type { Decorator, Preview } from "@storybook/react-vite";
import { MotionConfig } from "motion/react";
import { useEffect } from "react";
import "../src/index.css";
import i18n from "../src/lib/i18n.ts";

const withAppearance: Decorator = (Story, context) => {
  const theme = context.globals.theme as string;
  const locale = context.globals.locale as string;
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    void i18n.changeLanguage(locale);
  }, [theme, locale]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-40 bg-surface-page p-6 text-ink">
        <Story />
      </div>
    </MotionConfig>
  );
};

const preview: Preview = {
  decorators: [withAppearance],
  initialGlobals: { theme: "dark", locale: "pt-BR" },
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "dark", title: "Dark" },
          { value: "light", title: "Light" },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: "Language",
      toolbar: {
        title: "Language",
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "pt-BR", title: "Português" },
          { value: "es", title: "Español" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    a11y: { test: "todo" },
  },
};

export default preview;
