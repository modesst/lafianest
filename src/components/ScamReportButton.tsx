// src/components/ScamReportButton.tsx
import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';
import { Flag } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { FONTS } from '../constants/typography';

interface ScamReportButtonProps {
  onPress: () => void;
}

export const ScamReportButton: React.FC<ScamReportButtonProps> = ({ onPress }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed
      ]} 
      onPress={onPress}
    >
      <Flag size={16} color={COLORS.error} style={styles.icon} />
      <Text style={styles.buttonText}>Report Suspicious Listing</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    height: 50,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  buttonPressed: {
    backgroundColor: COLORS.errorLight,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.error,
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
  },
});
