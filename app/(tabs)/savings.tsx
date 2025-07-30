// app/(tabs)/savings.tsx
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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

const BADGES = [
  { id: "bronze", title: "Bronze Saver", threshold: 0.25 },
  { id: "silver", title: "Silver Saver", threshold: 0.5 },
  { id: "gold", title: "Gold Saver", threshold: 0.75 },
  { id: "platinum", title: "Platinum Saver", threshold: 1.0 },
];

export default function Savings() {
  const { darkMode } = useTheme();
  const router = useRouter();
  const bg = darkMode ? "#111827" : "#f9fafb";
  const cardBg = darkMode ? "#1f2937" : "#ffffff";
  const text = darkMode ? "#f9fafb" : "#111827";
  const subtext = darkMode ? "#d1d5db" : "#6b7280";
  const border = darkMode ? "#374151" : "#e5e7eb";
  const primary = "#8b5cf6";

  // Form state
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [riskTolerance, setRiskTolerance] = useState<"Conservative" | "Moderate" | "High Risk" | null>(null);
  const [invests, setInvests] = useState<boolean | null>(null);
  const [annualReturn, setAnnualReturn] = useState("");
  const [interestType, setInterestType] = useState<"simple" | "compound">("compound");
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Projection & tracking prompt
  const [projectionNeeded, setProjectionNeeded] = useState<number | null>(null);
  const [showTrackPrompt, setShowTrackPrompt] = useState(false);
  const [track, setTrack] = useState(false);
  const [projectionMin, setProjectionMin] = useState<number | null>(null);
  const [projectionMax, setProjectionMax] = useState<number | null>(null);
  // Savings and transactions state
  const [goals, setGoals] = useState<Goal[]>([]);
  const [amounts, setAmounts] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shownBadges, setShownBadges] = useState<Record<string, string[]>>({});

   // Track expanded state per goal
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const toggleGoal = (name: string) =>
  setExpandedGoal(prev => (prev === name ? null : name));

  const parseNum = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ""));

  // Compute earned badges
  const earnedBadges = (g: Goal) => {
    const pct = g.saved / g.target;
    return BADGES.filter((b) => pct >= b.threshold).map((b) => b.id);
  };

  // Alert on new badge
  useEffect(() => {
    goals.forEach((g) => {
      const earned = earnedBadges(g);
      const shown = shownBadges[g.name] || [];
      const newOnes = earned.filter((id) => !shown.includes(id));
      if (newOnes.length > 0) {
        const def = BADGES.find((b) => b.id === newOnes[0])!;
        Alert.alert(
          "🎉 Congratulations!",
          `You earned the "${def.title}" badge on "${g.name}". You can view it on your dashboard.`,
          [
            { text: "OK", style: "cancel" },
            { text: "View", onPress: () => router.push("/dashboard") },
          ]
        );
        setShownBadges((sb) => ({
          ...sb,
          [g.name]: [...(sb[g.name] || []), ...newOnes],
        }));
      }
    });
  }, [goals, shownBadges, router]);

  // Calculate projection and show prompt
  const calculateProjection = () => {
    if (!name || !target || !date || invests === null) {
      Alert.alert("Please complete all fields.");
      return;
    }
    const tgt = parseNum(target);
    const now = new Date();
    if (isNaN(tgt) || date <= now) {
      Alert.alert("Enter a valid target amount and a future date.");
      return;
    }
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    const monthsCount = months + (days > 0 ? 1 : 0);
    const r = invests ? parseNum(annualReturn) / 100 : 0;
    let monthlyNeeded = tgt / monthsCount;
    if (r > 0 && interestType === "compound") {
      const mRate = r / 12;
      monthlyNeeded = (tgt * mRate) / (Math.pow(1 + mRate, monthsCount) - 1);
    }
    
     // apply ± delta based on risk tolerance
   const deltaMap: Record<string, number> = {
      "Conservative": 0.005,
      "Moderate":      0.02,
      "High Risk":     0.04
    };
    const delta = riskTolerance ? deltaMap[riskTolerance] : 0;
    const minMonthly = parseFloat((monthlyNeeded * (1 - delta)).toFixed(2));
    const maxMonthly = parseFloat((monthlyNeeded * (1 + delta)).toFixed(2));

    setGoals((gs) => [
      ...gs,
      {
        name,
        target: tgt,
        date: date.toISOString(),
        timeLeft: months > 0 ? `${months} mo ${days} d` : `${diffDays} d`,
        monthlyNeeded: parseFloat(monthlyNeeded.toFixed(2)),
        saved: 0,
      },
    ]);
    setProjectionMin(minMonthly);
    setProjectionMax(maxMonthly);    
    setShowTrackPrompt(true);
    setName("");
    setTarget("");
    setInvests(null);
    setAnnualReturn("");
    setInterestType("compound");
    setDate(null);
  };

  // Transactions handlers
  const addToGoal = (i: number) => {
    const amt = parseNum(amounts[i] || "");
    if (!amt) return;
    setGoals((gs) => gs.map((g, idx) => (idx === i ? { ...g, saved: g.saved + amt } : g)));
    setAmounts((a) => ({ ...a, [i]: "" }));
    setTransactions((ts) => [
      { goal: goals[i].name, type: "Add", amount: amt, date: new Date() },
      ...ts,
    ]);
  };
  const withdrawFromGoal = (i: number) => {
    const amt = parseNum(amounts[i] || "");
    if (!amt) return;
    setGoals((gs) => gs.map((g, idx) => (idx === i ? { ...g, saved: Math.max(0, g.saved - amt) } : g)));
    setAmounts((a) => ({ ...a, [i]: "" }));
    setTransactions((ts) => [
      { goal: goals[i].name, type: "Withdraw", amount: amt, date: new Date() },
      ...ts,
    ]);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg, paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>      
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: "padding", android: undefined })}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

           {/* Savings Projection Form */}
          <Text style={[styles.sectionTitle,{color:text}]}>Savings Projection</Text>
          <View style={[styles.card,{backgroundColor:cardBg,borderColor:border}]}>            
            <TextInput
              style={[styles.input,{color:text,borderColor:subtext}]}
              placeholder="Goal Name"
              placeholderTextColor={subtext}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input,{color:text,borderColor:subtext}]}
              placeholder="Target Amount (﷼)"
              placeholderTextColor={subtext}
              keyboardType="numeric"
              value={target}
              onChangeText={setTarget}
            />
            <Text style={[styles.questionText,{color:text}]}>Do you invest?</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity style={[styles.toggleBtn, invests===true&&styles.toggleBtnActive]} onPress={()=>setInvests(true)}>
                <Text style={[styles.toggleTxt, invests===true&&styles.toggleTxtActive]}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, invests===false&&styles.toggleBtnActive]} onPress={()=>setInvests(false)}>
                <Text style={[styles.toggleTxt, invests===false&&styles.toggleTxtActive]}>No</Text>
              </TouchableOpacity>
            </View>
            {invests && (
              <>                
                <TextInput
                  style={[styles.input,{color:text,borderColor:subtext}]}
                  placeholder="Expected Annual Return (%)"
                  placeholderTextColor={subtext}
                  keyboardType="numeric"
                  value={annualReturn}
                  onChangeText={setAnnualReturn}
                />
                <Text style={[styles.questionText,{color:text}]}>Interest Type</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity style={[styles.toggleBtn, interestType==="simple"&&styles.toggleBtnActive]} onPress={()=>setInterestType("simple")}>
                    <Text style={[styles.toggleTxt, interestType==="simple"&&styles.toggleTxtActive]}>Simple</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleBtn, interestType==="compound"&&styles.toggleBtnActive]} onPress={()=>setInterestType("compound")}>
                    <Text style={[styles.toggleTxt, interestType==="compound"&&styles.toggleTxtActive]}>Compound</Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.questionText,{color:text}]}>Risk Tolerance</Text>
                <View style={styles.toggleRow}>
                  <TouchableOpacity style={[styles.toggleBtn, riskTolerance==="Conservative"&&styles.toggleBtnActive]} onPress={()=>setRiskTolerance("Conservative")}>
                    <Text style={[styles.toggleTxt, riskTolerance==="Conservative"&&styles.toggleTxtActive]}>Conservative</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleBtn, riskTolerance==="Moderate"&&styles.toggleBtnActive]} onPress={()=>setRiskTolerance("Moderate")}>
                    <Text style={[styles.toggleTxt, riskTolerance==="Moderate"&&styles.toggleTxtActive]}>Moderate</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.toggleBtn, riskTolerance==="High Risk"&&styles.toggleBtnActive]} onPress={()=>setRiskTolerance("High Risk")}>
                    <Text style={[styles.toggleTxt, riskTolerance==="High Risk"&&styles.toggleTxtActive]}>High Risk</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            <Text style={[styles.questionText,{color:text}]}>Target Date</Text>
            <TouchableOpacity onPress={()=>setShowDatePicker(true)} style={[styles.input,{justifyContent:"center",borderColor:subtext}]}>              <Text style={{color:date?text:subtext}}>{date?date.toLocaleDateString("en-US"):"Select Date"}</Text>
            </TouchableOpacity>
            {showDatePicker && <DateTimePicker
                value={date||new Date()}
                mode="date"
                minimumDate={new Date()}
                display={Platform.OS==="android"?"calendar":"inline"}
                locale="en-US"
                themeVariant={darkMode?"dark":"light"}
                textColor={text}
                onChange={(_,sd)=>{setShowDatePicker(false); if(sd) setDate(sd);}} />}
            <TouchableOpacity style={[styles.button,{backgroundColor:primary}]} onPress={calculateProjection}>
              <Text style={styles.buttonText}>Calculate Projection</Text>
            </TouchableOpacity>
          </View>

          {/* Inline Projection & Track Prompt */}
         {projectionMin !== null && projectionMax !== null && (
  <View style={{ marginBottom: 16 }}>
    <Text style={[styles.subheader, { color: text }]}>
      To achieve your goal, save between ﷼{projectionMin.toLocaleString()}
      {' '}and ﷼{projectionMax.toLocaleString()} a month
    </Text>

    {showTrackPrompt && (
      <>
        <Text style={[styles.questionText, { color: text }]}>Would you like to track your savings?</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, track === true && styles.toggleBtnActive]}
            onPress={() => {
              setTrack(true);
              setShowTrackPrompt(false);
            }}
          >
            <Text style={[styles.toggleTxt, track === true && styles.toggleTxtActive]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, track === false && styles.toggleBtnActive]}
            onPress={() => {
              setTrack(false);
              setShowTrackPrompt(false);
            }}
          >
            <Text style={[styles.toggleTxt, track === false && styles.toggleTxtActive]}>No</Text>
          </TouchableOpacity>
        </View>
      </>
    )}
  </View>
)}

          {/* Savings Tracker */}
          {track && goals.map((g, i) => {
  const isOpen     = expandedGoal === g.name;
  const ownTx      = transactions.filter(t => t.goal === g.name);
  const pct        = Math.min(g.saved / g.target, 1);
  const badges     = earnedBadges(g);

  return (
    <View key={g.name} style={{ marginBottom: 16 }}>
      {/* Header */}
           <TouchableOpacity
        style={[styles.collapsibleHeader, { backgroundColor: cardBg, borderColor: border, borderWidth: 1 }]}
        onPress={() => toggleGoal(g.name)}
      >
        <Text style={[styles.goalName, { color: text }]}>{g.name}</Text>
        <Text style={[styles.toggleIcon, { color: text }]}>
          {isOpen ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {/* Expanded Content */}
      {isOpen && (
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          {/* — Goal Summary — */}
          <Text style={[styles.subheader, { color: text }]}>
            Target: ﷼{g.target.toLocaleString()}
          </Text>
          <Text style={[styles.subheader, { color: text }]}>
            Due by: {new Date(g.date).toLocaleDateString('en-US')}
          </Text>
          <Text style={[styles.subheader, { color: text }]}>
            Saved: ﷼{g.saved.toLocaleString()}
          </Text>
          <Text style={[styles.subheader, { color: text }]}>
            Monthly Needed: ﷼{g.monthlyNeeded.toLocaleString()}
          </Text>

          {/* — Badges & Progress — */}
          <View style={styles.badgeContainer}>
            {BADGES.map(b => (
              <MaterialCommunityIcons
                key={b.id}
                name="medal-outline"
                size={24}
                color={badges.includes(b.id) ? primary : subtext}
                style={{ marginRight: 8 }}
              />
            ))}
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct * 100}%`, backgroundColor: primary }]} />
          </View>

          {/* — Add / Withdraw Controls — */}
          {g.saved < g.target && (
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.amountInput, { color: text, borderColor: subtext }]}
                placeholder="Amount (﷼)"
                placeholderTextColor={subtext}
                keyboardType="numeric"
                value={amounts[i] || ''}
                onChangeText={t => setAmounts(a => ({ ...a, [i]: t }))}
              />
              <TouchableOpacity style={[styles.smallBtn, { backgroundColor: primary }]} onPress={() => addToGoal(i)}>
                <Text style={styles.buttonText}>+ Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.smallBtn, { backgroundColor: '#dc2626' }]} onPress={() => withdrawFromGoal(i)}>
                <Text style={styles.buttonText}>– Withdraw</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* — This Goal’s Transaction Log — */}
          <Text style={[styles.sectionTitle, { marginTop: 16, color: text }]}>Transactions</Text>
          {ownTx.length === 0 ? (
            <Text style={[styles.noTrans, { color: subtext }]}>No transactions yet.</Text>
          ) : (
            <FlatList
              data={ownTx}
              keyExtractor={(_, idx) => idx.toString()}
              nestedScrollEnabled
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => (
                <View style={styles.txRow}>
                  <Text style={[styles.txText, { color: item.type === 'Add' ? '#22c55e' : '#ef4444' }]}>
                    {item.type} ﷼{item.amount}
                  </Text>
                  <Text style={[styles.txDate, { color: subtext }]}>
                    {item.date.toLocaleDateString('en-US')}
                  </Text>
                </View>
              )}
            />
          )}
           {/* — Completed Banner — */}
          {g.saved >= g.target && (
            <Text style={[styles.completedText, { color: text }]}>
              Completed
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
  safeArea:      { flex: 1 },
  flex:          { flex: 1 },
  container:     { padding: 16, paddingBottom: 32 },

  sectionTitle:  { fontSize: 20, fontWeight: "600", marginBottom: 12 },

  card:          { borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1 },
  input:         {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16
  },
  questionText:  { fontSize: 16, fontWeight: "600", marginBottom: 8 },

  toggleRow:     {
    flexDirection: "row",
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    marginBottom: 12,
  },
  toggleBtn:       { flex: 1, padding: 12, alignItems: "center" },
  toggleBtnActive: { backgroundColor: "#8b5cf6" },
  toggleTxt:       { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  toggleTxtActive: { color: "#fff" },

  button:        { paddingVertical: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  buttonText:    { color: "#fff", fontSize: 16, fontWeight: "600" },

  row:           { flexDirection: "row", alignItems: "center", marginTop: 12 },
  amountInput:   { flex: 0.4, marginRight: 8 },
  smallBtn:      { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginLeft: 8 },

  goalName:      { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  subheader:     { fontSize: 16, marginBottom: 4 },

  targetContainer:{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 8 },
  targetAmount:   { fontSize: 16, fontWeight: "600" },

collapsibleHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 12,
  borderRadius: 8,
  marginBottom: 8,
},
toggleIcon: {
  fontSize: 18,
  fontWeight: '600',
},

  progressBar:   {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
  progressFill:  { height: "100%" },

  completedText: { fontSize: 16, fontWeight: "600", textAlign: "center", marginTop: 12 },

  noTrans:       { fontSize: 16, fontStyle: "italic" },
  txRow:         { marginBottom: 8 },
  txText:        { fontSize: 14 },
  txDate:        { fontSize: 12 },

  badgeContainer:{ flexDirection: "row", marginBottom: 8 },
});
