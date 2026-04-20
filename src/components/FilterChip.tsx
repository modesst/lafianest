// src/components/FilterChip.tsx
import React, { useRef, useEffect } from 'react';
import { Text, Pressable, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW } from '../constants/layout';
import { FONTS } from '../constants/typography';

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, isActive, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(colorAnim, {
      toValue: isActive ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // Color interpolation doesn't support native driver
    }).start();
  }, [isActive]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.bgDeep, COLORS.navy],
  });

  const textColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.inkMid, COLORS.white],
  });

  const borderColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.navy],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.container,
          isActive && SHADOW.subtle,
        ]}
      >
        <Animated.View style={[
          StyleSheet.absoluteFill, 
          { backgroundColor, borderColor, borderWidth: 1, borderRadius: RADIUS.pill }
        ]} />
        <Animated.Text style={[styles.text, { color: textColor }]}>
          {label}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  text: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
  },
});
