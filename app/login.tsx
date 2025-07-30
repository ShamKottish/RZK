import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const bg = darkMode ? "#111827" : "#f5f5f5";
  const text = darkMode ? "#f9fafb" : "#111827";
  const cardBg = darkMode ? "#1f2937" : "#fff";
  const placeholder = darkMode ? "#d1d5db" : "#6b7280";

  useEffect(() => {
    const checkBiometrics = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);
    };
    const loadSavedCredentials = async () => {
      const savedIdentifier = await AsyncStorage.getItem("savedIdentifier");
      const savedPassword = await AsyncStorage.getItem("savedPassword");
      if (savedIdentifier && savedPassword) {
        setIdentifier(savedIdentifier);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    };
    checkBiometrics();
    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      const validEmail = "demo@rzk.com";
      const validPhone = "0551234567";
      if (
        (identifier === validEmail || identifier === validPhone) &&
        password === "password123"
      ) {
        await AsyncStorage.setItem("token", "demo-token-123");
        if (rememberMe) {
          await AsyncStorage.setItem("savedIdentifier", identifier);
          await AsyncStorage.setItem("savedPassword", password);
        } else {
          await AsyncStorage.removeItem("savedIdentifier");
          await AsyncStorage.removeItem("savedPassword");
        }
        router.replace("/dashboard");
      } else {
        setError("Invalid credentials.");
      }
    }, 1000);
  };

  const authenticateBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Login with Face ID / Fingerprint",
        fallbackLabel: "Enter password",
      });
      if (result.success) {
        await AsyncStorage.setItem("token", "demo-token-123");
        router.replace("/dashboard");
      } else {
        Alert.alert("Authentication failed");
      }
    } catch (e) {
  const err = e as Error;
  Alert.alert("Biometric error", err.message);
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
            <Text style={[styles.brandTitle, { color: text }]}>
              <Text style={{ color: "#8b5cf6" }}>RZK</Text>
            </Text>

            <Text style={[styles.title, { color: text }]}>Welcome Back!</Text>
            {!!error && <Text style={styles.error}>{error}</Text>}

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

            {/* Remember Me */}
            <Pressable
              onPress={() => setRememberMe(!rememberMe)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
                alignSelf: "flex-start",
              }}
            >
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: placeholder,
                  backgroundColor: rememberMe ? "#8b5cf6" : "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
              <Text style={{ color: text, fontSize: 14 }}>Remember Me</Text>
            </Pressable>

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

            <Pressable onPress={() => router.push("/forgot-password")}>
              <Text style={[styles.forgotText, { color: "#8b5cf6" }]}>
                Forgot Password?
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                { backgroundColor: "#8b5cf6" },
                (!identifier || !password || loading) && styles.buttonDisabled,
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

            {/* Biometric Login */}
            {biometricAvailable && (
              <Pressable
                style={[styles.button, { backgroundColor: "#8b5cf6" }]}
                onPress={authenticateBiometric}
              >
                <Text style={styles.buttonText}>Activate Quick Log In</Text>
              </Pressable>
            )}

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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 12,
  },
  signupPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  promptText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  forgotText: {
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.6,
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
  },
  error: {
    color: "#fecaca",
    marginBottom: 12,
    textAlign: "center",
  },
});
