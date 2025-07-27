// app/(tabs)/settings.tsx
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions, useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Settings() {
  const router = useRouter();
  const navigation = useNavigation();
  const { darkMode, setDarkMode } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      setNotificationsEnabled(status === 'granted');
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleCustomerService = () => {
    Linking.openURL('mailto:support@rzkfinance.com?subject=Customer%20Support');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'login' }],
        })
      );
    } catch (e) {
      Alert.alert('Error', 'Unable to log out. Please try again.');
    }
  };

  const bg = darkMode ? '#111827' : '#f9fafb';
  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subtext = darkMode ? '#d1d5db' : '#6b7280';
  const border = darkMode ? '#374151' : '#e5e7eb';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>      
      <StatusBar style={darkMode ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.header, { color: text }]}>Settings</Text>

        {/* Preferences */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>          
          <Text style={[styles.cardTitle, { color: text }]}>Preferences</Text>

          <View style={[styles.row, { borderColor: border }]}>            
            <Text style={[styles.optionLabel, { color: text }]}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#8b5cf6' }}
              thumbColor={darkMode ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={[styles.row, { borderColor: border }]}>            
            <Text style={[styles.optionLabel, { color: text }]}>Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#767577', true: '#8b5cf6' }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Account */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>          
          <Text style={[styles.cardTitle, { color: text }]}>Account</Text>

          <TouchableOpacity style={[styles.row, { borderColor: border }]}>
            <Text style={[styles.linkLabel, { color: '#2563eb' }]}>Change Password</Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, { borderColor: border }]}
            onPress={handleCustomerService}
          >
            <Text style={[styles.linkLabel, { color: '#2563eb' }]}>Customer Service</Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>          
          <Text style={[styles.cardTitle, { color: text }]}>About</Text>

          <View style={[styles.row, { borderColor: border }]}>            
            <Text style={[styles.optionLabel, { color: text }]}>App Version</Text>
            <Text style={[styles.valueLabel, { color: subtext }]}>
              1.0.0
            </Text>
          </View>

          <TouchableOpacity style={[styles.row, { borderColor: border }]} onPress={() => router.push('/terms')}>
            <Text style={[styles.linkLabel, { color: '#2563eb' }]}>Terms of Service</Text>
            <Text style={[styles.arrow, { color: subtext }]}>&gt;</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: border, backgroundColor: cardBg }]}
          onPress={handleLogout}
        >
          <Text style={[styles.logoutText, { color: '#ef4444' }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16 },

  header: { fontSize: 28, fontWeight: '700', marginBottom: 24 },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionLabel: { fontSize: 16 },
  linkLabel: { fontSize: 16 },
  arrow: { fontSize: 16 },
  valueLabel: { fontSize: 16 },

  logoutBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
