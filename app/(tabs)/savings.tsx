// app/(tabs)/savings.tsx
import { TranslationKey, useI18n } from "@/app/lib/i18n";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export interface Goal {
  name: string;
  target: number;
  date: string; // ISO string
  monthlyNeeded: number;
  saved: number;
}

export interface Transaction {
  goal: string;
  type: "Add" | "Withdraw";
  amount: number;
  date: string; // ISO string
}

const BADGES = [
  { id: "bronze", titleKey: "bronzeSaver" as TranslationKey, threshold: 0.25 },
  { id: "silver", titleKey: "silverSaver" as TranslationKey, threshold: 0.5 },
  { id: "gold", titleKey: "goldSaver" as TranslationKey, threshold: 0.75 },
  { id: "platinum", titleKey: "platinumSaver" as TranslationKey, threshold: 1.0 },
];

const STORAGE_GOALS = "savings_goals";
const STORAGE_TRANSACTIONS = "savings_transactions";
const STORAGE_BADGES = "savings_shownBadges";

const parseNum = (s: string) => {
  const cleaned = s.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned);
};

const monthsBetween = (from: Date, to: Date) => {
  const msPerMonth = 1000 * 60 * 60 * 24 * 30;
  return Math.ceil((to.getTime() - from.getTime()) / msPerMonth);
};

const computeTimeLeft = (target: Date) => {
  const now = new Date();
  if (target <= now) return "0 d";
  const diffDaysTotal = Math.ceil(
    (target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const months = Math.floor(diffDaysTotal / 30);
  const days = diffDaysTotal % 30;
  return months > 0
    ? `${months} mo ${days} d`
    : `${diffDaysTotal} d`;
};

const earnedBadges = (g: Goal) => {
  const pct = g.saved / g.target;
  return BADGES.filter((b) => pct >= b.threshold).map((b) => b.id);
};

// Risk tolerance support
type RiskToleranceLevel = "Conservative" | "Moderate" | "High Risk";
const deltaMap: Record<RiskToleranceLevel, number> = {
  Conservative: 0.015,
  Moderate: 0.025,
  "High Risk": 0.06,
};

export default function Savings() {
  const { darkMode } = useTheme();
  const router = useRouter();
  const { t } = useI18n();

  const colors = {
    bg: darkMode ? "#111827" : "#f9fafb",
    cardBg: darkMode ? "#1f2937" : "#ffffff",
    text: darkMode ? "#f9fafb" : "#111827",
    subtext: darkMode ? "#d1d5db" : "#6b7280",
    border: darkMode ? "#374151" : "#e5e7eb",
    primary: "#8b5cf6",
  };

  // Calculator state
  const [activeTab, setActiveTab] = useState<"calc1" | "calc2">("calc1"); // now: calc1 = income-based, calc2 = target-based
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [incomeReturn, setIncomeReturn] = useState("");
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [monthlyNeed, setMonthlyNeed] = useState<number | null>(null); // target-based
  const [finalProjection, setFinalProjection] = useState<number | null>(null); // income-based

  const [showTrackPrompt, setShowTrackPrompt] = useState(false);
  const [lastCalcType, setLastCalcType] = useState<"calc1" | "calc2" | null>(null);

  // Risk tolerance selection
  const [riskTolerance, setRiskTolerance] = useState<RiskToleranceLevel>("Moderate");

  // Tracker state
  const [goals, setGoals] = useState<Goal[]>([]);
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shownBadges, setShownBadges] = useState<Record<string, string[]>>({});
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const toggleGoal = (name: string) =>
    setExpandedGoal((prev) => (prev === name ? null : name));

  // Load persisted data
  useEffect(() => {
    (async () => {
      try {
        const [gs, ts, sb] = await Promise.all([
          AsyncStorage.getItem(STORAGE_GOALS),
          AsyncStorage.getItem(STORAGE_TRANSACTIONS),
          AsyncStorage.getItem(STORAGE_BADGES),
        ]);
        if (gs) setGoals(JSON.parse(gs));
        if (ts) setTransactions(JSON.parse(ts));
        if (sb) setShownBadges(JSON.parse(sb));
      } catch (e) {
        console.warn("load error", e);
      }
    })();
  }, []);

  // Persist
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_GOALS, JSON.stringify(goals)).catch(() => {});
  }, [goals]);
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_TRANSACTIONS,
      JSON.stringify(transactions)
    ).catch(() => {});
  }, [transactions]);
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_BADGES, JSON.stringify(shownBadges)).catch(
      () => {}
    );
  }, [shownBadges]);

  // Badge alerts
  useEffect(() => {
    goals.forEach((g) => {
      const earned = earnedBadges(g);
      const shown = shownBadges[g.name] || [];
      const newBadges = earned.filter((b) => !shown.includes(b));
      if (newBadges.length > 0) {
        const badgeId = newBadges[0];
        const def = BADGES.find((b) => b.id === badgeId)!;
        Alert.alert(
          t("congratulationsTitle", { default: "🎉 Congratulations!" }),
          t("earnedBadgeOnGoal", {
            name: g.name,
            badge: t(def.titleKey),
          }),
          [
            { text: t("ok", { default: "OK" }), style: "cancel" },
            {
              text: t("view", { default: "View" }),
              onPress: () => router.push("/dashboard"),
            },
          ]
        );
        setShownBadges((prev) => ({
          ...prev,
          [g.name]: [...(prev[g.name] || []), ...newBadges],
        }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goals]);

  // Calculations
  const calculateMonthlyNeed = () => {
    if (!goalName || !targetAmount || !targetDate) {
      Alert.alert(t("completeGoalNameAmountAndDate"));
      return;
    }
    const target = parseNum(targetAmount);
    if (isNaN(target) || target <= 0) {
      Alert.alert(t("enterValidTargetAmount"));
      return;
    }
    const now = new Date();
    if (!targetDate || targetDate <= now) {
      Alert.alert(t("pickAFutureDate"));
      return;
    }
    const n = monthsBetween(now, targetDate);
    if (n <= 0) {
      Alert.alert(t("targetDateMustBeInFuture"));
      return;
    }
    const r = parseNum(incomeReturn || "0") / 100;
    let monthly = target / n;
    if (r > 0) {
      const mRate = r / 12;
      monthly = (target * mRate) / (Math.pow(1 + mRate, n) - 1);
    }
    setMonthlyNeed(parseFloat(monthly.toFixed(2)));
    setFinalProjection(null);
    setLastCalcType("calc2"); // now target-based is calc2
    setShowTrackPrompt(true);
  };

  const calculateFinalProjection = () => {
    if (!goalName || !monthlyIncome || !targetDate) {
      Alert.alert(t("completeGoalNameSavingAmountAndDate"));
      return;
    }
    const monthly = parseNum(monthlyIncome);
    if (isNaN(monthly) || monthly <= 0) {
      Alert.alert(t("enterValidMonthlyAmount"));
      return;
    }
    const now = new Date();
    if (!targetDate || targetDate <= now) {
      Alert.alert(t("pickAFutureDate"));
      return;
    }
    const n = monthsBetween(now, targetDate);
    if (n <= 0) {
      Alert.alert(t("targetDateMustBeInFuture"));
      return;
    }
    const r = parseNum(incomeReturn || "0") / 100;
    let future = monthly * n;
    if (r > 0) {
      const mRate = r / 12;
      future = monthly * ((Math.pow(1 + mRate, n) - 1) / mRate);
    }
    setFinalProjection(parseFloat(future.toFixed(2)));
    setMonthlyNeed(null);
    setLastCalcType("calc1"); // income-based is calc1
    setShowTrackPrompt(true);
  };

  // Risk-adjusted ranges
  const delta = deltaMap[riskTolerance];
  const monthlyNeedRange =
    monthlyNeed !== null
      ? {
          min: parseFloat((monthlyNeed * (1 - delta)).toFixed(2)),
          max: parseFloat((monthlyNeed * (1 + delta)).toFixed(2)),
        }
      : null;

  const finalProjectionRange =
    finalProjection !== null
      ? {
          min: parseFloat((finalProjection * (1 - delta)).toFixed(2)),
          max: parseFloat((finalProjection * (1 + delta)).toFixed(2)),
        }
      : null;

  // Tracking
  const handleTrackYes = () => {
    if (!lastCalcType) return;
    if (!goalName) {
      Alert.alert(t("goalNeedsAName"));
      return;
    }
    if (!targetDate || targetDate <= new Date()) {
      Alert.alert(t("targetDateMustBeInFuture"));
      return;
    }
    if (goals.some((g) => g.name === goalName)) {
      Alert.alert(t("duplicateGoalName"));
      setShowTrackPrompt(false);
      return;
    }

    if (lastCalcType === "calc1" && finalProjection !== null) {
      // income-based goal
      const monthly = parseNum(monthlyIncome);
      if (isNaN(monthly) || monthly <= 0) return;
      setGoals((g) => [
        {
          name: goalName,
          target: finalProjection,
          date: targetDate.toISOString(),
          monthlyNeeded: monthly,
          saved: 0,
        },
        ...g,
      ]);
    } else if (lastCalcType === "calc2" && monthlyNeed !== null) {
      // target-based goal
      const target = parseNum(targetAmount);
      if (isNaN(target) || target <= 0) return;
      setGoals((g) => [
        {
          name: goalName,
          target,
          date: targetDate.toISOString(),
          monthlyNeeded: monthlyNeed,
          saved: 0,
        },
        ...g,
      ]);
    }
    setShowTrackPrompt(false);
  };

  const handleTrackNo = () => setShowTrackPrompt(false);

  const resetCalculator = () => {
    setGoalName("");
    setTargetAmount("");
    setMonthlyIncome("");
    setIncomeReturn("");
    setTargetDate(null);
    setMonthlyNeed(null);
    setFinalProjection(null);
    setShowTrackPrompt(false);
    setLastCalcType(null);
  };

  const addToGoal = (i: number) => {
    const amt = parseNum(amounts[i] || "");
    if (!amt) return;
    setGoals((gs) =>
      gs.map((g, idx) => (idx === i ? { ...g, saved: g.saved + amt } : g))
    );
    setAmounts((a) => ({ ...a, [i]: "" }));
    setTransactions((ts) => [
      {
        goal: goals[i].name,
        type: "Add",
        amount: amt,
        date: new Date().toISOString(),
      },
      ...ts,
    ]);
  };

  const withdrawFromGoal = (i: number) => {
    const amt = parseNum(amounts[i] || "");
    if (!amt) return;
    setGoals((gs) =>
      gs.map((g, idx) =>
        idx === i ? { ...g, saved: Math.max(0, g.saved - amt) } : g
      )
    );
    setAmounts((a) => ({ ...a, [i]: "" }));
    setTransactions((ts) => [
      {
        goal: goals[i].name,
        type: "Withdraw",
        amount: amt,
        date: new Date().toISOString(),
      },
      ...ts,
    ]);
  };

  const deleteGoal = (name: string) => {
    Alert.alert(
      t("deleteGoalTitle"),
      t("deleteGoalConfirmMessage", { name }),
      [
        { text: t("cancel"), style: "cancel" },
        {
          text: t("delete"),
          style: "destructive",
          onPress: () => {
            setGoals((g) => g.filter((gg) => gg.name !== name));
            setTransactions((t) => t.filter((tx) => tx.goal !== name));
            setShownBadges((sb) => {
              const copy = { ...sb };
              delete copy[name];
              return copy;
            });
            if (expandedGoal === name) setExpandedGoal(null);
          },
        },
      ]
    );
  };

  const formatCurrency = (n: number) =>
    `﷼${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.bg }]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={[styles.sectionTitle, { color: colors.text, marginBottom: 8 }]}
          >
            {t("savingsGoal")}
          </Text>

          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                activeTab === "calc1" && styles.toggleBtnActive,
              ]}
              onPress={() => {
                setActiveTab("calc1");
                resetCalculator();
              }}
            >
              <Text
                style={[
                  styles.toggleTxt,
                  activeTab === "calc1" && styles.toggleTxtActive,
                ]}
              >
                {t("incomeBased")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                activeTab === "calc2" && styles.toggleBtnActive,
              ]}
              onPress={() => {
                setActiveTab("calc2");
                resetCalculator();
              }}
            >
              <Text
                style={[
                  styles.toggleTxt,
                  activeTab === "calc2" && styles.toggleTxtActive,
                ]}
              >
                {t("targetBased")}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[styles.sectionTitle, { color: colors.text, marginTop: 0 }]}
            >
              {t("savingsGoal")}
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, borderColor: colors.subtext },
              ]}
              placeholder={t("goalNamePlaceholder")}
              placeholderTextColor={colors.subtext}
              value={goalName}
              onChangeText={setGoalName}
            />

            {activeTab === "calc1" && (
              <>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text, marginTop: 0 },
                  ]}
                >
                  {t("incomeBasedCalculator")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.subtext },
                  ]}
                  placeholder={t("monthlySavingPlaceholder", {
                    default: "Monthly saving",
                  })}
                  placeholderTextColor={colors.subtext}
                  keyboardType="numeric"
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.subtext },
                  ]}
                  placeholder={t("expectedAnnualReturnPlaceholder")}
                  placeholderTextColor={colors.subtext}
                  keyboardType="numeric"
                  value={incomeReturn}
                  onChangeText={setIncomeReturn}
                />

                <Text style={[styles.questionText, { color: colors.text }]}>
                  {t("riskTolerance", { default: "Risk Tolerance" })}
                </Text>
                <View style={styles.toggleRow}>
                  {(["Conservative", "Moderate", "High Risk"] as const).map(
                    (level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.toggleBtn,
                          riskTolerance === level && styles.toggleBtnActive,
                        ]}
                        onPress={() => setRiskTolerance(level)}
                      >
                        <Text
                          style={[
                            styles.toggleTxt,
                            riskTolerance === level && styles.toggleTxtActive,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                <Text style={[styles.questionText, { color: colors.text }]}>
                  {t("targetDateLabel")}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.input,
                    {
                      justifyContent: "center",
                      borderColor: colors.subtext,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: targetDate ? colors.text : colors.subtext,
                    }}
                  >
                    {targetDate
                      ? targetDate.toLocaleDateString("en-US")
                      : t("selectDate")}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={targetDate || new Date()}
                    mode="date"
                    minimumDate={new Date()}
                    display={
                      Platform.OS === "android" ? "calendar" : "inline"
                    }
                    locale="en-US"
                    themeVariant={darkMode ? "dark" : "light"}
                    textColor={colors.text}
                    onChange={(_, d) => {
                      setShowDatePicker(false);
                      if (d) setTargetDate(d);
                    }}
                  />
                )}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={calculateFinalProjection}
                >
                  <Text style={styles.buttonText}>
                    {t("calculateFinalAmount")}
                  </Text>
                </TouchableOpacity>
                {finalProjection !== null && (
                  <>
                    <Text
                      style={[
                        styles.subheader,
                        {
                          color: colors.text,
                          marginTop: 12,
                        },
                      ]}
                    >
                      {t("finalSavings", {
                        amount: formatCurrency(finalProjection),
                      })}
                    </Text>
                    {finalProjectionRange && (
                      <Text
                        style={[
                          styles.subheader,
                          { color: colors.text, marginTop: 4 },
                        ]}
                      >
                        {`Risk-adjusted range: ${formatCurrency(
                          finalProjectionRange.min
                        )} – ${formatCurrency(
                          finalProjectionRange.max
                        )}`}
                      </Text>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "calc2" && (
              <>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text, marginTop: 0 },
                  ]}
                >
                  {t("targetBasedCalculator")}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.subtext },
                  ]}
                  placeholder={t("targetAmountPlaceholder")}
                  placeholderTextColor={colors.subtext}
                  keyboardType="numeric"
                  value={targetAmount}
                  onChangeText={setTargetAmount}
                />
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, borderColor: colors.subtext },
                  ]}
                  placeholder={t("expectedAnnualReturnPlaceholder")}
                  placeholderTextColor={colors.subtext}
                  keyboardType="numeric"
                  value={incomeReturn}
                  onChangeText={setIncomeReturn}
                />

                <Text style={[styles.questionText, { color: colors.text }]}>
                  {t("riskTolerance", { default: "Risk Tolerance" })}
                </Text>
                <View style={styles.toggleRow}>
                  {(["Conservative", "Moderate", "High Risk"] as const).map(
                    (level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.toggleBtn,
                          riskTolerance === level && styles.toggleBtnActive,
                        ]}
                        onPress={() => setRiskTolerance(level)}
                      >
                        <Text
                          style={[
                            styles.toggleTxt,
                            riskTolerance === level && styles.toggleTxtActive,
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>

                <Text style={[styles.questionText, { color: colors.text }]}>
                  {t("targetDateLabel")}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[
                    styles.input,
                    {
                      justifyContent: "center",
                      borderColor: colors.subtext,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: targetDate ? colors.text : colors.subtext,
                    }}
                  >
                    {targetDate
                      ? targetDate.toLocaleDateString("en-US")
                      : t("selectDate")}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={targetDate || new Date()}
                    mode="date"
                    minimumDate={new Date()}
                    display={
                      Platform.OS === "android" ? "calendar" : "inline"
                    }
                    locale="en-US"
                    themeVariant={darkMode ? "dark" : "light"}
                    textColor={colors.text}
                    onChange={(_, d) => {
                      setShowDatePicker(false);
                      if (d) setTargetDate(d);
                    }}
                  />
                )}
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={calculateMonthlyNeed}
                >
                  <Text style={styles.buttonText}>
                    {t("calculateMonthlySaving")}
                  </Text>
                </TouchableOpacity>
                {monthlyNeed !== null && (
                  <>
                    <Text
                      style={[
                        styles.subheader,
                        {
                          color: colors.text,
                          marginTop: 12,
                        },
                      ]}
                    >
                      {t("youNeedToSave", {
                        amount: formatCurrency(monthlyNeed),
                      })}
                    </Text>
                    {monthlyNeedRange && (
                      <Text
                        style={[
                          styles.subheader,
                          { color: colors.text, marginTop: 4 },
                        ]}
                      >
                        {`Risk-adjusted range: ${formatCurrency(
                          monthlyNeedRange.min
                        )} – ${formatCurrency(
                          monthlyNeedRange.max
                        )}`}
                      </Text>
                    )}
                  </>
                )}
              </>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#9ca3af", marginTop: 8 }]}
              onPress={resetCalculator}
            >
              <Text style={styles.buttonText}>{t("reset")}</Text>
            </TouchableOpacity>
          </View>

          {showTrackPrompt && (
            <View style={{ marginBottom: 16 }}>
              <Text style={[styles.subheader, { color: colors.text }]}>
                {t("trackThisSavingsGoalPrompt")}
              </Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.toggleBtn, styles.toggleBtnActive]}
                  onPress={handleTrackYes}
                >
                  <Text
                    style={[styles.toggleTxt, styles.toggleTxtActive]}
                  >
                    {t("yes")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toggleBtn}
                  onPress={handleTrackNo}
                >
                  <Text style={styles.toggleTxt}>{t("no")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {goals.map((g, i) => {
            const isOpen = expandedGoal === g.name;
            const ownTx = transactions.filter((t) => t.goal === g.name);
            const pct = Math.min(g.saved / g.target, 1);
            const badges = earnedBadges(g);

            return (
              <View key={g.name} style={{ marginBottom: 16 }}>
                <TouchableOpacity
                  style={[
                    styles.collapsibleHeader,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => toggleGoal(g.name)}
                >
                  <View>
                    <Text
                      style={[styles.goalName, { color: colors.text }]}
                    >
                      {g.name}
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: colors.subtext }}
                    >
                      {t("timeLeftPrefix")} {computeTimeLeft(new Date(g.date))}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <TouchableOpacity onPress={() => deleteGoal(g.name)}>
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={20}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                    {g.saved >= g.target && (
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={20}
                        color="#22c55e"
                        style={{ marginRight: 6 }}
                      />
                    )}
                    <Text
                      style={[styles.toggleIcon, { color: colors.text }]}
                    >
                      {isOpen ? "−" : "+"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {isOpen && (
                  <View
                    style={[
                      styles.card,
                      {
                        backgroundColor: colors.cardBg,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.subheader, { color: colors.text }]}
                    >
                      {t("targetLabel")}: {formatCurrency(g.target)}
                    </Text>
                    <Text
                      style={[styles.subheader, { color: colors.text }]}
                    >
                      {t("dueByLabel")}:{" "}
                      {new Date(g.date).toLocaleDateString("en-US")}
                    </Text>
                    <Text
                      style={[styles.subheader, { color: colors.text }]}
                    >
                      {t("savedLabel")}: {formatCurrency(g.saved)}
                    </Text>
                    <Text
                      style={[styles.subheader, { color: colors.text }]}
                    >
                      {t("monthlyNeededLabel")}:{" "}
                      {formatCurrency(g.monthlyNeeded)}
                    </Text>

                    <View style={styles.badgeContainer}>
                      {BADGES.map((b) => (
                        <MaterialCommunityIcons
                          key={b.id}
                          name="medal-outline"
                          size={24}
                          color={
                            badges.includes(b.id)
                              ? colors.primary
                              : colors.subtext
                          }
                          style={{ marginRight: 8 }}
                        />
                      ))}
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${pct * 100}%`,
                            backgroundColor: colors.primary,
                          },
                        ]}
                      />
                    </View>

                    {g.saved < g.target && (
                      <View style={styles.row}>
                        <TextInput
                          style={[
                            styles.input,
                            styles.amountInput,
                            {
                              color: colors.text,
                              borderColor: colors.subtext,
                            },
                          ]}
                          placeholder={t("amountPlaceholder")}
                          placeholderTextColor={colors.subtext}
                          keyboardType="numeric"
                          value={amounts[i] || ""}
                          onChangeText={(t) =>
                            setAmounts((a) => ({ ...a, [i]: t }))
                          }
                        />
                        <TouchableOpacity
                          style={[
                            styles.smallBtn,
                            { backgroundColor: colors.primary },
                          ]}
                          onPress={() => addToGoal(i)}
                        >
                          <Text style={styles.buttonText}>
                            + {t("add")}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.smallBtn,
                            { backgroundColor: "#dc2626" },
                          ]}
                          onPress={() => withdrawFromGoal(i)}
                        >
                          <Text style={styles.buttonText}>
                            – {t("withdraw")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    <Text
                      style={[
                        styles.sectionTitle,
                        {
                          marginTop: 16,
                          color: colors.text,
                        },
                      ]}
                    >
                      {t("transactions")}
                    </Text>
                    {ownTx.length === 0 ? (
                      <Text
                        style={[
                          styles.noTrans,
                          { color: colors.subtext },
                        ]}
                      >
                        {t("noTransactionsYet")}
                      </Text>
                    ) : (
                      <FlatList<Transaction>
                        data={ownTx}
                        keyExtractor={(_, idx) => idx.toString()}
                        nestedScrollEnabled
                        style={{ flexGrow: 0 }}
                        renderItem={({ item }) => (
                          <View style={styles.txRow}>
                            <Text
                              style={[
                                styles.txText,
                                {
                                  color:
                                    item.type === "Add"
                                      ? "#22c55e"
                                      : "#ef4444",
                                },
                              ]}
                            >
                              {item.type} {formatCurrency(item.amount)}
                            </Text>
                            <Text
                              style={[
                                styles.txDate,
                                { color: colors.subtext },
                              ]}
                            >
                              {new Date(item.date).toLocaleDateString(
                                "en-US"
                              )}
                            </Text>
                          </View>
                        )}
                      />
                    )}

                    {g.saved >= g.target && (
                      <Text
                        style={[
                          styles.completedText,
                          { color: colors.text },
                        ]}
                      >
                        {t("completed")}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  subheader: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleRow: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    marginBottom: 14,
  },
  toggleBtn: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  toggleBtnActive: {
    backgroundColor: "#8b5cf6",
  },
  toggleTxt: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  toggleTxtActive: {
    color: "#ffffff",
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: "700",
  },
  collapsibleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
  },
  toggleIcon: {
    fontSize: 18,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  amountInput: {
    flex: 0.4,
    marginRight: 8,
  },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
  },
  completedText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 14,
  },
  noTrans: {
    fontSize: 15,
    fontStyle: "italic",
  },
  txRow: {
    marginBottom: 8,
  },
  txText: {
    fontSize: 14,
  },
  txDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  badgeContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
});
