// app/(tabs)/savings.tsx
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

interface Goal {
  name: string;
  target: number;
  date: string;
  timeLeft: string;
  monthlyNeeded: number;
  saved: number;
}

interface Transaction {
  goal: string;
  type: "Add" | "Withdraw";
  amount: number;
  date: Date;
}

export default function Savings() {
  const { darkMode } = useTheme();
  const bg = darkMode ? "#111827" : "#f9fafb";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const border = darkMode ? "#374151" : "#e5e7eb";
  const primary = "#8b5cf6";

  // Projection form state
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [invests, setInvests] = useState<boolean | null>(null);
  const [annualReturn, setAnnualReturn] = useState("");
  const [interestType, setInterestType] = useState<"simple" | "compound">("compound");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [track, setTrack] = useState<boolean | null>(null);

  // Tracking state
  const [goals, setGoals] = useState<Goal[]>([]);
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const parseNum = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ""));

  const calculateProjection = () => {
    if (!name || !target || !date || invests === null || track === null) {
      return Alert.alert("Please complete all fields & questions.");
    }
    const tgt = parseNum(target);
    const now = new Date();
    const then = date!;
    if (isNaN(tgt) || then <= now) {
      return Alert.alert("Enter a valid target & future date.");
    }

    // compute time left
    const diffDays = Math.ceil((then.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    const timeLeft = months > 0 ? `${months} mo ${days} d` : `${diffDays} d`;
    const monthsCount = months + (days > 0 ? 1 : 0);

    // compute monthly needed
    const r = invests ? parseNum(annualReturn) / 100 : 0;
    let monthlyNeeded: number;
    if (r > 0 && interestType === "compound") {
      const mRate = r / 12;
      monthlyNeeded = (tgt * mRate) / (Math.pow(1 + mRate, monthsCount) - 1);
    } else {
      monthlyNeeded = tgt / monthsCount;
    }

    setGoals([
      ...goals,
      {
        name,
        target: tgt,
        date: then.toISOString(),
        timeLeft,
        monthlyNeeded: parseFloat(monthlyNeeded.toFixed(2)),
        saved: 0,
      },
    ]);

    // reset form (keep `track`)
    setName("");
    setTarget("");
    setInvests(null);
    setAnnualReturn("");
    setInterestType("compound");
    setDate(null);
  };

  const addToGoal = (i: number) => {
    const amt = parseNum(amounts[i] || "");
    if (!amt) return;
    const goal = goals[i];
    const updated = { ...goal, saved: goal.saved + amt };
    setGoals(gs => gs.map((g, idx) => (idx === i ? updated : g)));
    setAmounts(a => ({ ...a, [i]: "" }));
    setTransactions(t => [
      { goal: goal.name, type: "Add", amount: amt, date: new Date() },
      ...t,
    ]);
  };

  const withdrawFromGoal = (i: number) => {
    const amt = parseNum(amounts[i] || "");
    if (!amt) return;
    const goal = goals[i];
    const updated = { ...goal, saved: Math.max(0, goal.saved - amt) };
    setGoals(gs => gs.map((g, idx) => (idx === i ? updated : g)));
    setAmounts(a => ({ ...a, [i]: "" }));
    setTransactions(t => [
      { goal: goal.name, type: "Withdraw", amount: amt, date: new Date() },
      ...t,
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: bg, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          {/* Projection Section */}
          <Text style={[styles.sectionTitle, { color: text }]}>Savings Projection</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
            <TextInput
              style={[styles.input, { color: text, borderColor: subtext }]}
              placeholder="Goal Name"
              placeholderTextColor={subtext}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { color: text, borderColor: subtext }]}
              placeholder="Target Amount (﷼)"
              placeholderTextColor={subtext}
              keyboardType="numeric"
              value={target}
              onChangeText={setTarget}
            />

            <Text style={[styles.questionText, { color: text }]}>Do you invest?</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, invests === true && styles.toggleBtnActive]}
                onPress={() => setInvests(true)}
              >
                <Text style={[styles.toggleTxt, invests === true && styles.toggleTxtActive]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, invests === false && styles.toggleBtnActive]}
                onPress={() => setInvests(false)}
              >
                <Text style={[styles.toggleTxt, invests === false && styles.toggleTxtActive]}>No</Text>
              </TouchableOpacity>
            </View>

            {invests && (
              <>
                <TextInput
                  style={[styles.input, { color: text, borderColor: subtext }]}
                  placeholder="Expected Annual Return (%)"
                  placeholderTextColor={subtext}
                  keyboardType="numeric"
                  value={annualReturn}
                  onChangeText={setAnnualReturn}
                />
                <Text style={[styles.questionText, { color: text }]}>Interest Type</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity
                    style={[styles.toggleBtn, interestType === "simple" && styles.toggleBtnActive]}
                    onPress={() => setInterestType("simple")}
                  >
                    <Text style={[styles.toggleTxt, interestType === "simple" && styles.toggleTxtActive]}>Simple</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.toggleBtn, interestType === "compound" && styles.toggleBtnActive]}
                    onPress={() => setInterestType("compound")}
                  >
                    <Text style={[styles.toggleTxt, interestType === "compound" && styles.toggleTxtActive]}>Compound</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <Text style={[styles.questionText, { color: text }]}>Target Date</Text>
<TouchableOpacity
  onPress={() => setShowDatePicker(true)}
  style={[styles.input, { justifyContent: "center", borderColor: subtext }]}
>
  <Text style={{ color: date ? text : subtext }}>
    {date ? date.toLocaleDateString() : "Select Date"}
  </Text>
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={date || new Date()}
    mode="date"
    // ← use calendar UI
    display={Platform.OS === "android" ? "calendar" : "inline"}
    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
      setShowDatePicker(false);
      if (selectedDate) setDate(selectedDate);
    }}
  />
)}

            <Text style={[styles.questionText, { color: text }]}>
              Would you like to track your savings?
            </Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, track === true && styles.toggleBtnActive]}
                onPress={() => setTrack(true)}
              >
                <Text style={[styles.toggleTxt, track === true && styles.toggleTxtActive]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, track === false && styles.toggleBtnActive]}
                onPress={() => setTrack(false)}
              >
                <Text style={[styles.toggleTxt, track === false && styles.toggleTxtActive]}>No</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: primary }]}
              onPress={calculateProjection}
            >
              <Text style={styles.buttonText}>Calculate Projection</Text>
            </TouchableOpacity>
          </View>

          {/* Tracking Section */}
          {track && goals.map((g, idx) => {
            const progress = Math.min(g.saved / g.target, 1);
            return (
              <View
                key={idx}
                style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}
              >
                <Text style={[styles.goalName, { color: text }]}>{g.name}</Text>
                <Text style={[styles.subheader, { color: subtext }]}>Time Left: {g.timeLeft}</Text>
                <Text style={[styles.subheader, { color: subtext }]}>Monthly Needed: ﷼{g.monthlyNeeded.toLocaleString()}</Text>

                {/* target amount on right above bar */}
                <View style={styles.targetContainer}>
                  <Text style={[styles.targetAmount, { color: subtext }]}>
                    ﷼{g.target.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress * 100}%`, backgroundColor: primary },
                    ]}
                  />
                </View>

                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, styles.amountInput, { color: text, borderColor: subtext }]}
                    placeholder="Amount (﷼)"
                    placeholderTextColor={subtext}
                    keyboardType="numeric"
                    value={amounts[idx] || ""}
                    onChangeText={t => setAmounts(a => ({ ...a, [idx]: t }))}
                  />
                  <TouchableOpacity style={[styles.smallBtn, { backgroundColor: primary }]} onPress={() => addToGoal(idx)}>
                    <Text style={styles.buttonText}>+ Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.smallBtn, { backgroundColor: "#dc2626" }]} onPress={() => withdrawFromGoal(idx)}>
                    <Text style={styles.buttonText}>– Withdraw</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {/* Transaction Log */}
          {track && (
            <>
              <Text style={[styles.sectionTitle, { color: text }]}>Transaction Log</Text>
              <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
                {transactions.length === 0 ? (
                  <Text style={[styles.noTrans, { color: subtext }]}>No transactions yet.</Text>
                ) : (
                  <FlatList
                    data={transactions}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item }) => (
                      <View style={styles.txRow}>
                        <Text style={[styles.txText, { color: text }]}>
                          {item.type} ﷼{item.amount} {item.type === "Add" ? "to" : "from"} {item.goal}
                        </Text>
                        <Text style={[styles.txDate, { color: subtext }]}>{item.date.toLocaleDateString()}</Text>
                      </View>
                    )}
                  />
                )}
              </View>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  container: { padding: 16, paddingBottom: 32 },

  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12 },

  card: { borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  questionText: { fontSize: 16, fontWeight: "600", marginBottom: 8 },

  toggleRow: {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    marginBottom: 12,
  },
  toggleBtn: { flex: 1, padding: 12, alignItems: "center" },
  toggleBtnActive: { backgroundColor: "#8b5cf6" },
  toggleTxt: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  toggleTxtActive: { color: "#fff" },

  button: { paddingVertical: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  header: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  subheader: { fontSize: 16, marginBottom: 4 },

  row: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  amountInput: { flex: 0.4, marginRight: 8 },
  smallBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },

  goalName: { fontSize: 18, fontWeight: "600", marginBottom: 4 },

  targetContainer: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 },
  targetAmount: { fontSize: 16, fontWeight: "600" },

  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
  progressFill: { height: "100%" },

  noTrans: { fontSize: 16, fontStyle: "italic" },
  txRow: { marginBottom: 8 },
  txText: { fontSize: 14 },
  txDate: { fontSize: 12 },
});
