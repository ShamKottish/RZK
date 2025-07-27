// app/signup.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const logo = require("../assets/images/3D.png");
const { height } = Dimensions.get("window");
const TOP_BAR_HEIGHT = 56;

export default function SignUpScreen() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Theme colors
  const bg = darkMode ? "#111827" : "#f5f5f5";
  const text = darkMode ? "#f9fafb" : "#111827";
  const cardBg = darkMode ? "#1f2937" : "#fff";
  const placeholder = darkMode ? "#d1d5db" : "#6b7280";

  const handleSignUp = async () => {
    if (!email || !password || !phone) {
      setError("Please fill in all fields.");
      return;
    }
    if (phone.length < 9) {
      setError("Phone number must be at least 9 digits after +966.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      await AsyncStorage.setItem("token", "demo-token-123");
      router.replace("/dashboard");
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.topTitle, { color: text }]}>
          Create Account
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <Image
              source={logo}
              style={[styles.logoFull, { height: height * 0.35 }]}
              resizeMode="contain"
            />

            {/* Form */}
            <View style={styles.formContainer}>
              {error ? (
                <Text style={styles.error}>{error}</Text>
              ) : null}

              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: cardBg, borderColor: placeholder },
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={placeholder}
                />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="Email"
                  placeholderTextColor={placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: cardBg, borderColor: placeholder },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={placeholder}
                />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="Password"
                  placeholderTextColor={placeholder}
                  secureTextEntry={!showPwd}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPwd((v) => !v)}>
                  <Ionicons
                    name={showPwd ? "eye-off" : "eye"}
                    size={20}
                    color={placeholder}
                  />
                </Pressable>
              </View>

              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: cardBg, borderColor: placeholder },
                ]}
              >
                <Text style={[styles.flag, { color: placeholder }]}>
                  🇸🇦
                </Text>
                <Text style={[styles.prefix, { color: text }]}>
                  +966
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: text, marginLeft: 4 },
                  ]}
                  placeholder="712345678"
                  placeholderTextColor={placeholder}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(t) => setPhone(t.replace(/\D/g, ""))}
                />
              </View>

              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: "#8b5cf6" },
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  topBar: {
    height: TOP_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
  },
  backBtn: {
    padding: 8,
    marginRight: 12,
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  container: {
    flex: 1,
    paddingTop: TOP_BAR_HEIGHT,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: "center",
  },
  logoFull: {
    width: "100%",
    marginBottom: 16,
  },
  formContainer: {
    width: "100%",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 48,
  },
  input: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
  },
  flag: {
    fontSize: 18,
  },
  prefix: {
    fontSize: 16,
    marginLeft: 8,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#dc2626",
    marginBottom: 12,
    textAlign: "center",
  },
});
