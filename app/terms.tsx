// app/(tabs)/terms.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function Terms() {
  const { darkMode } = useTheme();
  const router = useRouter();
  const bg = darkMode ? '#111827' : '#f9fafb';
  const text = darkMode ? '#f9fafb' : '#111827';
  const link = darkMode ? '#8b5cf6' : '#5b21b6';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.header, { color: text }]}>Terms & Conditions</Text>

        <Text style={[styles.paragraph, { color: text }]}>1. Acceptance of Terms</Text>
        <Text style={[styles.paragraph, { color: text }]}>By accessing or using RZK Financial Advisor (“App”), you agree to be bound by these Terms & Conditions.</Text>

        <Text style={[styles.paragraph, { color: text }]}>2. Use of the App</Text>
        <Text style={[styles.paragraph, { color: text }]}>You agree to use the App in compliance with all applicable laws and not for any unlawful or prohibited purpose.</Text>

        <Text style={[styles.paragraph, { color: text }]}>3. Privacy</Text>
        <Text style={[styles.paragraph, { color: text }]}>Your use of the App is also governed by our Privacy Policy. Please review it to understand our practices.</Text>

        <Text style={[styles.paragraph, { color: text }]}>4. Intellectual Property</Text>
        <Text style={[styles.paragraph, { color: text }]}>All content, trademarks, and data on the App are the property of RZK Financial and its licensors.</Text>

        <Text style={[styles.paragraph, { color: text }]}>5. Limitation of Liability</Text>
        <Text style={[styles.paragraph, { color: text }]}>In no event shall RZK Financial be liable for any indirect, consequential, or punitive damages arising out of your use of the App.</Text>

        <Text style={[styles.paragraph, { color: text }]}>6. Changes to Terms</Text>
        <Text style={[styles.paragraph, { color: text }]}>We reserve the right to modify these Terms at any time. Continued use signifies acceptance of any changes.</Text>

        <Text style={[styles.paragraph, { color: text }]}>7. Contact Us</Text>
        <Text style={[styles.paragraph, { color: text }]}>If you have questions about these Terms, please contact us at <Text style={{ color: link }}>support@rzkfinance.com</Text>.</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: link }]} onPress={() => router.back()}>
            <Text style={styles.buttonText}>I Agree</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16 },
  header: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  paragraph: { fontSize: 14, marginBottom: 12, lineHeight: 20 },
  buttonContainer: { alignItems: 'center', marginTop: 24 },
  button: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
