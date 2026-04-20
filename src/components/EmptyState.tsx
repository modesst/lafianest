// src/components/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { TEXT } from '../constants/typography';

interface EmptyStateProps {
  emoji: string;
  heading: string;
  subtext: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji,
  heading,
  subtext,
  ctaLabel,
  onCta,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[TEXT.h2, styles.heading]}>{heading}</Text>
      <Text style={[TEXT.body, styles.subtext]}>{subtext}</Text>
      
      {ctaLabel && onCta && (
        <Pressable 
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed
          ]} 
          onPress={onCta}
        >
          <Text style={styles.buttonText}>{ctaLabel}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xxl,
    minHeight: 300,
  },
  emoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  heading: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtext: {
    textAlign: 'center',
    color: COLORS.inkLight,
    marginBottom: SPACING.xl,
  },
  button: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: TEXT.h3.fontFamily,
    fontSize: 15,
    fontWeight: '600',
  },
});
