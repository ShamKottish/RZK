// app/login.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
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
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const logo = require('../assets/images/3D.png');

export default function LoginScreen() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const bg = darkMode ? '#111827' : '#f5f5f5';
  const text = darkMode ? '#f9fafb' : '#111827';
  const cardBg = darkMode ? '#1f2937' : '#fff';
  const placeholder = darkMode ? '#d1d5db' : '#6b7280';

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both fields.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      if (
        email === 'demo@wealthwise.com' &&
        password === 'password123'
      ) {
        await AsyncStorage.setItem('token', 'demo-token-123');
        router.replace('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    }, 1000);
  };

  const { width, height } = Dimensions.get('window');
  const logoHeight = height * 0.3;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Image
              source={logo}
              style={[styles.logo, { width, height: logoHeight }]}
              resizeMode="contain"
            />

            <Text style={[styles.title, { color: text }]}>
              Welcome Back
            </Text>
            {!!error && <Text style={styles.error}>{error}</Text>}

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
                  name={showPwd ? 'eye-off' : 'eye'}
                  size={20}
                  color={placeholder}
                />
              </Pressable>
            </View>

            <View style={styles.signupPrompt}>
              <Text style={[styles.promptText, { color: text }]}>
                Don't have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/signup')}>
                <Text style={[styles.linkText, { color: '#8b5cf6' }]}>
                  Sign Up
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.button,
                { backgroundColor: '#8b5cf6' },
                (!email || !password || loading) &&
                  styles.buttonDisabled,
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

            <Text style={[styles.demoHint, { color: placeholder }]}>
              Demo: demo@wealthwise.com / password123
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  logo: { marginBottom: 16 },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 16,
    width: '90%',
  },
  input: { flex: 1, height: 48, marginLeft: 8 },
  signupPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  promptText: { fontSize: 14 },
  linkText: { fontSize: 14, fontWeight: '600' },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    width: '90%',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  demoHint: { marginTop: 16, fontStyle: 'italic', fontSize: 12 },
  error: { color: '#dc2626', marginBottom: 12, textAlign: 'center' },
});
