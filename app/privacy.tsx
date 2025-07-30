// app/privacy.tsx
import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PrivacyPolicy() {
  const { darkMode } = useTheme();
  const router = useRouter();

  const bg = darkMode ? "#111827" : "#f9fafb";
  const text = darkMode ? "#f9fafb" : "#111827";
  const heading = darkMode ? "#fff" : "#111";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />

      {/* Header with Back Button */}
      <View style={[styles.header, { borderColor: darkMode ? "#374151" : "#e5e7eb" }]}>
        <TouchableOpacity onPress={() => router.push("/settings")} style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={24} color={text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: heading }]}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.sectionTitle, { color: heading }]}>
          1. Introduction
        </Text>
        <Text style={[styles.paragraph, { color: text }]}>
          Welcome to RZK Finance. We value your privacy and are committed to
          protecting your personal information. This Privacy Policy explains
          how we collect, use, and safeguard your data when you use our app.
        </Text>

        <Text style={[styles.sectionTitle, { color: heading }]}>
          2. Information We Collect
        </Text>
        <Text style={[styles.paragraph, { color: text }]}>
          • Personal Data: Name, email address, and any information you
          provide when creating or editing your profile.{"\n"}
          • Usage Data: App usage statistics, analytics, and crash reports.
          {"\n"}• Notifications: Permission status for push notifications.
        </Text>

        <Text style={[styles.sectionTitle, { color: heading }]}>
          3. How We Use Your Information
        </Text>
        <Text style={[styles.paragraph, { color: text }]}>
          We use your information to:{"\n"}
          • Provide and maintain the app’s features.{"\n"}
          • Personalize your experience and display your savings progress.{"\n"}
          • Send you important updates, alerts, and notifications.
        </Text>

        <Text style={[styles.sectionTitle, { color: heading }]}>
          4. Sharing & Disclosure
        </Text>
        <Text style={[styles.paragraph, { color: text }]}>
          We do not sell or rent your personal data. We may share information
          with:{"\n"}
          • Service providers who assist us in app operations.{"\n"}
          • Legal authorities when required by law.
        </Text>

        <Text style={[styles.sectionTitle, { color: heading }]}>
          5. Data Security
        </Text>
        <Text style={[styles.paragraph, { color: text }]}>
          We implement reasonable security measures to protect your data,
          including encryption and secure storage. However, no method of
          transmission over the internet is completely secure.
        </Text>

        <Text style={[styles.sectionTitle, { color: heading }]}>
          6. Children’s Privacy
        </Text>
        <Text style={[styles.paragraph, { color: text }]}>
          Our app is not intended for children under 13. We do not knowingly
          collect personal information from minors.
        </Text>

        <Text style={[styles.sectionTitle, { color: heading }]}>
          7. Changes to This Policy
        </Text>
        <Text style={[styles.paragraph, { color: text }]}>
          We may update this Privacy Policy occasionally. We will notify you
          of significant changes via the app or email.
        </Text>

        <Text style={[styles.sectionTitle, { color: heading }]}>
          8. Contact Us
        </Text>
        <Text style={[styles.paragraph, { color: text }]}>
          If you have any questions, please contact us at{" "}
          <Text style={{ color: "#2563eb" }}>privacy@rzkfinance.com</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: { marginRight: 16 },
  title: { fontSize: 20, fontWeight: "600" },
  container: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginTop: 16, marginBottom: 8 },
  paragraph: { fontSize: 14, lineHeight: 20 },
});
