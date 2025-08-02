// app/lib/i18n.tsx
import { Lang, TranslationKey, translations } from "@/app/(tabs)/translations"; // adjust path to "../translations" if your tsconfig alias isn't configured
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert, I18nManager } from "react-native";

// Dynamically require expo-updates so missing types or absence doesn't break runtime.
let UpdatesModule: { reloadAsync?: () => Promise<void> } | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  UpdatesModule = require("expo-updates");
} catch {
  UpdatesModule = null;
}

const STORAGE_KEY = "appLanguage";
const RTL_LANGS = new Set<Lang>(["ar"]);

type I18nContextValue = {
  language: Lang;
  setLanguage: (lang: Lang) => Promise<void>;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue>({
  language: "en",
  setLanguage: async () => {},
  t: (k) => String(k),
});

export const useI18n = () => useContext(I18nContext);

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    if (Object.prototype.hasOwnProperty.call(vars, k)) {
      return String(vars[k as keyof typeof vars]);
    }
    return `{${k}}`;
  });
}

async function reloadIfNeeded(newRTL: boolean) {
  if (I18nManager.isRTL !== newRTL) {
    I18nManager.allowRTL(newRTL);
    I18nManager.swapLeftAndRightInRTL(newRTL);
    I18nManager.forceRTL(newRTL);
    if (UpdatesModule?.reloadAsync) {
      try {
        await UpdatesModule.reloadAsync();
        return;
      } catch {
        // fallback to user notice
      }
    }
    Alert.alert(
      newRTL ? "تغيير اللغة" : "Language Change",
      newRTL
        ? "تم تغيير اتجاه الواجهة. يتطلب إعادة تشغيل التطبيق لتفعيل التغييرات."
        : "Interface direction changed. App restart is required to apply it.",
      [{ text: "OK" }]
    );
  }
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Lang>("en");

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        let initial: Lang;
        if (stored === "ar" || stored === "en") {
          initial = stored;
        } else {
          const sysLocale =
            typeof Intl !== "undefined"
              ? (Intl.DateTimeFormat().resolvedOptions().locale || "en").split("-")[0]
              : "en";
          initial = sysLocale.startsWith("ar") ? "ar" : "en";
        }
        setLanguageState(initial);
        await reloadIfNeeded(RTL_LANGS.has(initial));
      } catch {
        // ignore
      }
    })();
  }, []);

  const setLanguage = async (lang: Lang) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, lang);
      setLanguageState(lang);
      await reloadIfNeeded(RTL_LANGS.has(lang));
    } catch {
      // swallow
    }
  };

  const t = (key: TranslationKey, vars?: Record<string, string | number>) => {
    const currentMap = translations[language];
    const fallbackMap = translations.en;
    let raw: string;
    if (currentMap && key in currentMap) {
      raw = currentMap[key];
    } else if (key in fallbackMap) {
      raw = fallbackMap[key];
    } else {
      raw = String(key);
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.warn(`Missing translation key "${key}" for language "${language}"`);
      }
    }
    return interpolate(raw, vars);
  };

  const value = useMemo(() => ({ language, setLanguage, t }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
