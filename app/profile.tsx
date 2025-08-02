// app/profile.tsx
import { useI18n } from "@/app/lib/i18n";
import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { darkMode } = useTheme();
  const router = useRouter();
  const { t } = useI18n();

  // helper to allow fallback when a translation key is missing
  const translate = (key: string, fallback: string) => {
    const val = t(key as any);
    return val === key ? fallback : val;
  };

  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userBirthday, setUserBirthday] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userCountry, setUserCountry] = useState<string>("");

  useEffect(() => {
    AsyncStorage.multiGet([
      "userName",
      "userEmail",
      "userBirthday",
      "userPhone",
      "userCountry",
    ]).then((pairs) => {
      const data: Record<string, string> = {};
      pairs.forEach(([key, value]) => {
        if (value) data[key] = value;
      });
      if (data.userName) setUserName(data.userName);
      if (data.userEmail) setUserEmail(data.userEmail);
      if (data.userBirthday) setUserBirthday(data.userBirthday);
      if (data.userPhone) setUserPhone(data.userPhone);
      if (data.userCountry) setUserCountry(data.userCountry);
    });
  }, []);

  const bg = darkMode ? "#111827" : "#f9fafb";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const border = darkMode ? "#374151" : "#e5e7eb";
  const accent = "#8b5cf6";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with Back & Edit Buttons */}
        <View style={[styles.header, { borderColor: border }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => router.replace("/dashboard")}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back-outline" size={24} color={accent} />
            </TouchableOpacity>
            <Ionicons
              name="person-circle-outline"
              size={48}
              color={accent}
            />
            <Text style={[styles.title, { color: accent }]}>
              {translate("profile", "Profile")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/editProfile")}
            style={styles.editIconBtn}
          >
            <Ionicons name="pencil-outline" size={24} color={accent} />
          </TouchableOpacity>
        </View>

        {/* Profile Details */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>
            {translate("name", "Name")}
          </Text>
          <Text style={[styles.value, { color: text }]}>
            {userName || t("yourNamePlaceholder")}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>
            {translate("email", "Email")}
          </Text>
          <Text style={[styles.value, { color: text }]}>
            {userEmail || t("yourEmailPlaceholder")}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>
            {translate("birthday", "Birthday")}
          </Text>
          <Text style={[styles.value, { color: text }]}>
            {userBirthday || translate("notSet", "Not set")}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>
            {translate("phoneNumber", "Phone Number")}
          </Text>
          <Text style={[styles.value, { color: text }]}>
            {userPhone || translate("notSet", "Not set")}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>
            {translate("country", "Country")}
          </Text>
          <Text style={[styles.value, { color: text }]}>
            {userCountry || translate("notSet", "Not set")}
          </Text>
        </View>

        {/* Bottom Edit Button */}
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: cardBg, borderColor: border }]}
          onPress={() => router.push("/editProfile")}
        >
          <Text style={[styles.editText, { color: accent }]}>
            {translate("editProfile", "Edit Profile")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 12,
  },
  editIconBtn: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginLeft: 12,
    // color is overridden inline
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
  },

  editBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    marginTop: 8,
  },
  editText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
