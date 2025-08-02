// app/(tabs)/settings.tsx
import { useI18n } from "@/app/lib/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CommonActions,
  NavigationProp,
  ParamListBase,
  useNavigation,
} from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const router = useRouter();
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { language, setLanguage, t } = useI18n();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // placeholder user info
  const userName = "John Doe";
  const userEmail = "john.doe@example.com";

  const toggleNotifications = useCallback(
    async (value: boolean) => {
      if (value) {
        try {
          const { status } = await Notifications.requestPermissionsAsync();
          setNotificationsEnabled(status === "granted");
          if (status !== "granted") {
            Alert.alert(
              "Permissions required",
              "Please enable notifications in settings."
            );
          }
        } catch (e) {
          console.error("Notification permission error", e);
          Alert.alert("Error", "Unable to update notification settings.");
        }
      } else {
        setNotificationsEnabled(false);
      }
    },
    []
  );

  const handleCustomerService = useCallback(() => {
    const subject = encodeURIComponent(("helpEmailSubject"));
    Linking.openURL(
      `mailto:support@rzkfinance.com?subject=${subject}`
    ).catch(() => {
      Alert.alert("Error", "Unable to open mail client.");
    });
  }, [t]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "login" as any }],
        })
      );
    } catch (e) {
      console.error("Logout error", e);
      Alert.alert("Error", "Unable to log out. Please try again.");
    }
  }, [navigation]);

  const handleLanguageToggle = useCallback(() => {
    const next = language === "en" ? "ar" : "en";
    setLanguage(next).catch((e) => {
      console.error("Language switch failed", e);
      Alert.alert("Error", "Unable to change language.");
    });
  }, [language, setLanguage]);

  // TODO: Replace with real theme / darkMode context
  const darkMode = false;
  const bg = darkMode ? "#111827" : "#f9fafb";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const textColor = darkMode ? "#f9fafb" : "#111827";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const border = darkMode ? "#374151" : "#e5e7eb";
  const linkColor = "#2563eb";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.header, { color: textColor }]}>
          {t("settings")}
        </Text>

        {/* Profile Information */}
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: textColor }]}>
            {t("profileInformation")}
          </Text>
          <View style={[styles.row, { borderColor: border }]}>
            <Text style={[styles.optionLabel, { color: textColor }]}>
              {t("name")}
            </Text>
            <Text style={[styles.valueLabel, { color: subtext }]}>
              {userName}
            </Text>
          </View>
          <View style={[styles.row, { borderColor: border }]}>
            <Text style={[styles.optionLabel, { color: textColor }]}>
              {t("email")}
            </Text>
            <Text style={[styles.valueLabel, { color: subtext }]}>
              {userEmail}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.row, { borderColor: border }]}
            onPress={() => router.push("/profile")}
            accessibilityRole="button"
            accessibilityLabel={t("viewProfile")}
          >
            <Text style={[styles.linkLabel, { color: linkColor }]}>
              {t("viewProfile")}
            </Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: textColor }]}>
            {t("preferences")}
          </Text>

          <View style={[styles.row, { borderColor: border }]}>
            <Text style={[styles.optionLabel, { color: textColor }]}>
              {t("darkMode")}
            </Text>
            <Switch
              value={darkMode}
              onValueChange={() => {
                // integrate actual theme toggle here
              }}
              trackColor={{ false: "#767577", true: "#8b5cf6" }}
              thumbColor={darkMode ? "#fff" : "#f4f3f4"}
              accessibilityLabel={t("darkMode")}
            />
          </View>

          <View style={[styles.row, { borderColor: border }]}>
            <Text style={[styles.optionLabel, { color: textColor }]}>
              {t("notifications")}
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: "#767577", true: "#8b5cf6" }}
              thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
              accessibilityLabel={t("notifications")}
            />
          </View>

          <TouchableOpacity
            style={[styles.row, { borderColor: border }]}
            onPress={handleLanguageToggle}
          >
            <Text style={[styles.optionLabel, { color: textColor }]}>
              {t("language")}: {language === "en" ? "🇬🇧 English" : "🇸🇦 العربية"}
            </Text>
            <Ionicons name="language-outline" size={20} color={subtext} />
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: textColor }]}>
            {t("account")}
          </Text>
          <TouchableOpacity
            style={[styles.row, { borderColor: border }]}
            onPress={() => router.push("/forgot-password")}
          >
            <Text style={[styles.linkLabel, { color: linkColor }]}>
              {t("changePassword")}
            </Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.row, { borderColor: border }]}
            onPress={handleCustomerService}
          >
            <Text style={[styles.linkLabel, { color: linkColor }]}>
              {t("customerService")}
            </Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: textColor }]}>
            {t("about")}
          </Text>
          <Text
            style={[
              styles.optionLabel,
              { color: textColor, marginBottom: 8, lineHeight: 20 },
            ]}
          >
            {("aboutDescription")}
          </Text>
          <TouchableOpacity
            style={[styles.row, { borderColor: border }]}
            onPress={() => Linking.openURL("https://rzkfinance.com")}
          >
            <Text style={[styles.linkLabel, { color: linkColor }]}>
              {t("visitWebsite")}
            </Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Legal */}
        <View
          style={[
            styles.card,
            { backgroundColor: cardBg, borderColor: border },
          ]}
        >
          <Text style={[styles.cardTitle, { color: textColor }]}>
            {t("legal")}
          </Text>
          <View style={[styles.row, { borderColor: border }]}>
            <Text style={[styles.optionLabel, { color: textColor }]}>
              {t("appVersion")}
            </Text>
            <Text style={[styles.valueLabel, { color: subtext }]}>1.0.0</Text>
          </View>
          <TouchableOpacity
            style={[styles.row, { borderColor: border }]}
            onPress={() => router.push("/terms")}
          >
            <Text style={[styles.linkLabel, { color: linkColor }]}>
              {t("termsOfService")}
            </Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.row, { borderColor: border }]}
            onPress={() => router.push("/privacy")}
          >
            <Text style={[styles.linkLabel, { color: linkColor }]}>
              {t("privacyPolicy")}
            </Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { borderColor: border, backgroundColor: cardBg },
          ]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: "#ef4444" }]}>
            {t("logout")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContent: { padding: 16 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 24 },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: { fontSize: 16 },
  valueLabel: { fontSize: 16 },
  linkLabel: { fontSize: 16 },
  arrow: { fontSize: 16 },
  logoutBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#6d28d9",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 12,
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#a78bfa",
    borderRadius: 999,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#6d28d9",
  },
  label: {
    color: "#ffffffff",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
  },
  forgotText: {
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: "underline",
    color: "#fff",
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#8b5cf6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  supportButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },
  demoHint: {
    marginTop: 16,
    fontStyle: "italic",
    fontSize: 12,
    color: "#d1d5db",
  },
  error: {
    color: "#fecaca",
    marginTop: 12,
    textAlign: "center",
  },
});
