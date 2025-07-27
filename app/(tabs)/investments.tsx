// app/(tabs)/investments.tsx
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

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
  const { darkMode } = useTheme();
  const [scope, setScope] = useState<"Local" | "International">("Local");
  const [searchQuery, setSearchQuery] = useState("");
  const watchlist = (scope === "Local" ? LOCAL_STOCKS : INTERNATIONAL_STOCKS).filter(
    (stk) =>
      stk.symbol.includes(searchQuery.toUpperCase()) ||
      stk.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Theme colors
  const bg = darkMode ? "#111827" : "#f0f9ff";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const primary = "#8b5cf6";
  const border = darkMode ? "#374151" : "#d1d5db";

  const renderHeader = () => (
    <>
      <Text style={[styles.header, { color: text }]}>Stock Tracking</Text>
      <Text style={[styles.subheader, { color: subtext }]}>
        Monitor your favorite stocks
      </Text>

      {/* Market Scope Toggle */}
      <View style={[styles.toggleContainer, { borderColor: border }]}>
        {(["Local", "International"] as const).map((label) => {
          const active = label === scope;
          return (
            <TouchableOpacity
              key={label}
              style={[
                styles.toggleButton,
                { backgroundColor: active ? primary : cardBg },
              ]}
              onPress={() => setScope(label)}
            >
              <Text
                style={[
                  styles.toggleText,
                  { color: active ? "#fff" : text },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search Stocks */}
      <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
        <Text style={[styles.cardTitle, { color: text }]}>Search Stocks</Text>
        <View style={[styles.searchBox, { backgroundColor: bg, borderColor: border }]}>
          <TextInput
            style={[styles.searchInput, { color: text }]}
            placeholder="Search for stocks..."
            placeholderTextColor={subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
    </>
  );

  const renderItem = ({ item: stk }: { item: Stock }) => {
    const up = stk.changePercent >= 0;
    return (
      <View
        style={[styles.stockRow, { borderColor: border }]}
        key={stk.symbol}
      >
        <View>
          <Text style={[styles.symbol, { color: text }]}>{stk.symbol}</Text>
          <Text style={[styles.company, { color: subtext }]}>{stk.name}</Text>
        </View>
        <View style={styles.priceBlock}>
          <Text style={[styles.price, { color: text }]}>
            ${stk.price.toFixed(2)}
          </Text>
          <Text style={[styles.change, { color: up ? "#16a34a" : "#dc2626" }]}>
            {up ? "↑" : "↓"} {Math.abs(stk.changePercent).toFixed(2)}%
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.removeButton, { borderColor: border }]}
        >
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <FlatList
        data={watchlist}
        keyExtractor={(stk) => stk.symbol}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width - 32;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  searchBox: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  searchInput: {
    fontSize: 16,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: ITEM_WIDTH,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  symbol: {
    fontSize: 16,
    fontWeight: "600",
  },
  company: {
    fontSize: 14,
  },
  priceBlock: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
  },
  change: {
    fontSize: 14,
    marginTop: 4,
  },
  removeButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  removeText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 12,
  },
});
