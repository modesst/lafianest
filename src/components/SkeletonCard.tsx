// src/components/SkeletonCard.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';

const { width } = Dimensions.get('window');

export const SkeletonCard: React.FC = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
          <LinearGradient
            colors={[COLORS.bgDeep, COLORS.white, COLORS.bgDeep]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.priceRow}>
          <View style={styles.pricePlaceholder} />
          <View style={styles.typePlaceholder} />
        </View>
        <View style={styles.titlePlaceholder} />
        <View style={styles.locationPlaceholder} />
        <View style={styles.bottomRow}>
          <View style={styles.iconPlaceholder} />
          <View style={styles.iconPlaceholder} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: COLORS.bgDeep,
  },
  content: {
    padding: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  pricePlaceholder: {
    height: 24,
    width: '40%',
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.sm,
  },
  typePlaceholder: {
    height: 20,
    width: '25%',
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.pill,
  },
  titlePlaceholder: {
    height: 20,
    width: '80%',
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  locationPlaceholder: {
    height: 14,
    width: '60%',
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  iconPlaceholder: {
    height: 16,
    width: 32,
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.sm,
  },
});
