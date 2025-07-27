// app/_layout.tsx
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      {/* StatusBar auto‑switches based on theme */}
      <StatusBar style="auto" />
      <Slot />
    </ThemeProvider>
  );
}
