// app/(tabs)/khazna.tsx
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

interface User {
  id: string;
  name: string;
  phone: string;
}

interface Contributor {
  name: string;
  amount: number;
}

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

  // Mocked available users
  const [availableUsers] = useState<User[]>([
    { id: '1', name: 'Alice Johnson',  phone: '555-1234' },
    { id: '2', name: 'Bob Smith',      phone: '555-5678' },
    { id: '3', name: 'Charlie Nguyen', phone: '555-9012' },
    { id: '4', name: 'David Lee',      phone: '555-3456' },
  ]);

  const currentUser = availableUsers[0];

  // State for multiple goals
  const [goals, setGoals] = useState<FamilyGoal[]>([]);

  // Create form state
  const [goalName, setGoalName]             = useState('');
  const [target, setTarget]                 = useState('');
  const [targetDate, setTargetDate]         = useState<Date|null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Modal & search for members
  const [modalVisible, setModalVisible]         = useState(false);
  const [selectedGoalId, setSelectedGoalId]     = useState<string | null>(null);
  const [searchQuery, setSearchQuery]           = useState('');

  // Contribution amount input
  const [contribAmount, setContribAmount]       = useState('');

  // Filter available users for selected goal
  const filteredUsers = useMemo(() => {
    if (!selectedGoalId) return [];
    const goal = goals.find(g => g.id === selectedGoalId);
    if (!goal) return [];
    const q = searchQuery.toLowerCase();
    return availableUsers.filter(u =>
      (u.name.toLowerCase().includes(q) || u.phone.includes(q)) &&
      !goal.members.some(m => m.id === u.id)
    );
  }, [searchQuery, availableUsers, goals, selectedGoalId]);

  // Handlers
  const createGoal = () => {
    if (!goalName || !target || !targetDate) {
      return Alert.alert('Please enter name, target amount, and date');
    }
    const amt = parseFloat(target);
    if (isNaN(amt)) {
      return Alert.alert('Enter a valid number for target amount');
    }
    const newGoal: FamilyGoal = {
      id: Date.now().toString(),
      goalName,
      targetAmount: amt,
      targetDate,
      createdAt: new Date(),
      // start with current user and mock initial contributions
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
    setGoals(gs => gs.map(g =>
      g.id === selectedGoalId
        ? { ...g, members: [...g.members, user] }
        : g
    ));
    setModalVisible(false);
  };

  const addContribution = (goalId: string) => {
    if (!contribAmount) return;
    const amt = parseFloat(contribAmount);
    if (isNaN(amt)) {
      return Alert.alert('Enter a valid amount');
    }
    setGoals(gs => gs.map(g =>
      g.id === goalId
        ? { ...g, contributions: [...g.contributions, { name: currentUser.name, amount: amt }] }
        : g
    ));
    setContribAmount('');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: darkMode ? '#111' : '#fff' }]}> 
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          <Text style={[styles.title, { color: darkMode ? '#fff' : '#000' }]}>Family Savings</Text>

          {/* Create New Goal Form */}
          <View style={styles.section}>
            <TextInput
              style={styles.input}
              placeholder="Goal Name"
              placeholderTextColor="#888"
              value={goalName}
              onChangeText={setGoalName}
            />
            <TextInput
              style={styles.input}
              placeholder="Target Amount"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={target}
              onChangeText={setTarget}
            />
            <TouchableOpacity style={[styles.input, styles.datePickerBtn]} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: targetDate ? (darkMode ? '#fff' : '#000') : '#888' }}>
                {targetDate ? targetDate.toLocaleDateString('en-US') : 'Select Target Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={targetDate || new Date()}
                mode="date"
                display={Platform.OS === 'android' ? 'calendar' : 'inline'}
                locale="en-US"
                onChange={(_, d) => { setShowDatePicker(false); if (d) setTargetDate(d); }}
              />
            )}
            <TouchableOpacity style={styles.button} onPress={createGoal}>
              <Text style={styles.buttonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>

          {/* Render each goal as its own card */}
          {goals.map(goal => {
            const totalSaved = goal.contributions.reduce((sum, c) => sum + c.amount, 0);
            const progress = Math.min(totalSaved / goal.targetAmount, 1);
            return (
              <View key={goal.id} style={styles.section}>
                <Text style={[styles.goalName, { color: darkMode ? '#fff' : '#000' }]}>{goal.goalName}</Text>
                <Text style={[styles.summary, { color: darkMode ? '#ddd' : '#555' }]}>Target: {goal.targetAmount} | Saved: {totalSaved}</Text>
                <Text style={[styles.summary, { color: darkMode ? '#ddd' : '#555' }]}>Due by: {goal.targetDate.toLocaleDateString()}</Text>

                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                </View>
                {progress >= 1 ? (
                  <Text style={[styles.completedText, { color: darkMode ? '#fff' : '#000' }]}>Completed</Text>
                ) : (
                  <>
                    <TouchableOpacity style={styles.button} onPress={() => openMemberModal(goal.id)}>
                      <Text style={styles.buttonText}>Add Members</Text>
                    </TouchableOpacity>
                    <View style={styles.chipContainer}>
                      {goal.members.map((m, i) => (
                        <View key={i} style={styles.chip}>
                          <Text style={styles.chipText}>{m.name}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.row}>
                      <TextInput
                        style={[styles.input, styles.flex1]}
                        value={currentUser.name}
                        editable={false}
                      />
                      <TextInput
                        style={[styles.input, styles.amountInput]}
                        placeholder="Amount"
                        placeholderTextColor="#888"
                        keyboardType="numeric"
                        value={contribAmount}
                        onChangeText={setContribAmount}
                      />
                      <TouchableOpacity style={styles.smallBtn} onPress={() => addContribution(goal.id)}>
                        <Text style={styles.buttonText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                <FlatList
                  data={goal.contributions}
                  keyExtractor={(_, i) => i.toString()}
                  ListHeaderComponent={<Text style={[styles.subheader, { color: darkMode ? '#ddd' : '#333' }]}>Contributions</Text>}
                  renderItem={({ item }) => (
                    <View style={styles.contributionRow}>
                      <Text style={[styles.contributor, { color: darkMode ? '#fff' : '#000' }]}>{item.name}</Text>
                      <Text style={[styles.amount, { color: darkMode ? '#fff' : '#000' }]}>{item.amount}</Text>
                    </View>
                  )}
                />
              </View>
            );
          })}

          {/* Member Search Modal */}
          <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
            <SafeAreaView style={[styles.safe, { backgroundColor: darkMode ? '#111' : '#fff' }]}> 
              <View style={styles.modalHeader}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name or phone"
                  placeholderTextColor="#888"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={[styles.cancelText, { color: '#8b5cf6' }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={filteredUsers}
                keyExtractor={u => u.id}
                ListEmptyComponent={<Text style={[styles.emptyText, { color: darkMode ? '#888' : '#ccc' }]}>No matching members</Text>}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.userRow} onPress={() => addMember(item)}>
                    <Text style={[styles.userText, { color: darkMode ? '#fff' : '#000' }]}>{item.name} ({item.phone})</Text>
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
  safe:            { flex: 1 },
  flex:            { flex: 1 },
  container:       { padding: 16 },

  title:           { fontSize: 24, fontWeight: '700', marginBottom: 16 },
  section:         { marginBottom: 24 },

  input:           { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 8 },
  datePickerBtn:   { justifyContent: 'center', height: 48 },

  button:          { backgroundColor: '#8b5cf6', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText:      { color: '#fff', fontWeight: '600' },

  goalName:        { fontSize: 20, fontWeight: '600', marginBottom: 4 },
  summary:         { fontSize: 16, marginBottom: 4 },

  progressBar:     { height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: '#e5e7eb', marginVertical: 12 },
  progressFill:    { height: '100%', backgroundColor: '#8b5cf6' },
  completedText:   { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 12 },

  row:             { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  flex1:           { flex: 1 },
  amountInput:     { width: 80, marginLeft: 8 },
  smallBtn:        { backgroundColor: '#8b5cf6', padding: 10, borderRadius: 8, marginLeft: 8 },

  subheader:       { fontSize: 18, fontWeight: '600', marginBottom: 8 },

  chipContainer:   { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 12 },
  chip:            { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginRight: 8, marginBottom: 8 },
  chipText:        { fontSize: 14 },

  contributionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  contributor:     { fontSize: 16 },
  amount:          { fontSize: 16, fontWeight: '600' },

  modalHeader:     { flexDirection: 'row', padding: 16, alignItems: 'center' },
  searchInput:     { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 12 },
  cancelText:      { fontSize: 16 },
  emptyText:       { textAlign: 'center', marginTop: 32, fontSize: 16 },
  userRow:         { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  userText:        { fontSize: 16 },
});
