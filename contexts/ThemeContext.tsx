// app/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState } from "react";
import { Lang, strings } from "../app/translations";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode(v: boolean): void;
  language: Lang;
  setLanguage(l: Lang): void;
  t(key: keyof typeof strings.en): string;
}

const ThemeContext = createContext<ThemeContextType>(null!);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Lang>("en");

  const t = (key: keyof typeof strings.en) => {
    return strings[language][key] || key;
  };

  return (
    <ThemeContext.Provider
      value={{ darkMode, setDarkMode, language, setLanguage, t }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
