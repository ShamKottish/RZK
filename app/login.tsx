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
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  setLoading(true);
  try {
    const response = await fetch("http://<192.168.7.242>:8000/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Login failed.");
    await AsyncStorage.setItem("token", data.access_token);
    router.replace("/dashboard");
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  const handleSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.7.242:8000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          phone_number: phone_number,
          birthday: birthday,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Signup failed.");
      }

      await AsyncStorage.setItem("token", data.access_token);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}> 
      <View style={[styles.supportButton, { top: insets.top || 16 }]}> 
        <Pressable onPress={() => router.push("/support")}> 
          <Ionicons name="headset-outline" size={24} color={text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome to RZK</Text>

            <View style={styles.tabContainer}>
              <Pressable onPress={() => setActiveTab("login")} style={[styles.tab, activeTab === "login" && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === "login" && styles.activeTabText]}>Login</Text>
              </Pressable>
              <Pressable onPress={() => setActiveTab("signup")} style={[styles.tab, activeTab === "signup" && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === "signup" && styles.activeTabText]}>Sign Up</Text>
              </Pressable>
            </View>

            {activeTab === "signup" && (
              <>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#eee"
                  value={username}
                  onChangeText={setUsername}
                />
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#eee"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                />
              </>
            )}

            <Text style={styles.label}>Email or Phone</Text>
            <View style={[styles.inputGroup, { backgroundColor: cardBg, borderColor: placeholder }]}> 
              <Ionicons name={/^[0-9]+$/.test(identifier) ? "call-outline" : "mail-outline"} size={20} color={placeholder} />
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

            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputGroup, { backgroundColor: cardBg, borderColor: placeholder, justifyContent: "space-between" }]}>
              <Ionicons name="lock-closed-outline" size={20} color={placeholder} />
              <TextInput
                style={[styles.input, { color: text, flex: 1, marginLeft: 12, marginRight: 8 }]}
                placeholder="Password"
                placeholderTextColor={placeholder}
                secureTextEntry={!showPwd}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPwd((v) => !v)}>
                <Ionicons name={showPwd ? "eye-off" : "eye"} size={20} color={placeholder} />
              </Pressable>
            </View>

            {activeTab === "login" && (
              <>
                <Pressable onPress={() => setRememberMe(!rememberMe)} style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, alignSelf: "flex-start" }}>
                  <View style={{ height: 20, width: 20, borderRadius: 4, borderWidth: 1, borderColor: placeholder, backgroundColor: rememberMe ? "#8b5cf6" : "transparent", justifyContent: "center", alignItems: "center", marginRight: 8 }}>
                    {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={{ color: text, fontSize: 14 }}>Remember Me</Text>
                </Pressable>
                <Pressable onPress={() => router.push("/forgot-password")}>
                  <Text style={[styles.forgotText, { color: text }]}>Forgot Password?</Text>
                </Pressable>
              </>
            )}

            <Pressable
              onPress={activeTab === "signup" ? handleSignup : handleLogin}
              disabled={loading || (activeTab === "login" && (!identifier || !password))}
              style={[styles.button, loading && { opacity: 0.6 }]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {activeTab === "signup" ? "Create Account" : "Sign In"}
                </Text>
              )}
            </Pressable>

            {biometricAvailable && activeTab === "login" && (
              <Pressable style={styles.button} onPress={authenticateBiometric}>
                <Text style={styles.buttonText}>Activate Quick Log In</Text>
              </Pressable>
            )}

            <Text style={[styles.demoHint, { color: placeholder }]}>Demo: demo@rzk.com or 0551234567 / password123</Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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