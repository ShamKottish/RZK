import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    // Demo login only - replace with your API
    if (email === "demo@wealthwise.com" && password === "password123") {
      await AsyncStorage.setItem("token", "demo-token-123");
      router.replace("/"); // Send to home tab
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign In" onPress={handleLogin} />
      <Text style={styles.demoHint}>
        Demo: demo@wealthwise.com / password123
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#aaa", borderRadius: 8, padding: 10, marginBottom: 10 },
  error: { color: "red", marginBottom: 8 },
  demoHint: { marginTop: 20, color: "#888" }
});
