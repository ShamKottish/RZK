// app/(tabs)/dashboard.tsx
import { TranslationKey, useI18n } from "@/app/lib/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState, type ComponentProps } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

const RiyalIcon = () => (
  <Image
    source={require("@/assets/images/riyal.png")}
    style={{ width: 16, height: 16, marginRight: 4 }}
    resizeMode="contain"
  />
);

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface BadgeDef {
  id: string;
  titleKey: TranslationKey;
  icon: IconName;
  color: string;
  threshold: number;
}

const BADGE_DEFS: BadgeDef[] = [
  {
    id: "bronze",
    titleKey: "bronzeSaver",
    icon: "medal-outline",
    color: "#cd7f32",
    threshold: 0.25,
  },
  {
    id: "silver",
    titleKey: "silverSaver",
    icon: "medal-outline",
    color: "#c0c0c0",
    threshold: 0.5,
  },
  {
    id: "gold",
    titleKey: "goldSaver",
    icon: "trophy-outline",
    color: "#ffd700",
    threshold: 0.75,
  },
  {
    id: "platinum",
    titleKey: "platinumSaver",
    icon: "star-outline",
    color: "#e5e4e2",
    threshold: 1.0,
  },
];

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
        <Text style={[styles.cardTitle, { color: text }]}>
          {/* you could also use t("totalSavingsTitle") if passed in */}
          Total Savings
        </Text>
        <Ionicons name="wallet-outline" size={20} color={subtext} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <RiyalIcon />
        <Text style={[styles.amount, { color: text }]}>
          {total.toLocaleString()}
        </Text>
      </View>
      <Text style={[styles.meta, { color: subtext }]}>
        {completed} of {count} goals completed
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

function EarnedBadgesSection({ badges }: { badges: BadgeDef[] }) {
  const { darkMode } = useTheme();
  const text = darkMode ? "#f9fafb" : "#111827";
  const { t } = useI18n();

  if (!badges.length) return null;

  return (
    <View style={{ marginVertical: 16 }}>
      <Text style={[styles.sectionTitle, { color: text }]}>
        {t("earnedBadges")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 16 }}
      >
        {badges.map((b) => (
          <View
            key={b.id}
            style={[
              styles.card,
              {
                width: 100,
                marginRight: 12,
                alignItems: "center",
                backgroundColor: `${b.color}22`,
                borderColor: b.color,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={b.icon}
              size={36}
              color={b.color}
              style={{ marginBottom: 8 }}
            />
            <Text
              numberOfLines={2}
              style={{ color: text, fontSize: 12, textAlign: "center" }}
            >
              {t(b.titleKey)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

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
  const { t } = useI18n();

  const daysLeft = (iso: string) => {
    const diff = Math.ceil(
      (new Date(iso).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : 0;
  };

  if (!goals.length) {
    return (
      <View style={[styles.card, { backgroundColor: bg, borderColor: border }]}>
        <Text style={[styles.meta, { color: subtext }]}>
          {t("noActiveGoals")}
        </Text>
      </View>
    );
  }

  return (
    <>
      {goals.map((g, i) => {
        const dl = daysLeft(g.deadline);
        return (
          <View
            key={i}
            style={[styles.card, { backgroundColor: bg, borderColor: border }]}
          >
            <Text style={[styles.cardTitle, { color: text }]}>{g.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <RiyalIcon />
              <Text style={[styles.meta, { color: subtext }]}>
                {g.saved.toLocaleString()} / {g.target.toLocaleString()}
              </Text>
            </View>
            <Text style={[styles.meta, { color: subtext }]}>
              {dl} {dl === 1 ? ("day") : ("days")} {t("left")}
            </Text>
          </View>
        );
      })}
    </>
  );
}

export default function Dashboard() {
  const { darkMode } = useTheme();
  const { t } = useI18n();

  const bg = darkMode ? "#111827" : "#f9fafb";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const text = darkMode ? "#f9fafb" : "#111827";
  const border = darkMode ? "#374151" : "#e5e7eb";

  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [totalSavings, setTotalSavings] = useState(0);
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const [activeGoals, setActiveGoals] = useState<
    { name: string; saved: number; target: number; deadline: string }[]
  >([]);
  const [earnedBadges, setEarnedBadges] = useState<BadgeDef[]>([]);

  const mock = [
    {
      name: "Vacation",
      saved: 300,
      target: 1000,
      deadline: "2025-12-31",
    },
    {
      name: "Emergency Fund",
      saved: 1000,
      target: 1000,
      deadline: "2025-10-01",
    },
    {
      name: "New Laptop",
      saved: 750,
      target: 1500,
      deadline: "2026-01-15",
    },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const name = await AsyncStorage.getItem("userName");
        if (name) setUserName(name);

        const email = await AsyncStorage.getItem("userEmail");
        if (email) setUserEmail(email);

        const res = await fetch(
          "http://192.168.100.223:8000/savings/goals"
        );
        const goals = await res.json();

        setActiveGoals(goals);
        setTotalSavings(
          goals.reduce((sum: number, g: any) => sum + g.current_amount, 0)
        );
        setGoalsCount(goals.length);
        setGoalsCompleted(
          goals.filter((g: any) => g.current_amount >= g.target_amount).length
        );

        const ebFromGoals = BADGE_DEFS.filter((b) =>
          goals.some(
            (g: any) =>
              g.current_amount / g.target_amount >= b.threshold
          )
        );
        setEarnedBadges(ebFromGoals);
      } catch (err) {
        console.error("Fetch error:", err);

        if (Array.isArray(mock)) {
          const ebMock = BADGE_DEFS.filter((b) =>
            mock.some((g: any) => g.saved / g.target >= b.threshold)
          );
          setEarnedBadges(ebMock);
        }
      }
    };

    load();
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={[
            styles.profileCard,
            { backgroundColor: bg, borderColor: border },
          ]}
          onPress={() => router.push("/profile")}
        >
          <Ionicons
            name="person-circle-outline"
            size={40}
            color={subtext}
          />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.profileName, { color: text }]}>
              {userName || t("yourNamePlaceholder")}
            </Text>
            <Text style={[styles.profileEmail, { color: subtext }]}>
              {userEmail || t("yourEmailPlaceholder")}
            </Text>
          </View>
        </TouchableOpacity>

        <Text style={[styles.header, { color: text }]}>
          {t("financialDashboard")}
        </Text>
        <Text style={[styles.subheader, { color: subtext }]}>
          {t("financialDashboardSubtitle")}
        </Text>

        <TotalSavingsCard
          total={totalSavings}
          completed={goalsCompleted}
          count={goalsCount}
        />

        <EarnedBadgesSection badges={earnedBadges} />

        <Text style={[styles.sectionTitle, { color: text }]}>
          {t("activeSavingsGoals")}
        </Text>
        <ActiveGoalsList goals={activeGoals} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },
  profileCard: {
    width: CARD_WIDTH,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  profileName: { fontSize: 18, fontWeight: "600" },
  profileEmail: { fontSize: 14 },

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
