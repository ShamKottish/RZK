// app/(tabs)/investments.tsx
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

const LOCAL_STOCKS: Stock[] = [
  { symbol: "AMZN", name: "Amazon.com Inc", price: 231.44, changePercent: -0.34 },
];
const INTERNATIONAL_STOCKS: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc", price: 213.88, changePercent: 0.06 },
];

export default function Investments() {
  const [scope, setScope] = useState<"Local" | "International">("Local");
  const [searchQuery, setSearchQuery] = useState("");
  const watchlist = scope === "Local" ? LOCAL_STOCKS : INTERNATIONAL_STOCKS;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator
    >
      <Text style={styles.header}>Stock Tracking</Text>
      <Text style={styles.subheader}>Monitor your favorite stocks</Text>

      {/* Market Scope Toggle */}
      <View style={styles.toggleContainer}>
        {["Local", "International"].map((label) => {
          const active = label === scope;
          return (
            <TouchableOpacity
              key={label}
              style={[
                styles.toggleButton,
                active && styles.toggleButtonActive,
              ]}
              onPress={() => setScope(label as "Local" | "International")}
            >
              <Text
                style={[
                  styles.toggleText,
                  active && styles.toggleTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Stocks */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Search Stocks</Text>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for stocks..."
            placeholderTextColor="#6b7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Your Watchlist */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Watchlist</Text>
        {watchlist.map((stk) => {
          const up = stk.changePercent >= 0;
          return (
            <View key={stk.symbol} style={styles.stockRow}>
              <View>
                <Text style={styles.symbol}>{stk.symbol}</Text>
                <Text style={styles.company}>{stk.name}</Text>
              </View>
              <View style={styles.priceBlock}>
                <Text style={styles.price}>${stk.price.toFixed(2)}</Text>
                <Text
                  style={[styles.change, up ? styles.up : styles.down]}
                >
                  {up ? "↑" : "↓"} {Math.abs(stk.changePercent).toFixed(2)}%
                </Text>
              </View>
              <TouchableOpacity style={styles.removeButton}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f0f9ff",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subheader: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  toggleButtonActive: {
    backgroundColor: "#c084fc",
  },
  toggleText: {
    fontSize: 14,
    color: "#6b7280",
  },
  toggleTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  searchBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    color: "#111827",
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  symbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  company: {
    fontSize: 14,
    color: "#6b7280",
  },
  priceBlock: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  change: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  up: { color: "#16a34a" },
  down: { color: "#dc2626" },
  removeButton: {
    backgroundColor: "#ef4444",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
});
