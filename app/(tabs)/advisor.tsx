// app/(tabs)/advisor.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function Advisor() {
  const { darkMode } = useTheme();
  const backgroundColor = darkMode ? "#111827" : "#f9fafb";
  const textColor = darkMode ? "#f9fafb" : "#111827";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>
        Advisor Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // you can also add padding or other shared styles here
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
});
