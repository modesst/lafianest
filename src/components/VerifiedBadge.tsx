// src/components/VerifiedBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { TEXT } from '../constants/typography';

export const VerifiedBadge: React.FC = () => {
  return (
    <View style={styles.container}>
      <ShieldCheck size={12} color={COLORS.teal} style={styles.icon} />
      <Text style={[TEXT.badge, styles.text]}>
        Verified
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: COLORS.teal,
  },
});
