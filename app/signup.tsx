// app/signup.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

const TOP_BAR_HEIGHT = 56;
const router = useRouter();

// Add this near the top of your file (after imports)

const BASE_URL = "http://192.168.7.242:8000"; // Replace with your local IP and backend port

  export default function SignUpScreen()
{
  const router = useRouter();
  const { darkMode } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const bg = darkMode ? "#111827" : "#f5f5f5";
  const text = darkMode ? "#f9fafb" : "#111827";
  const cardBg = darkMode ? "#1f2937" : "#fff";
  const placeholder = darkMode ? "#d1d5db" : "#6b7280";

  const handleSignUp = async () => {
    console.log("handleSignUp: invoked", {
    email,
    passwordProvided: !!password,
    confirmPwdProvided: !!confirmPwd,
    phone,
    agreed,
    birthday,
  });
  if (!email || !password || !confirmPwd || !phone || !agreed) {
      console.log("handleSignUp: validation failed - missing fields", {
      email,
      passwordPresent: !!password,
      confirmPwdPresent: !!confirmPwd,
      phone,
      agreed,
    });
    setError("Please fill in all fields, confirm password, select birthday, and accept Terms.");
    return;
  }
  if (password !== confirmPwd) {
    console.log("handleSignUp: validation failed - passwords do not match", {
    passwordLength: password.length,
    confirmPwdLength: confirmPwd.length,
    });
    setError("Passwords do not match.");
    return;
  }
  if (phone.length < 9) {
   console.log("handleSignUp: validation failed - phone too short", { phone });
    setError("Phone number must be at least 9 digits.");
    return;
  }

  setError("");
  setLoading(true);
  console.log("handleSignUp: passed validation, proceeding", { email, phone, agreed });

  try {
    const birthdayString = birthday?.toISOString().split("T")[0] || "";
    console.log("handleSignUp: formatted birthday", { birthdayString });

    console.log("handleSignUp: calling registerUser", {
      email,
      phone_number: phone,
      birthday: birthdayString,
    });

    const res = await registerUser({
      email,
      password,
      phone_number: phone,
      birthday: birthdayString,
    });
    console.log("handleSignUp: registerUser response", res);

    await AsyncStorage.setItem("token", res.access_token);
    console.log("handleSignUp: token saved to AsyncStorage");

    router.replace("/dashboard");
    console.log("handleSignUp: navigated to /dashboard");
  } catch (err) {
    console.log("handleSignUp: caught error", err);
    console.error("SignUp error:", JSON.stringify(err));
    if (err instanceof Error) setError(err.message);
    else if (typeof err === "object" && err !== null) setError(JSON.stringify(err));
    else setError("Something went wrong.");
  } finally {
    setLoading(false);
    console.log("handleSignUp: finished, loading set to false");
  }
};

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={text} />
        </Pressable>
        <Text style={[styles.brandTitle, { color: text }]}>
          <Text style={{ color: '#8b5cf6', fontWeight: '800', fontSize: 25 }}>RZK</Text>
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
            <View style={styles.formContainer}>
              {error ? (
                <Text style={[styles.error, { color: '#dc2626' }]}>{error}</Text>
              ) : null}

              {/* Email */}
              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: cardBg, borderColor: placeholder },
                ]}
              >
                <Ionicons name="mail-outline" size={20} color={placeholder} />
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

              {/* Password */}
              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: cardBg, borderColor: placeholder },
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={placeholder} />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="Password"
                  placeholderTextColor={placeholder}
                  secureTextEntry={!showPwd}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setShowPwd(v => !v)}>
                  <Ionicons name={showPwd ? "eye-off" : "eye"} size={20} color={placeholder} />
                </Pressable>
              </View>

              {/* Confirm Password */}
              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: cardBg, borderColor: placeholder },
                ]}
              >
                <Ionicons name="lock-closed-outline" size={20} color={placeholder} />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="Confirm Password"
                  placeholderTextColor={placeholder}
                  secureTextEntry={!showPwd}
                  value={confirmPwd}
                  onChangeText={setConfirmPwd}
                />
              </View>

              {/* Phone */}
              <View
                style={[
                  styles.inputGroup,
                  { backgroundColor: cardBg, borderColor: placeholder },
                ]}
              >
                <Text style={[styles.flag, { color: placeholder }]}>🇸🇦</Text>
                <Text style={[styles.prefix, { color: text }]}>+966</Text>
                <TextInput
                  style={[styles.input, { color: text, marginLeft: 4 }]}
                  placeholder="5**"
                  placeholderTextColor={placeholder}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={t => setPhone(t.replace(/\D/g, ""))}
                />
              </View>

              {/* Birthday */}
                    <Pressable
                style={[
                  styles.inputGroup,
                  { justifyContent: 'center', borderColor: placeholder, backgroundColor: cardBg }
                ]}
                onPress={() => setShowBirthdayPicker(true)}
              >
                <Text style={{ color: birthday ? text : placeholder }}>
                  {birthday ? birthday.toLocaleDateString('en-US') : 'Choose Your Birthday'}
                </Text>
              </Pressable>
              {showBirthdayPicker && (
                <DateTimePicker
                  value={birthday || new Date()}
                  mode="date"
                  display={Platform.OS === 'android' ? 'calendar' : 'inline'}
                  themeVariant={darkMode ? "dark" : "light"}
                  textColor={text}
                  onChange={(e: DateTimePickerEvent, d?: Date) => {
                    setShowBirthdayPicker(false);
                    if (d) setBirthday(d);
                  }}
                />
              )}

              {/* Terms & Conditions */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Pressable onPress={() => setAgreed(!agreed)} style={{ marginRight: 8 }}>
                  <Ionicons
                    name={agreed ? 'checkbox-outline' : 'square-outline'}
                    size={24}
                    color={agreed ? '#8b5cf6' : placeholder}
                  />
                </Pressable>
                <Text style={{ color: text }}>
                  I agree to the{' '}
                  <Text
                    style={{ color: '#8b5cf6' }}
                    onPress={() => router.push('/terms')}
                  >
                    Terms & Conditions
                  </Text>
                </Text>
              </View>

              {/* Submit */}
              <Pressable
                style={[
                  styles.button,
                  { backgroundColor: '#8b5cf6' },
                  loading || !agreed ? styles.buttonDisabled : null,
                ]}
                onPress={handleSignUp}
                disabled={loading || !agreed}
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
type SignupPayload = {
  email: string;
  password: string;
  phone_number: string;
  birthday: string;
};

const registerUser = async (payload: SignupPayload): Promise<{ access_token: string }> => {
  const response = await fetch(`${BASE_URL}/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Signup failed.");
  }

  return data;
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  topBar: {
    height: TOP_BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
  },
  backBtn: { padding: 8, marginRight: 12 },
  brandTitle: { fontSize: 25, fontWeight: "800", marginBottom: 8 },
  container: { flex: 1, paddingTop: TOP_BAR_HEIGHT },
  scrollContent: { flexGrow: 1, padding: 24 },
  formContainer: { flex: 1 },
  label: { fontSize: 16, marginBottom: 8 },
  inputGroup: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 8, borderWidth: 1, paddingHorizontal: 12,
    marginBottom: 16, height: 48,
  },
  input: { flex: 1, height: "100%", marginLeft: 8 },
  flag: { fontSize: 18 },
  prefix: { fontSize: 16, marginLeft: 8 },
  button: {
    height: 48, borderRadius: 8, justifyContent: "center",
    alignItems: "center", marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  error: { fontSize: 14, marginBottom: 12, textAlign: "center" },
});