// src/components/LandlordTrustScore.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { FONTS } from '../constants/typography';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface LandlordTrustScoreProps {
  score: number;
  size?: number;
  showLabel?: boolean;
}

export const LandlordTrustScore: React.FC<LandlordTrustScoreProps> = ({ 
  score, 
  size = 80,
  showLabel = true
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: score,
      duration: 800,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false, // strokeDashoffset is not supported by native driver
    }).start();
  }, [score]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const getScoreColor = () => {
    if (score <= 40) return COLORS.error;
    if (score <= 70) return COLORS.gold;
    return COLORS.teal;
  };

  const scoreColor = getScoreColor();

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={COLORS.bgDeep}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <AnimatedCircle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={scoreColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        </Svg>
        <View style={[StyleSheet.absoluteFill, styles.centerText]}>
          <Text style={[styles.scoreText, { fontSize: size * 0.25 }]}>
            {score}
          </Text>
          <Text style={[styles.totalText, { fontSize: size * 0.12 }]}>
            /100
          </Text>
        </View>
      </View>

      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>TRUST SCORE</Text>
          {score >= 71 && (
            <Text style={styles.trustedText}>Highly Trusted ✓</Text>
          )}
          {score <= 40 && (
            <Text style={styles.cautionText}>⚠️ Proceed with caution</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  scoreText: {
    fontFamily: FONTS.displayBold,
    color: COLORS.ink,
  },
  totalText: {
    fontFamily: FONTS.body,
    color: COLORS.inkLight,
    marginTop: 4,
    marginLeft: 1,
  },
  labelContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.bodySemi,
    fontSize: 10,
    color: COLORS.inkLight,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  trustedText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 12,
    color: COLORS.teal,
    marginTop: 2,
  },
  cautionText: {
    fontFamily: FONTS.body, // Changed from bodySmall
    fontSize: 12,
    color: COLORS.error,
    marginTop: 2,
  },
});
