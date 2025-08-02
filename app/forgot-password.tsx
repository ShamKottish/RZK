// app/forgot-password.tsx
import { useI18n } from '@/app/lib/i18n';
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
  const { t } = useI18n();
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [loading, setLoading] = useState(false);

  // fallback helper for simple keys
  const tr = (key: string, fallback: string) => {
    const val = t(key as any);
    return val === key ? fallback : val;
  };

  const bg = darkMode ? '#111827' : '#f5f5f5';
  const text = darkMode ? '#f9fafb' : '#111827';
  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const placeholder = darkMode ? '#d1d5db' : '#6b7280';
  const accent = '#8b5cf6';

  const handleReset = () => {
    if (!identifier) {
      Alert.alert(
        tr('errorTitle', 'Error'),
        tr('enterEmailOrPhone', 'Please enter your email or phone number.')
      );
      return;
    }
    setLoading(true);
    // simulate API call
    setTimeout(() => {
      setLoading(false);
      const msgFromT = t('resetSentMessage' as any, { identifier });
      const message =
        msgFromT === 'resetSentMessage'
          ? `If an account exists for "${identifier}", you’ll receive reset instructions shortly.`
          : msgFromT;
      Alert.alert(
        tr('resetSentTitle', 'Reset Sent'),
        message,
        [{ text: tr('ok', 'OK'), onPress: () => router.back() }]
      );
    }, 1500);
  };

  const isNumeric = identifier.match(/^[0-9]*$/);
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={[styles.header, { color: text }]}>
              {tr('resetPasswordTitle', 'Reset Password')}
            </Text>
            <Text style={[styles.subheader, { color: placeholder }]}>
              {tr(
                'resetInstructionsSubtitle',
                'Enter your email address or phone number to receive reset instructions.'
              )}
            </Text>

            <View
              style={[
                styles.inputGroup,
                { backgroundColor: cardBg, borderColor: placeholder },
              ]}
            >
              <Ionicons
                name={isNumeric ? 'call-outline' : 'mail-outline'}
                size={20}
                color={placeholder}
              />
              <TextInput
                style={[styles.input, { color: text }]}
                placeholder={tr('emailOrPhonePlaceholder', 'Email or Phone')}
                placeholderTextColor={placeholder}
                keyboardType={isNumeric ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
                value={identifier}
                onChangeText={setIdentifier}
              />
            </View>

            <Pressable
              style={[
                styles.button,
                { backgroundColor: accent },
                loading && styles.buttonDisabled,
              ]}
              onPress={handleReset}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {tr('sendResetLink', 'Send Reset Link')}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => router.back()}>
              <Text style={[styles.backText, { color: accent }]}>
                {tr('back', '← Back')}
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
