// app/(tabs)/_layout.tsx
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#ddd",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ color, size, focused }) => {
          let name: React.ComponentProps<typeof Ionicons>["name"] = "ellipse";
          if (route.name === "dashboard") {
            name = focused ? "home" : "home-outline";
          } else if (route.name === "savings") {
            name = focused ? "wallet" : "wallet-outline";
          } else if (route.name === "investments") {
            name = focused ? "trending-up" : "trending-up-outline";
          } else if (route.name === "faq") {
            name = focused ? "help-circle" : "help-circle-outline";
          }
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="dashboard"
        options={{ title: "Dashboard" }}
      />
      <Tabs.Screen
        name="savings"
        options={{ title: "Savings" }}
      />
      <Tabs.Screen
        name="investments"
        options={{ title: "Investments" }}
      />
      <Tabs.Screen
        name="faq"
        options={{ title: "FAQ" }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#9440dd",
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 5,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
});
