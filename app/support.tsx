import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Linking, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function SupportScreen() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const bg = darkMode ? "#111827" : "#f9fafb";
  const text = darkMode ? "#f9fafb" : "#111827";
  const card = darkMode ? "#1f2937" : "#ffffff";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const primary = "#8b5cf6";

  const handleEmail = () => {
    Linking.openURL("mailto:support@rzk.com?subject=Support Request");
  };

  const handleWhatsApp = () => {
    const message = "Hello, I need help with the RZK app.";
    const phone = "966501234567"; // <-- Replace with your support number
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={text} />
          </Pressable>
          <Text style={[styles.title, { color: text }]}>Customer Support</Text>
        </View>

        {/* Info */}
        <View style={[styles.card, { backgroundColor: card }]}>
          <Text style={[styles.sectionTitle, { color: text }]}>Need help?</Text>
          <Text style={[styles.description, { color: subtext }]}>
            We're here to assist you with any issues or questions about the app. Reach out to us through any of the channels below.
          </Text>

          {/* Email */}
          <Pressable onPress={handleEmail} style={[styles.contactOption, { borderColor: subtext }]}>
            <Ionicons name="mail-outline" size={20} color={primary} />
            <Text style={[styles.contactText, { color: text }]}>Email: support@rzk.com</Text>
          </Pressable>

          {/* WhatsApp */}
          <Pressable onPress={handleWhatsApp} style={[styles.contactOption, { borderColor: subtext }]}>
            <Ionicons name="logo-whatsapp" size={20} color={primary} />
            <Text style={[styles.contactText, { color: text }]}>WhatsApp: +966 50 123 4567</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  contactText: {
    marginLeft: 12,
    fontSize: 16,
  },
});
