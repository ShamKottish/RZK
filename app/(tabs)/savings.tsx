// app/(tabs)/savings.tsx
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  saved: number;
  date: string;
}

interface Transaction {
  goal: string;
  type: "Add" | "Withdraw";
  amount: number;
  date: Date;
}

export default function Savings() {
  const { darkMode } = useTheme();

  // theme colors
  const bg = darkMode ? "#111827" : "#f9fafb";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const border = darkMode ? "#374151" : "#e5e7eb";
  const primary = "#8b5cf6";

  // Savings‐goals state
  const [newName, setNewName] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newDate, setNewDate] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [amounts, setAmounts] = useState<Record<number, string>>({});

  // Transactions log
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Retirement calculator state
  const [currentAge, setCurrentAge] = useState("");
  const [retireAge, setRetireAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [retirementResult, setRetirementResult] = useState<number | null>(null);

  const addGoal = () => {
    if (!newName || !newTarget || !newDate) {
      Alert.alert("Please fill all goal fields.");
      return;
    }
    setGoals([
      ...goals,
      { name: newName, target: Number(newTarget), saved: 0, date: newDate },
    ]);
    setNewName("");
    setNewTarget("");
    setNewDate("");
  };

  const addToGoal = (idx: number) => {
    const amt = Number(amounts[idx] || 0);
    if (!amt) return;
    const goalName = goals[idx].name;
    setGoals((gs) =>
      gs.map((g, i) => (i === idx ? { ...g, saved: g.saved + amt } : g))
    );
    setAmounts((a) => ({ ...a, [idx]: "" }));
    setTransactions((txs) => [
      { goal: goalName, type: "Add", amount: amt, date: new Date() },
      ...txs,
    ]);
  };

  const withdrawFromGoal = (idx: number) => {
    const amt = Number(amounts[idx] || 0);
    if (!amt) return;
    const goalName = goals[idx].name;
    setGoals((gs) =>
      gs.map((g, i) =>
        i === idx ? { ...g, saved: Math.max(0, g.saved - amt) } : g
      )
    );
    setAmounts((a) => ({ ...a, [idx]: "" }));
    setTransactions((txs) => [
      { goal: goalName, type: "Withdraw", amount: amt, date: new Date() },
      ...txs,
    ]);
  };

  const calculateRetirement = () => {
    if (
      !currentAge ||
      !retireAge ||
      !currentSavings ||
      !monthlyContribution ||
      !annualReturn
    ) {
      Alert.alert("Please fill in all retirement fields.");
      return;
    }
    const years = Number(retireAge) - Number(currentAge);
    const periods = years * 12;
    const rMonthly = Number(annualReturn) / 100 / 12;
    const pv = Number(currentSavings);
    const pmnt = Number(monthlyContribution);

    const fvCurrent = pv * Math.pow(1 + rMonthly, periods);
    const fvContrib =
      pmnt * ((Math.pow(1 + rMonthly, periods) - 1) / rMonthly);

    setRetirementResult(fvCurrent + fvContrib);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: bg }]}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: text }]}>
          Savings Tracker
        </Text>
        <Text style={[styles.subheader, { color: subtext }]}>
          Set goals and track your progress
        </Text>

        {/* Create New Savings Goal */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.cardTitle, { color: text }]}>
            Create New Savings Goal
          </Text>
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            placeholder="Goal Name"
            placeholderTextColor={subtext}
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            placeholder="Target Amount ($)"
            placeholderTextColor={subtext}
            keyboardType="numeric"
            value={newTarget}
            onChangeText={setNewTarget}
          />
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            placeholder="Target Date (mm/dd/yyyy)"
            placeholderTextColor={subtext}
            value={newDate}
            onChangeText={setNewDate}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primary }]}
            onPress={addGoal}
          >
            <Text style={styles.buttonText}>Create Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Your Savings Goals */}
        {goals.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Your Savings Goals
            </Text>
            {goals.map((g, idx) => {
              const progress = Math.min(g.saved / g.target, 1);
              return (
                <View
                  key={idx}
                  style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}
                >
                  <View style={styles.row}>
                    <Text style={[styles.goalName, { color: text }]}>{g.name}</Text>
                    <Text style={[styles.goalAmount, { color: text }]}>
                      ${g.saved.toLocaleString()} / ${g.target.toLocaleString()}
                    </Text>
                  </View>
                  <Text style={[styles.targetDate, { color: subtext }]}>
                    Target: {g.date}
                  </Text>
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
                      style={[
                        styles.input,
                        styles.amountInput,
                        { color: text, borderColor: subtext },
                      ]}
                      placeholder="Amount"
                      placeholderTextColor={subtext}
                      keyboardType="numeric"
                      value={amounts[idx] || ""}
                      onChangeText={(text) =>
                        setAmounts((a) => ({ ...a, [idx]: text }))
                      }
                    />
                    <TouchableOpacity
                      style={[styles.buttonSmall, { backgroundColor: primary }]}
                      onPress={() => addToGoal(idx)}
                    >
                      <Text style={styles.buttonText}>+ Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.buttonSmall, { backgroundColor: "#dc2626" }]}
                      onPress={() => withdrawFromGoal(idx)}
                    >
                      <Text style={styles.buttonText}>– Withdraw</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        )}

        {/* Transaction Log */}
        <Text style={[styles.sectionTitle, { color: text }]}>
          Transaction Log
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          {transactions.length === 0 ? (
            <Text style={[styles.noTrans, { color: subtext }]}>
              No transactions yet.
            </Text>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <View style={styles.txRow}>
                  <Text style={[styles.txText, { color: text }]}>
                    {item.type} ${item.amount.toLocaleString()}{" "}
                    {item.type === "Add" ? "to" : "from"} {item.goal}
                  </Text>
                  <Text style={[styles.txDate, { color: subtext }]}>
                    {item.date.toLocaleString()}
                  </Text>
                </View>
              )}
            />
          )}
        </View>

        {/* Retirement Calculator */}
        <Text style={[styles.sectionTitle, { color: text }]}>
          Retirement Calculator
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.subCardTitle, { color: text }]}>
            Your Information
          </Text>
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            placeholder="Current Age"
            placeholderTextColor={subtext}
            keyboardType="numeric"
            value={currentAge}
            onChangeText={setCurrentAge}
          />
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            placeholder="Retirement Age"
            placeholderTextColor={subtext}
            keyboardType="numeric"
            value={retireAge}
            onChangeText={setRetireAge}
          />
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            placeholder="Current Savings ($)"
            placeholderTextColor={subtext}
            keyboardType="numeric"
            value={currentSavings}
            onChangeText={setCurrentSavings}
          />
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            placeholder="Monthly Contribution ($)"
            placeholderTextColor={subtext}
            keyboardType="numeric"
            value={monthlyContribution}
            onChangeText={setMonthlyContribution}
          />
          <TextInput
            style={[styles.input, { color: text, borderColor: subtext }]}
            placeholder="Expected Annual Return (%)"
            placeholderTextColor={subtext}
            keyboardType="numeric"
            value={annualReturn}
            onChangeText={setAnnualReturn}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primary }]}
            onPress={calculateRetirement}
          >
            <Text style={styles.buttonText}>Calculate Retirement</Text>
          </TouchableOpacity>

          {retirementResult !== null && (
            <Text style={[styles.resultText, { color: text }]}>
              Estimated Savings at Retirement:{"\n"}$
              {retirementResult.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 16,
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
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  amountInput: {
    flex: 0.4,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonSmall: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  goalName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  goalAmount: {
    fontSize: 16,
    fontWeight: "600",
  },
  targetDate: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: "#e5e7eb",
  },
  progressFill: {
    height: "100%",
  },
  noTrans: {
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
  },
  resultText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
