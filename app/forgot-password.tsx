// app/forgot-password.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [loading, setLoading] = useState(false);

  const bg = darkMode ? '#111827' : '#f5f5f5';
  const text = darkMode ? '#f9fafb' : '#111827';
  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const placeholder = darkMode ? '#d1d5db' : '#6b7280';

  const handleReset = () => {
    if (!identifier) {
      Alert.alert('Error', 'Please enter your email or phone number.');
      return;
    }
    setLoading(true);
    // simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Reset Sent',
        `If an account exists for "${identifier}", you’ll receive reset instructions shortly.`,
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={[styles.header, { color: text }]}>
              Reset Password
            </Text>
            <Text style={[styles.subheader, { color: placeholder }]}>
              Enter your email address or phone number to receive reset instructions.
            </Text>

            <View style={[styles.inputGroup, { backgroundColor: cardBg, borderColor: placeholder }]}>
              <Ionicons
                name={identifier.match(/^[0-9]*$/) ? 'call-outline' : 'mail-outline'}
                size={20}
                color={placeholder}
              />
              <TextInput
                style={[styles.input, { color: text }]}
                placeholder="Email or Phone"
                placeholderTextColor={placeholder}
                keyboardType={identifier.match(/^[0-9]*$/) ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                value={identifier}
                onChangeText={setIdentifier}
              />
            </View>

            <Pressable
              style={[styles.button, { backgroundColor: '#8b5cf6' }, loading && styles.buttonDisabled]}
              onPress={handleReset}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.buttonText}>Send Reset Link</Text>
              }
            </Pressable>

            <Pressable onPress={() => router.back()}>
              <Text style={[styles.backText, { color: '#8b5cf6' }]}>
                ← Back to Login
              </Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    marginBottom: 24,
    height: 48,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    height: '100%',
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
