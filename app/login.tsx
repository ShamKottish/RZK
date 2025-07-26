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
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setError("");
    setLoading(true);
    // simulate network delay
    setTimeout(async () => {
      setLoading(false);
      if (email === "demo@wealthwise.com" && password === "password123") {
        await AsyncStorage.setItem("token", "demo-token-123");
        router.replace("/dashboard");
      } else {
        setError("Invalid email or password.");
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.title}>Welcome Back</Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.inputGroup}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#6b7280"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#6b7280"
                secureTextEntry={!showPwd}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPwd((v) => !v)}>
                <Ionicons
                  name={showPwd ? "eye-off" : "eye"}
                  size={20}
                  color="#6b7280"
                />
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.button,
                (!email || !password || loading) && styles.buttonDisabled,
              ]}
              onPress={handleLogin}
              disabled={!email || !password || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </Pressable>

            <Text style={styles.demoHint}>
              Demo credentials: demo@wealthwise.com / password123
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const COLORS = {
  background: "#f5f5f5",
  card: "#fff",
  primary: "#8b5cf6",
  primaryDark: "#7c3aed",
  text: "#111827",
  textLight: "#6b7280",
  error: "#dc2626",
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 32,
    textAlign: "center",
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textLight,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    color: COLORS.text,
  },
  button: {
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: COLORS.primaryDark,
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  demoHint: {
    marginTop: 16,
    textAlign: "center",
    color: COLORS.textLight,
    fontStyle: "italic",
    fontSize: 12,
  },
  error: {
    color: COLORS.error,
    marginBottom: 12,
    textAlign: "center",
  },
});
