// src/components/RentHistoryTimeline.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Info, ArrowUp, ArrowDown, Minus } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { formatRent } from '../utils/distance';

interface RentEntry {
  year: number;
  amount: number;
}

interface RentHistoryTimelineProps {
  history: RentEntry[];
}

export const RentHistoryTimeline: React.FC<RentHistoryTimelineProps> = ({ history }) => {
  if (!history || history.length === 0) return null;

  // Sort history by year descending
  const sortedHistory = [...history].sort((a, b) => b.year - a.year);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[TEXT.h3, styles.title]}>Rent History</Text>
        <Info size={16} color={COLORS.inkLight} />
      </View>
      <Text style={[TEXT.bodySmall, styles.subtitle]}>
        Shows how rent has changed each year
      </Text>

      <View style={styles.timeline}>
        {sortedHistory.map((item, index) => {
          const previousItem = sortedHistory[index + 1];
          const diff = previousItem ? item.amount - previousItem.amount : 0;
          
          return (
            <View key={item.year} style={styles.row}>
              <View style={styles.leftCol}>
                <Text style={styles.yearText}>{item.year}</Text>
                {index < sortedHistory.length - 1 && <View style={styles.connector} />}
              </View>
              
              <View style={styles.rightCol}>
                <View style={styles.amountRow}>
                  <Text style={styles.amountText}>{formatRent(item.amount)}</Text>
                  <View style={styles.badge}>
                    {diff > 0 ? (
                      <ArrowUp size={12} color={COLORS.error} />
                    ) : diff < 0 ? (
                      <ArrowDown size={12} color={COLORS.teal} />
                    ) : (
                      <Minus size={12} color={COLORS.inkFaint} />
                    )}
                  </View>
                </View>
                {diff !== 0 && (
                  <Text style={[TEXT.bodySmall, { color: diff > 0 ? COLORS.error : COLORS.teal }]}>
                    {diff > 0 ? '+' : ''}{formatRent(diff)} from previous year
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  title: {
    color: COLORS.ink,
  },
  subtitle: {
    color: COLORS.inkLight,
    marginBottom: SPACING.lg,
  },
  timeline: {
    paddingLeft: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    minHeight: 60,
  },
  leftCol: {
    width: 60,
    alignItems: 'center',
  },
  yearText: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.inkLight,
    fontSize: 14,
  },
  connector: {
    width: 1,
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginVertical: 4,
  },
  rightCol: {
    flex: 1,
    paddingLeft: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  amountText: {
    fontFamily: FONTS.bodyBold,
    color: COLORS.navy,
    fontSize: 16,
  },
  badge: {
    padding: 2,
  },
});
