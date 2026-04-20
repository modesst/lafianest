// src/components/SectionHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../constants/colors';
import { SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';

interface SectionHeaderProps {
  label: string;
  onSeeAll?: () => void;
  showSeeAll?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  label, 
  onSeeAll, 
  showSeeAll = true 
}) => {
  return (
    <View style={styles.container}>
      <Text style={TEXT.label}>{label}</Text>
      {showSeeAll && (
        <Pressable onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See all →</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  seeAllText: {
    color: COLORS.terracotta,
    fontSize: 13,
    fontFamily: FONTS.bodySemi,
  },
});
