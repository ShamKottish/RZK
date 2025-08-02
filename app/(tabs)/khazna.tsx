// app/(tabs)/khazna.tsx
import { useI18n } from '@/app/lib/i18n';
import { useTheme } from '@/contexts/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface User { id: string; name: string; phone: string }
interface Contributor { name: string; amount: number }
interface FamilyGoal {
  id: string;
  goalName: string;
  targetAmount: number;
  targetDate: Date;
  members: User[];
  contributions: Contributor[];
  createdAt: Date;
}

export default function FamilySavings() {
  const { darkMode } = useTheme();
  const { t } = useI18n();

  // mock users & current
  const [availableUsers] = useState<User[]>([
    { id: '1', name: 'Sham Kottish', phone: '0508125346' },
    { id: '2', name: 'Yara Abdullah', phone: '0565362782' },
    { id: '3', name: 'Ghala Zoriqan', phone: '0537901283' },
    { id: '4', name: 'Abulrahman Alhassun', phone: '0504523456' },
  ]);
  const currentUser = availableUsers[0];

  // state
  const [goals, setGoals] = useState<FamilyGoal[]>([]);
  const [goalName, setGoalName] = useState('');
  const [target, setTarget] = useState('');
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contribAmount, setContribAmount] = useState('');
  const [expandedGoals, setExpandedGoals] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (id: string) =>
    setExpandedGoals(prev => ({ ...prev, [id]: !prev[id] }));

  // filter for modal
  const filteredUsers = useMemo(() => {
    if (!selectedGoalId) return [];
    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return [];
    const q = searchQuery.toLowerCase();
    return availableUsers.filter(
      u =>
        (u.name.toLowerCase().includes(q) || u.phone.includes(q)) &&
        !goal.members.some(m => m.id === u.id)
    );
  }, [searchQuery, availableUsers, goals, selectedGoalId]);

  // format helper
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US-u-ca-gregory', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

  // create goal
  const createGoal = () => {
    if (!goalName || !target || !targetDate) {
      return Alert.alert(t('completeGoalNameAmountAndDate'));
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (targetDate < today) {
      return Alert.alert(t('targetDateCannotBeBeforeToday'));
    }
    const amt = parseFloat(target);
    if (isNaN(amt)) return Alert.alert(t('enterValidNumberForTargetAmount'));
    const newGoal: FamilyGoal = {
      id: Date.now().toString(),
      goalName,
      targetAmount: amt,
      targetDate,
      createdAt: new Date(),
      members: [currentUser],
      contributions: [
        { name: availableUsers[1].name, amount: 100 },
        { name: availableUsers[2].name, amount: 150 },
      ],
    };
    setGoals(gs => [...gs, newGoal]);
    setGoalName('');
    setTarget('');
    setTargetDate(null);
  };

  const openMemberModal = (goalId: string) => {
    setSelectedGoalId(goalId);
    setSearchQuery('');
    setModalVisible(true);
  };

  const addMember = (user: User) => {
    setGoals(gs =>
      gs.map(g =>
        g.id === selectedGoalId ? { ...g, members: [...g.members, user] } : g
      )
    );
    setModalVisible(false);
  };

  const addContribution = (goalId: string) => {
    if (!contribAmount) return;
    const amt = parseFloat(contribAmount);
    if (isNaN(amt)) return Alert.alert(t('enterValidNumberForTargetAmount'));
    setGoals(gs =>
      gs.map(g =>
        g.id === goalId
          ? { ...g, contributions: [...g.contributions, { name: currentUser.name, amount: amt }] }
          : g
      )
    );
    setContribAmount('');
  };

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>{t('khazna')}</Text>

          {/* --- Create Goal Form --- */}
          <View style={styles.section}>
            <TextInput
              style={styles.input}
              placeholder={t('goalNamePlaceholder')}
              placeholderTextColor="#888"
              value={goalName}
              onChangeText={setGoalName}
            />
            <TextInput
              style={styles.input}
              placeholder={t('targetAmountPlaceholder')}
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={target}
              onChangeText={setTarget}
            />
            <TouchableOpacity
              style={[styles.input, styles.datePickerBtn, { backgroundColor: darkMode ? '#1f2937' : '#f0f0f0' }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: targetDate ? (darkMode ? '#fff' : '#000') : '#888' }}>
                {targetDate ? fmt(targetDate) : t('selectTargetDate')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <View
                style={{
                  backgroundColor: darkMode ? '#1f2937' : '#fff',
                  borderRadius: 8,
                  padding: 8,
                  overflow: 'hidden',
                  marginBottom: 8,
                }}
              >
                <DateTimePicker
                  style={{ backgroundColor: darkMode ? '#1f2937' : '#fff' }}
                  value={targetDate || today}
                  mode="date"
                  display={Platform.OS === 'android' ? 'calendar' : 'inline'}
                  locale="en-US"
                  minimumDate={new Date()}
                  themeVariant={darkMode ? 'dark' : 'light'}
                  textColor={darkMode ? '#fff' : '#000'}
                  accentColor="#8b5cf6"
                  onChange={(_, d) => {
                    setShowDatePicker(false);
                    if (d) setTargetDate(d);
                  }}
                />
              </View>
            )}
            <TouchableOpacity style={styles.button} onPress={createGoal}>
              <Text style={styles.buttonText}>{t('addGoal')}</Text>
            </TouchableOpacity>
          </View>

          {/* --- Goals List (collapsible) --- */}
          {goals.map(goal => {
            const totalSaved = goal.contributions.reduce((sum, c) => sum + c.amount, 0);
            const progress = Math.min(totalSaved / goal.targetAmount, 1);
            const isOpen = !!expandedGoals[goal.id];

            return (
              <View key={goal.id} style={styles.section}>
                {/* Header */}
                <TouchableOpacity
                  style={[styles.goalHeader, { backgroundColor: darkMode ? '#1f2937' : '#f0f0f0' }]}
                  onPress={() => toggleExpand(goal.id)}
                >
                  <Text style={[styles.goalName, { color: darkMode ? '#fff' : '#000' }]}>{goal.goalName}</Text>
                  <Text style={[styles.toggleIcon, { color: darkMode ? '#fff' : '#000' }]}>{isOpen ? '−' : '+'}</Text>
                </TouchableOpacity>

                {/* Details */}
                {isOpen && (
                  <View style={styles.goalDetails}>
                    <Text style={[styles.summary, { color: darkMode ? '#ddd' : '#555' }]}>
                      {t('targetSavedSummary', {
                        target: goal.targetAmount.toLocaleString(),
                        saved: totalSaved.toLocaleString(),
                      })}
                    </Text>
                    <Text style={[styles.summary, { color: darkMode ? '#ddd' : '#555' }]}>
                      {t('dueByLabel')}: {fmt(goal.targetDate)}
                    </Text>

                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                    </View>

                    {progress >= 1 ? (
                      <Text style={[styles.completedText, { color: darkMode ? '#fff' : '#000' }]}>
                        {t('completed')}
                      </Text>
                    ) : (
                      <>
                        <TouchableOpacity style={styles.button} onPress={() => openMemberModal(goal.id)}>
                          <Text style={styles.buttonText}>{t('addMembers')}</Text>
                        </TouchableOpacity>
                        <View style={styles.chipContainer}>
                          {goal.members.map((m, i) => (
                            <View key={i} style={styles.chip}>
                              <Text style={styles.chipText}>{m.name}</Text>
                            </View>
                          ))}
                        </View>
                        <View style={styles.row}>
                          <TextInput style={[styles.input, styles.flex1]} value={currentUser.name} editable={false} />
                          <TextInput
                            style={[styles.input, styles.amountInput]}
                            placeholder={t('amountPlaceholder')}
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                            value={contribAmount}
                            onChangeText={setContribAmount}
                          />
                          <TouchableOpacity style={styles.smallBtn} onPress={() => addContribution(goal.id)}>
                            <Text style={styles.buttonText}>{t('add')}</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    <FlatList
                      data={goal.contributions}
                      keyExtractor={(_, i) => i.toString()}
                      ListHeaderComponent={
                        <Text style={[styles.subheader, { color: darkMode ? '#ddd' : '#333' }]}>
                          {t('contributions')}
                        </Text>
                      }
                      renderItem={({ item }) => (
                        <View style={styles.contributionRow}>
                          <Text style={[styles.contributor, { color: darkMode ? '#fff' : '#000' }]}>{item.name}</Text>
                          <Text style={[styles.amount, { color: darkMode ? '#fff' : '#000' }]}>{item.amount}</Text>
                        </View>
                      )}
                    />
                  </View>
                )}
              </View>
            );
          })}

          {/* --- Member Modal --- */}
          <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
            <SafeAreaView style={[styles.safe, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
              <View style={styles.modalHeader}>
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('searchByNameOrPhone')}
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={[styles.cancelText, { color: '#8b5cf6' }]}>{t('cancel')}</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={filteredUsers}
                keyExtractor={u => u.id}
                ListEmptyComponent={
                  <Text style={[styles.emptyText, { color: darkMode ? '#888' : '#ccc' }]}>
                    {t('noMatchingMembers')}
                  </Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.userRow} onPress={() => addMember(item)}>
                    <Text style={[styles.userText, { color: darkMode ? '#fff' : '#000' }]}>
                      {item.name} ({item.phone})
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </SafeAreaView>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  container: { padding: 16 },

  title: { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  section: { marginBottom: 24 },

  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  toggleIcon: { fontSize: 18, fontWeight: '600' },
  goalDetails: { marginTop: 12 },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  datePickerBtn: { justifyContent: 'center', height: 48 },

  goalName: { fontSize: 20, fontWeight: '600' },
  summary: { fontSize: 16, marginBottom: 4 },

  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  progressFill: { height: '100%', backgroundColor: '#8b5cf6' },
  completedText: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 12 },

  row: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  flex1: { flex: 1 },
  amountInput: { width: 80, marginLeft: 8 },
  smallBtn: { backgroundColor: '#8b5cf6', padding: 10, borderRadius: 8, marginLeft: 8 },

  subheader: { fontSize: 18, fontWeight: '600', marginBottom: 8 },

  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 12 },
  chip: {
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { fontSize: 14 },

  contributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  contributor: { fontSize: 16 },
  amount: { fontSize: 16, fontWeight: '600' },

  modalHeader: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 12,
  },
  cancelText: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  userRow: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  userText: { fontSize: 16 },
  safeArea: {
    flex: 1,
  },
  card: {
    backgroundColor: "#6d28d9",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },

  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#a78bfa",
    borderRadius: 999,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "#fff",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#6d28d9",
  },
  label: {
    color: "#ffffffff",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 10,
  },
  forgotText: {
    marginTop: 8,
    fontSize: 14,
    textDecorationLine: "underline",
    color: "#fff",
  },
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#8b5cf6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  supportButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },
  demoHint: {
    marginTop: 16,
    fontStyle: "italic",
    fontSize: 12,
    color: "#d1d5db",
  },
  error: {
    color: "#fecaca",
    marginTop: 12,
    textAlign: "center",
  },
});
