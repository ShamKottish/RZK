import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";

export default function TabLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("token").then(token => {
      setIsLoggedIn(!!token);
    });
  }, []);

  if (isLoggedIn === null) {
    // Loading (optional: show a spinner)
    return null;
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      {/* Your tab screens */}
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="investments" options={{ title: "Investments" }} />
      <Tabs.Screen name="savings" options={{ title: "Savings" }} />
    </Tabs>
  );
}
