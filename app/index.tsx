// app/index.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import LoginScreen from "./login";

export default function Index() {
  // Imagine an "isLoggedIn" variable; replace with your logic!
  const isLoggedIn = false; // Replace with real authentication check
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/tabs");
    }
  }, [isLoggedIn]);

  // If not logged in, show login page
  return <LoginScreen />;
}
