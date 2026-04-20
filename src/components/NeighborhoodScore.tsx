// src/components/NeighborhoodScore.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Shield, Lightbulb, Droplets, Volume2, ShoppingCart, Star } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';

interface ScoreRowProps {
  label: string;
  score: number;
  icon: React.ReactNode;
}

const ScoreRow: React.FC<ScoreRowProps> = ({ label, score, icon }) => (
  <View style={styles.row}>
    <View style={styles.rowLabel}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          fill={s <= score ? COLORS.teal : 'transparent'}
          color={s <= score ? COLORS.teal : COLORS.bgDeep}
        />
      ))}
    </View>
  </View>
);

interface NeighborhoodScoreProps {
  scores: {
    safety: number;
    electricity: number;
    water: number;
    noise: number;
    market: number;
  };
  reviewCount: number;
  onRatePress?: () => void;
}

export const NeighborhoodScore: React.FC<NeighborhoodScoreProps> = ({ 
  scores, 
  reviewCount,
  onRatePress 
}) => {
  const average = (
    (scores.safety + scores.electricity + scores.water + scores.noise + scores.market) / 5
  ).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={[TEXT.h3, styles.title]}>Neighborhood Score</Text>
          <Text style={styles.source}>Based on {reviewCount} student reviews</Text>
        </View>
        <View style={styles.avgBadge}>
          <Text style={styles.avgValue}>{average}</Text>
          <Text style={styles.avgTotal}>/5</Text>
        </View>
      </View>

      <View style={styles.scoresList}>
        <ScoreRow label="Safety" score={scores.safety} icon={<Shield size={16} color={COLORS.inkMid} />} />
        <ScoreRow label="Electricity" score={scores.electricity} icon={<Lightbulb size={16} color={COLORS.inkMid} />} />
        <ScoreRow label="Water" score={scores.water} icon={<Droplets size={16} color={COLORS.inkMid} />} />
        <ScoreRow label="Noise" score={scores.noise} icon={<Volume2 size={16} color={COLORS.inkMid} />} />
        <ScoreRow label="Market Access" score={scores.market} icon={<ShoppingCart size={16} color={COLORS.inkMid} />} />
      </View>

      <Pressable onPress={onRatePress} style={styles.cta}>
        <Text style={styles.ctaText}>Rate this area →</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  title: {
    color: COLORS.ink,
    marginBottom: 2,
  },
  source: {
    ...TEXT.bodySmall,
    color: COLORS.inkLight,
  },
  avgBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: COLORS.bgDeep,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  avgValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
    color: COLORS.navy,
  },
  avgTotal: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.inkLight,
    marginLeft: 2,
  },
  scoresList: {
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.inkMid,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  cta: {
    marginTop: SPACING.sm,
  },
  ctaText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.terracotta,
  },
});
