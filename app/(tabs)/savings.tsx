// app/(tabs)/savings.tsx
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

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
  const [retirementResult, setRetirementResult] = useState<number | null>(
    null
  );

  const addGoal = () => {
    if (!newName || !newTarget || !newDate) return;
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
      Alert.alert("Please fill in all fields");
      return;
    }
    const years = Number(retireAge) - Number(currentAge);
    const periods = years * 12;
    const rMonthly = Number(annualReturn) / 100 / 12;
    const pv = Number(currentSavings);
    const pmnt = Number(monthlyContribution);

    const fvCurrent = pv * Math.pow(1 + rMonthly, periods);
    const fvContrib = pmnt * ((Math.pow(1 + rMonthly, periods) - 1) / rMonthly);

    setRetirementResult(fvCurrent + fvContrib);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator
      >
        {/* Header */}
        <Text style={styles.header}>Savings Tracker</Text>
        <Text style={styles.subheader}>Set goals and track your progress</Text>

        {/* Create New Savings Goal */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create New Savings Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="Goal Name"
            placeholderTextColor="#6b7280"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={styles.input}
            placeholder="Target Amount ($)"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={newTarget}
            onChangeText={setNewTarget}
          />
          <TextInput
            style={styles.input}
            placeholder="Target Date (mm/dd/yyyy)"
            placeholderTextColor="#6b7280"
            value={newDate}
            onChangeText={setNewDate}
          />
          <TouchableOpacity style={styles.button} onPress={addGoal}>
            <Text style={styles.buttonText}>Create Goal</Text>
          </TouchableOpacity>
        </View>

        {/* Your Savings Goals */}
        {goals.length > 0 && (
          <>
            <Text style={[styles.cardTitle, { marginTop: 24 }]}>
              Your Savings Goals
            </Text>
            {goals.map((g, idx) => {
              const progress = Math.min(g.saved / g.target, 1);
              return (
                <View key={idx} style={styles.card}>
                  <View style={styles.row}>
                    <Text style={styles.goalName}>{g.name}</Text>
                    <Text style={styles.goalAmount}>
                      ${g.saved.toLocaleString()} / ${g.target.toLocaleString()}
                    </Text>
                  </View>
                  <Text style={styles.targetDate}>Target: {g.date}</Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress * 100}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.row}>
                    <TextInput
                      style={[styles.input, styles.amountInput]}
                      placeholder="Amount"
                      placeholderTextColor="#6b7280"
                      keyboardType="numeric"
                      value={amounts[idx] || ""}
                      onChangeText={(text) =>
                        setAmounts((a) => ({ ...a, [idx]: text }))
                      }
                    />
                    <TouchableOpacity
                      style={[styles.button, styles.buttonSmall]}
                      onPress={() => addToGoal(idx)}
                    >
                      <Text style={styles.buttonText}>+ Add</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.buttonSmall,
                        styles.withdraw,
                      ]}
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
        <Text style={[styles.cardTitle, { marginTop: goals.length ? 24 : 0 }]}>
          Transaction Log
        </Text>
        <View style={styles.card}>
          {transactions.length === 0 ? (
            <Text style={styles.noTrans}>No transactions yet.</Text>
          ) : (
            transactions.map((tx, i) => (
              <View key={i} style={styles.txRow}>
                <Text style={styles.txText}>
                  {tx.type} ${tx.amount.toLocaleString()}{" "}
                  {tx.type === "Add" ? "to" : "from"} {tx.goal}
                </Text>
                <Text style={styles.txDate}>
                  {tx.date.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Retirement Calculator */}
        <Text style={[styles.cardTitle, { marginTop: 24 }]}>
          Retirement Calculator
        </Text>
        <View style={styles.card}>
          <Text style={styles.subCardTitle}>Your Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Current Age"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={currentAge}
            onChangeText={setCurrentAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Retirement Age"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={retireAge}
            onChangeText={setRetireAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Current Savings ($)"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={currentSavings}
            onChangeText={setCurrentSavings}
          />
          <TextInput
            style={styles.input}
            placeholder="Monthly Contribution ($)"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={monthlyContribution}
            onChangeText={setMonthlyContribution}
          />
          <TextInput
            style={styles.input}
            placeholder="Expected Annual Return (%)"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            value={annualReturn}
            onChangeText={setAnnualReturn}
          />
          <TouchableOpacity
            style={[styles.button, { marginTop: 8 }]}
            onPress={calculateRetirement}
          >
            <Text style={styles.buttonText}>Calculate Retirement</Text>
          </TouchableOpacity>

          {retirementResult !== null && (
            <Text style={styles.resultText}>
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
    backgroundColor: "#f9fafb",
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
  },
  subCardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fefefe",
    flex: 1,
    color: "#111827",
  },
  amountInput: {
    marginRight: 8,
  },
  button: {
    backgroundColor: "#c084fc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSmall: {
    flex: 0.25,
    marginLeft: 8,
  },
  withdraw: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  goalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  goalAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  targetDate: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8b5cf6",
  },
  noTrans: {
    fontStyle: "italic",
    color: "#6b7280",
  },
  txRow: {
    marginBottom: 8,
  },
  txText: {
    fontSize: 14,
    color: "#111827",
  },
  txDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  resultText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
});
