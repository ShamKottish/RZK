// app/(tabs)/settings.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <ThemedText type="title" style={styles.header}>
          Settings
        </ThemedText>

        {/* Preferences */}
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Preferences
          </ThemedText>
          <View style={styles.row}>
            <ThemedText>Dark Mode</ThemedText>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ccc', true: '#8b5cf6' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.row}>
            <ThemedText>Notifications</ThemedText>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ccc', true: '#8b5cf6' }}
              thumbColor={notifications ? '#fff' : '#f4f3f4'}
            />
          </View>
        </ThemedView>

        {/* Account */}
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Account
          </ThemedText>
          <TouchableOpacity style={styles.row}>
            <ThemedText>Profile</ThemedText>
            <ThemedText>{'>'}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <ThemedText>Change Password</ThemedText>
            <ThemedText>{'>'}</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* About */}
        <ThemedView style={styles.card}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            About
          </ThemedText>
          <View style={styles.row}>
            <ThemedText>App Version</ThemedText>
            <ThemedText>1.0.0</ThemedText>
          </View>
          <TouchableOpacity style={styles.row}>
            <ThemedText>Terms of Service</ThemedText>
            <ThemedText>{'>'}</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
});
