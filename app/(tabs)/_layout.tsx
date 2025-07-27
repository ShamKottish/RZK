// app/(tabs)/_layout.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#ddd',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, size, focused }) => {
          let name: React.ComponentProps<typeof Ionicons>['name'] = 'ellipse';
          switch (route.name) {
            case 'dashboard':
              name = focused ? 'home' : 'home-outline';
              break;
            case 'savings':
              name = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'investments':
              name = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'faq':
              name = focused ? 'help-circle' : 'help-circle-outline';
              break;
            case 'settings':
              name = focused ? 'settings' : 'settings-outline';
              break;
          }
          // cast to any so TS won’t complain about missing names
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="savings" options={{ title: 'Savings' }} />
      <Tabs.Screen name="investments" options={{ title: 'Investments' }} />
      <Tabs.Screen name="faq" options={{ title: 'FAQ' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#9440dd',
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 5,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
});
