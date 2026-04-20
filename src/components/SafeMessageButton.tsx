// src/components/SafeMessageButton.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';

interface SafeMessageButtonProps {
  onPress: () => void;
}

export const SafeMessageButton: React.FC<SafeMessageButtonProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]} 
        onPress={onPress}
      >
        <MessageCircle size={18} color={COLORS.white} style={styles.icon} />
        <Text style={styles.buttonText}>Message Landlord</Text>
      </Pressable>
      <Text style={[TEXT.bodySmall, styles.subText]}>
        📱 Phone shared only on mutual consent
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.terracotta,
    height: 54,
    borderRadius: RADIUS.md,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
  },
  subText: {
    color: COLORS.inkLight,
    textAlign: 'center',
  },
});
