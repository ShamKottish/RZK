// contexts/ThemeContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const THEME_KEY = "darkMode";

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [darkMode, setDarkModeState] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored !== null) {
        setDarkModeState(stored === "true");
      }
    })();
  }, []);

  const setDarkMode = async (val: boolean) => {
    setDarkModeState(val);
    await AsyncStorage.setItem(THEME_KEY, val.toString());
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
