// src/components/AffordabilityMeter.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING, SHADOW } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { getAffordabilityPercent, formatRent } from '../utils/distance';

interface AffordabilityMeterProps {
  rentAmount: number;
  paymentFrequency: 'yearly' | '6monthly' | 'monthly';
  monthlyBudget: number | null;
  onSetBudget?: (budget: number) => void;
}

export const AffordabilityMeter: React.FC<AffordabilityMeterProps> = ({
  rentAmount,
  paymentFrequency,
  monthlyBudget,
  onSetBudget
}) => {
  if (!monthlyBudget) {
    return (
      <View style={styles.container}>
        <Text style={[TEXT.h3, styles.title]}>Is This Affordable?</Text>
        <Text style={[TEXT.bodySmall, styles.subtitle]}>
          Set your budget to see affordability
        </Text>
        <View style={styles.inputContainer}>
          <Text style={styles.naira}>₦</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter monthly budget"
            keyboardType="numeric"
            placeholderTextColor={COLORS.inkFaint}
            onSubmitEditing={(e) => onSetBudget?.(parseInt(e.nativeEvent.text))}
          />
        </View>
      </View>
    );
  }

  const percent = getAffordabilityPercent(rentAmount, paymentFrequency, monthlyBudget);
  const monthlyRent = paymentFrequency === 'yearly' ? rentAmount / 12 : 
                     paymentFrequency === '6monthly' ? rentAmount / 6 : rentAmount;

  const getStatus = () => {
    if (percent <= 40) return { label: 'Comfortable', color: COLORS.teal };
    if (percent <= 60) return { label: 'Stretching', color: COLORS.gold };
    return { label: 'Too High', color: COLORS.error };
  };

  const status = getStatus();

  return (
    <View style={styles.container}>
      <Text style={[TEXT.h3, styles.title]}>Is This Affordable?</Text>
      
      <View style={styles.barContainer}>
        <View style={styles.bar}>
          <View style={[styles.segment, { backgroundColor: COLORS.teal, flex: 4 }]} />
          <View style={[styles.segment, { backgroundColor: COLORS.gold, flex: 2 }]} />
          <View style={[styles.segment, { backgroundColor: COLORS.error, flex: 4 }]} />
        </View>
        <View style={[styles.marker, { left: `${Math.min(percent, 100)}%` }]}>
          <View style={[styles.markerDot, { backgroundColor: status.color }]} />
        </View>
      </View>

      <View style={styles.statusRow}>
        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        <Text style={styles.percentText}>{percent}% of budget</Text>
      </View>

      <Text style={styles.detailText}>
        {formatRent(Math.round(monthlyRent))}/mo · {percent}% of your {formatRent(monthlyBudget)} budget
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  title: {
    color: COLORS.ink,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.inkLight,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  naira: {
    fontSize: 16,
    color: COLORS.ink,
    marginRight: 4,
    fontFamily: FONTS.bodyBold,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.ink,
  },
  barContainer: {
    height: 12,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    position: 'relative',
  },
  bar: {
    height: 8,
    width: '100%',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: COLORS.bgDeep,
  },
  segment: {
    height: '100%',
  },
  marker: {
    position: 'absolute',
    top: -4,
    width: 16,
    height: 16,
    marginLeft: -8,
    alignItems: 'center',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
    ...SHADOW.subtle,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 14,
  },
  percentText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.ink,
  },
  detailText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.inkLight,
  },
});
