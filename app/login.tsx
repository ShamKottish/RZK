// app/login.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../contexts/ThemeContext";

export default function LoginScreen() {
  const router = useRouter();
  const { darkMode } = useTheme();

  // Combined identifier (email or phone) + password
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets(); 

  const bg = darkMode ? "#111827" : "#f5f5f5";
  const text = darkMode ? "#f9fafb" : "#111827";
  const cardBg = darkMode ? "#1f2937" : "#fff";
  const placeholder = darkMode ? "#d1d5db" : "#6b7280";

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");
    setLoading(true);

try {
  const response = await fetch("https://e671de40ef7c.ngrok-free.app/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: identifier,
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed.");
  }

  await AsyncStorage.setItem("token", data.access_token);
  router.replace("/dashboard");
} catch (err: any) {
  setError(err.message);
} finally {
  setLoading(false);
}

  };

  return (
<SafeAreaView
  style={[
    styles.safe,
    {
      backgroundColor: bg,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
  ]}
>
      {/* Customer Service Button */}
      <View style={[styles.supportButton, { top: insets.top || 16 }]}>
        <Pressable onPress={() => router.push("/support")}>
          <Ionicons name="headset-outline" size={24} color={text} />
        </Pressable>
      </View>
        <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* Brand */}
            <Text style={[styles.brandTitle, { color: text }]}>
              <Text style={{ color: "#8b5cf6" }}>RZK</Text>
            </Text>

            <Text style={[styles.title, { color: text }]}>Welcome Back!</Text>
            {!!error && <Text style={styles.error}>{error}</Text>}

            {/* Identifier (email or phone) */}
            <View
              style={[
                styles.inputGroup,
                { backgroundColor: cardBg, borderColor: placeholder },
              ]}
            >
              <Ionicons
                name={
                  /^[0-9]+$/.test(identifier)
                    ? "call-outline"
                    : "mail-outline"
                }
                size={20}
                color={placeholder}
              />
              <TextInput
                style={[styles.input, { color: text }]}
                placeholder="Email or Phone"
                placeholderTextColor={placeholder}
                keyboardType="default"      
                autoCapitalize="none"
                value={identifier}
                onChangeText={setIdentifier}
              />
            </View>

            {/* Password */}
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

            {/* Sign Up Prompt */}
            <View style={styles.signupPrompt}>
              <Text style={[styles.promptText, { color: text }]}>
                Don't have an account?{" "}
              </Text>
              <Pressable onPress={() => router.push("/signup")}>
                <Text style={[styles.linkText, { color: "#8b5cf6" }]}>
                  Sign Up
                </Text>
              </Pressable>
            </View>

            {/* Forgot Password */}
            <Pressable onPress={() => router.push("/forgot-password")}>
              <Text style={[styles.forgotText, { color: "#8b5cf6" }]}>
                Forgot Password?
              </Text>
            </Pressable>

            {/* Login Button */}
            <Pressable
              style={[
                styles.button,
                { backgroundColor: "#8b5cf6" },
                (!identifier || !password || loading) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!identifier || !password || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </Pressable>

            <Text style={[styles.demoHint, { color: placeholder }]}>
              Demo: demo@rzk.com or 0551234567 / password123
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#6b21a8",
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(109,40,217,0.6)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 12,
    color: "#fff",
  },
  signupPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  promptText: {
    fontSize: 14,
    color: "#e5e7eb",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
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
    marginTop: 8,
    width: "100%",
    backgroundColor: "#fff",
  },
  supportButton: {
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 10,
},
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#6b21a8", fontSize: 16, fontWeight: "700" },
  demoHint: {
    marginTop: 16,
    fontStyle: "italic",
    fontSize: 12,
    color: "#d1d5db",
  },
  error: { color: "#fecaca", marginBottom: 12, textAlign: "center" },
});