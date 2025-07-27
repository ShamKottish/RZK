// app/(tabs)/dashboard.tsx
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export default function Dashboard() {
  const { darkMode } = useTheme();

  // Theme colors
  const bg = darkMode ? '#111827' : '#f9fafb';
  const cardBg = darkMode ? '#1f2937' : '#ffffff';
  const text = darkMode ? '#f9fafb' : '#111827';
  const subtext = darkMode ? '#d1d5db' : '#6b7280';
  const border = darkMode ? '#374151' : '#e5e7eb';

  // Dummy data — replace with your real state or props
  const totalSavings = 1400;
  const goalsCompleted = 0;
  const totalGoals = 1;
  const retirementProjection = 1462151.278;
  const projectedAge = 65;
  const watchlistCount = 2;

  const progressPercent = Math.min(
    100,
    Math.round((totalSavings / 5000) * 100)
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.header, { color: text }]}>
          Financial Dashboard
        </Text>
        <Text style={[styles.subheader, { color: subtext }]}>
          Your financial health at a glance
        </Text>

        {/* Total Savings Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: text }]}>
              Total Savings
            </Text>
            <Ionicons
              name={'wallet-outline' as any}
              size={20}
              color={subtext}
            />
          </View>
          <Text style={[styles.amount, { color: text }]}>
            ${totalSavings.toLocaleString()}
          </Text>
          <Text style={[styles.meta, { color: subtext }]}>
            {goalsCompleted} of {totalGoals} goals completed
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>
        </View>

        {/* Retirement Fund Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: text }]}>
              Retirement Fund
            </Text>
            <Ionicons
              name={'calculator-outline' as any}
              size={20}
              color={subtext}
            />
          </View>
          <Text style={[styles.amount, { color: text }]}>
            ${retirementProjection.toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            })}
          </Text>
          <Text style={[styles.meta, { color: subtext }]}>
            Projected by age {projectedAge}
          </Text>
        </View>

        {/* Watchlist Card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: text }]}>
              Watchlist
            </Text>
            <Ionicons
              name={'stats-chart-outline' as any}
              size={20}
              color={subtext}
            />
          </View>
          <Text style={[styles.amount, { color: text }]}>
            {watchlistCount} Stocks
          </Text>
          <Text style={[styles.meta, { color: subtext }]}>
            Tracking your investments
          </Text>
        </View>

        {/* Active Savings Goals Section */}
        <Text style={[styles.sectionTitle, { color: text }]}>
          Active Savings Goals
        </Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: border }]}>
          <Text style={[styles.meta, { color: subtext }]}>
            You have no active goals.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: {
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
  },
});
