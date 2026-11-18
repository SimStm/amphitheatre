import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  applyDocumentLang,
  persistLocale,
  readStoredLocale,
  resolveLocale,
} from "../lib/i18n.ts";
import i18n from "../lib/i18n.ts";
import type { Locale, ThemeMode } from "../shared-types.ts";

type UiState = {
  theme: ThemeMode;
  locale: Locale;
  autoHideSeconds: number;
  setTheme: (theme: ThemeMode) => void;
  setLocale: (locale: Locale) => void;
  setAutoHideSeconds: (seconds: number) => void;
};

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0e0a07" : "#f6ebe3");
}

function migrateLegacyLocale() {
  const stored = readStoredLocale();
  if (stored && !localStorage.getItem("coliseum.locale")) {
    persistLocale(stored);
  }
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: "dark",
      locale: resolveLocale(),
      autoHideSeconds: 5,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      setLocale: (locale) => {
        persistLocale(locale);
        void i18n.changeLanguage(locale);
        set({ locale });
      },
      setAutoHideSeconds: (autoHideSeconds) => set({ autoHideSeconds }),
    }),
    {
      name: "coliseum.ui",
      partialize: (state) => ({ theme: state.theme, autoHideSeconds: state.autoHideSeconds }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        applyTheme(state.theme);
        migrateLegacyLocale();
        const locale = resolveLocale();
        applyDocumentLang(locale);
        void i18n.changeLanguage(locale);
        if (state.locale !== locale) {
          useUiStore.setState({ locale });
        }
      },
    },
  ),
);
