// app/(tabs)/dashboard.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

// ——————————————————————————————————————————————
// TotalSavingsCard
// ——————————————————————————————————————————————
function TotalSavingsCard({
  total,
  completed,
  count,
}: {
  total: number;
  completed: number;
  count: number;
}) {
  const { darkMode } = useTheme();
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const text = darkMode ? "#f9fafb" : "#111827";
  const border = darkMode ? "#374151" : "#e5e7eb";
  const bg = darkMode ? "#1f2937" : "#ffffff";

  const pct = count ? Math.round((total / (count * 1000)) * 100) : 0;

  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: text }]}>Total Savings</Text>
        <Ionicons name="wallet-outline" size={20} color={subtext} />
      </View>
      <Text style={[styles.amount, { color: text }]}>﷼{total.toLocaleString()}</Text>
      <Text style={[styles.meta, { color: subtext }]}>
        {completed} of {count} goals completed
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

// ——————————————————————————————————————————————
// WatchlistCard
// ——————————————————————————————————————————————
function WatchlistCard({ count }: { count: number }) {
  const { darkMode } = useTheme();
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const text = darkMode ? "#f9fafb" : "#111827";
  const border = darkMode ? "#374151" : "#e5e7eb";
  const bg = darkMode ? "#1f2937" : "#ffffff";

  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: text }]}>Watchlist</Text>
        <Ionicons name="stats-chart-outline" size={20} color={subtext} />
      </View>
      <Text style={[styles.amount, { color: text }]}>{count} Stocks</Text>
      <Text style={[styles.meta, { color: subtext }]}>
        Tracking your investments
      </Text>
    </View>
  );
}

// ——————————————————————————————————————————————
// ActiveGoalsList
// ——————————————————————————————————————————————
function ActiveGoalsList({
  goals,
}: {
  goals: { name: string; saved: number; target: number; deadline: string }[];
}) {
  const { darkMode } = useTheme();
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const text = darkMode ? "#f9fafb" : "#111827";
  const border = darkMode ? "#374151" : "#e5e7eb";
  const bg = darkMode ? "#1f2937" : "#ffffff";

  const daysLeft = (iso: string) => {
    const diff = Math.ceil(
      (new Date(iso).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  if (!goals.length) {
    return (
      <View style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
        <Text style={[styles.meta, { color: subtext }]}>
          You have no active goals.
        </Text>
      </View>
    );
  }

  return (
    <>
      {goals.map((g, i) => (
        <View
          key={i}
          style={[styles.card, { backgroundColor: bg, borderColor: border }]}
        >
          <Text style={[styles.cardTitle, { color: text }]}>{g.name}</Text>
          <Text style={[styles.meta, { color: subtext }]}>
            ﷼{g.saved.toLocaleString()} / ﷼{g.target.toLocaleString()}
          </Text>
          <Text style={[styles.meta, { color: subtext }]}>
            {daysLeft(g.deadline)} day{daysLeft(g.deadline) !== 1 ? "s" : ""} left
          </Text>
        </View>
      ))}
    </>
  );
}

// ——————————————————————————————————————————————
// Dashboard Screen
// ——————————————————————————————————————————————
export default function Dashboard() {
  const { darkMode } = useTheme();
  const bg = darkMode ? "#111827" : "#f9fafb";

  // placeholder state — swap out for API calls later
  const [totalSavings, setTotalSavings] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [activeGoals, setActiveGoals] = useState<
    { name: string; saved: number; target: number; deadline: string }[]
  >([]);

    const daysLeft = (iso: string) => {
    const diff = Math.ceil(
      (new Date(iso).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  // simulate fetching from API
  useEffect(() => {
    // TODO: replace with real fetch(...)
    const mock = [
      { name: "Car Fund", saved: 12000, target: 20000, deadline: "2025-12-31" },
      { name: "Vacation", saved: 3000, target: 5000, deadline: "2025-08-15" },
    ];
    setActiveGoals(mock);
    setTotalSavings(mock.reduce((s, g) => s + g.saved, 0));
    setGoalsCount(mock.length);
    setGoalsCompleted(mock.filter((g) => g.saved >= g.target).length);
    setWatchlistCount(4);
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: darkMode ? "#f9fafb" : "#111827" }]}>
          Financial Dashboard
        </Text>
        <Text
          style={[
            styles.subheader,
            { color: darkMode ? "#d1d5db" : "#6b7280" },
          ]}
        >
          Your financial health at a glance
        </Text>

        <TotalSavingsCard
          total={totalSavings}
          completed={goalsCompleted}
          count={goalsCount}
        />

        <WatchlistCard count={watchlistCount} />

        <Text
          style={[
            styles.sectionTitle,
            { color: darkMode ? "#f9fafb" : "#111827" },
          ]}
        >
          Active Savings Goals
        </Text>
        <ActiveGoalsList goals={activeGoals} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  header: { fontSize: 28, fontWeight: "700", marginBottom: 4 },
  subheader: { fontSize: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginVertical: 12 },

  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  amount: { fontSize: 32, fontWeight: "700", marginBottom: 4 },
  meta: { fontSize: 14, marginBottom: 4 },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#8b5cf6" },
});
