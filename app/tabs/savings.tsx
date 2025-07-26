import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SavingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Savings</Text>
      <Text style={styles.subtitle}>Your savings goals will be displayed here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#888" },
});


