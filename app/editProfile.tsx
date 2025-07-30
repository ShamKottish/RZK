import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const { darkMode } = useTheme();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");

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
      if (data.userName) setName(data.userName);
      if (data.userEmail) setEmail(data.userEmail);
      if (data.userBirthday) setBirthday(new Date(data.userBirthday));
      if (data.userPhone) setPhone(data.userPhone);
      if (data.userCountry) setCountry(data.userCountry);
    });
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Name and email cannot be empty.");
      return;
    }
    try {
      await AsyncStorage.multiSet([
        ["userName", name],
        ["userEmail", email],
        ["userBirthday", birthday?.toISOString() || ""],
        ["userPhone", phone],
        ["userCountry", country],
      ]);
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const bg = darkMode ? "#111827" : "#f9fafb";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const border = darkMode ? "#374151" : "#e5e7eb";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.header, { borderColor: border }]}>
          <Ionicons name="pencil-outline" size={32} color={subtext} />
          <Text style={[styles.title, { color: text }]}>Edit Profile</Text>
        </View>

        {/* Name */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>Name</Text>
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor={subtext}
          />
        </View>

        {/* Email */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={subtext}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Birthday (with date picker) */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>Birthday</Text>
          <Pressable onPress={() => setShowDatePicker(true)} style={[styles.input, { justifyContent: "center", borderColor: subtext }]}>
            <Text style={{ color: birthday ? text : subtext }}>
              {birthday ? birthday.toLocaleDateString("en-US") : "Select Birthday"}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={birthday || new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === "android" ? "calendar" : "inline"}
              maximumDate={new Date()}
              onChange={(_, date) => {
                setShowDatePicker(false);
                if (date) setBirthday(date);
              }}
            />
          )}
        </View>

        {/* Phone */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>Phone Number</Text>
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="+966512345678"
            placeholderTextColor={subtext}
            keyboardType="phone-pad"
          />
        </View>

        {/* Country */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.label, { color: subtext }]}>Country</Text>
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            value={country}
            onChangeText={setCountry}
            placeholder="Saudi Arabia"
            placeholderTextColor={subtext}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6b7280" }]}
            onPress={handleCancel}
          >
            <Text style={[styles.buttonText]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#2563eb" }]}
            onPress={handleSave}
          >
            <Text style={[styles.buttonText]}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "700", marginLeft: 12 },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  label: { fontSize: 14, marginBottom: 8, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flex: 0.48,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
