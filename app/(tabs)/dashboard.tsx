// app/(tabs)/dashboard.tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Dashboard() {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>Dashboard Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "600" },
});
