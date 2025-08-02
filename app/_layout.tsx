// app/_layout.tsx
import { I18nProvider } from "@/app/lib/i18n";
import { Slot } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <Slot />
      </I18nProvider>
    </SafeAreaProvider>
  );
}
