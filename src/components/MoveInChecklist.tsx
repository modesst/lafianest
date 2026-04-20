// src/components/MoveInChecklist.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';

interface MoveInChecklistProps {
  checklist: Record<string, boolean>;
  lastConfirmedAt?: string;
}

const CHECKLIST_ITEMS = [
  { key: 'roof', label: 'Roof condition' },
  { key: 'water', label: 'Water supply' },
  { key: 'electricity', label: 'Electricity stable' },
  { key: 'toilet', label: 'Toilet functional' },
  { key: 'paint', label: 'Property painted' },
  { key: 'gate', label: 'Gate functional' },
  { key: 'generator', label: 'Generator available' },
  { key: 'borehole', label: 'Borehole/tank' },
];

export const MoveInChecklist: React.FC<MoveInChecklistProps> = ({ 
  checklist, 
  lastConfirmedAt 
}) => {
  const isAllChecked = CHECKLIST_ITEMS.every(item => checklist[item.key]);

  return (
    <View style={styles.container}>
      {isAllChecked && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Move-In Ready ✓</Text>
        </View>
      )}

      <Text style={[TEXT.h3, styles.title]}>Move-In Checklist</Text>
      <Text style={[TEXT.bodySmall, styles.subtitle]}>
        Reduces showing-up-to-disappointment
      </Text>

      <View style={styles.grid}>
        {CHECKLIST_ITEMS.map(item => {
          const isChecked = checklist[item.key];
          return (
            <View key={item.key} style={styles.item}>
              {isChecked ? (
                <CheckCircle2 size={16} color={COLORS.teal} />
              ) : (
                <XCircle size={16} color={COLORS.inkFaint} />
              )}
              <Text style={[
                styles.itemText,
                !isChecked && styles.itemTextUnchecked
              ]}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>

      {lastConfirmedAt && (
        <Text style={styles.footer}>
          Last confirmed: {new Date(lastConfirmedAt).toLocaleDateString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  banner: {
    backgroundColor: COLORS.teal,
    marginHorizontal: -SPACING.md,
    marginTop: -SPACING.md,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  bannerText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.ink,
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.inkLight,
    marginBottom: SPACING.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  item: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  itemText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.inkMid,
  },
  itemTextUnchecked: {
    color: COLORS.inkFaint,
    textDecorationLine: 'line-through',
  },
  footer: {
    marginTop: SPACING.md,
    fontSize: 11,
    color: COLORS.inkLight,
    fontFamily: FONTS.body,
  },
});
