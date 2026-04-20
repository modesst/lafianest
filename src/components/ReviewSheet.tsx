// src/components/ReviewSheet.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView } from 'react-native';
import { Star, Shield, Lightbulb, Droplets, Volume2, ShoppingCart } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING, SHADOW } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';

interface ReviewSheetProps {
  areaName: string;
  onSubmit: (scores: any) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { key: 'safety', label: 'Safety', icon: <Shield size={18} /> },
  { key: 'electricity', label: 'Electricity', icon: <Lightbulb size={18} /> },
  { key: 'water', label: 'Water', icon: <Droplets size={18} /> },
  { key: 'noise', label: 'Noise Level', icon: <Volume2 size={18} /> },
  { key: 'market', label: 'Market Access', icon: <ShoppingCart size={18} /> },
];

export const ReviewSheet: React.FC<ReviewSheetProps> = ({ areaName, onSubmit, onCancel }) => {
  const [scores, setScores] = useState<Record<string, number>>({
    safety: 0, electricity: 0, water: 0, noise: 0, market: 0,
  });
  const [comment, setComment] = useState('');

  const handleScore = (key: string, value: number) => {
    setScores(prev => ({ ...prev, [key]: value }));
  };

  const isReady = Object.values(scores).every(s => s > 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={[TEXT.h2, styles.title]}>Rate {areaName}</Text>
      <Text style={[TEXT.body, styles.subtitle]}>Your review helps other students find safe homes.</Text>

      <View style={styles.categories}>
        {CATEGORIES.map(cat => (
          <View key={cat.key} style={styles.categoryRow}>
            <View style={styles.catLabel}>
              {React.cloneElement(cat.icon as React.ReactElement, { color: COLORS.navy })}
              <Text style={styles.labelText}>{cat.label}</Text>
            </View>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map(s => (
                <Pressable key={s} onPress={() => handleScore(cat.key, s)} style={styles.starPress}>
                  <Star 
                    size={24} 
                    fill={s <= scores[cat.key] ? COLORS.teal : 'transparent'} 
                    color={s <= scores[cat.key] ? COLORS.teal : COLORS.border} 
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.fieldLabel}>Additional Comments (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="How is the security? Are there many scams here?"
        placeholderTextColor={COLORS.inkFaint}
        multiline
        numberOfLines={4}
        value={comment}
        onChangeText={setComment}
      />

      <View style={styles.footer}>
        <Pressable style={styles.ghostButton} onPress={onCancel}>
          <Text style={styles.ghostButtonText}>Cancel</Text>
        </Pressable>
        <Pressable 
          style={[styles.primaryButton, !isReady && styles.disabledButton]} 
          onPress={() => isReady && onSubmit({ ...scores, comment })}
          disabled={!isReady}
        >
          <Text style={styles.primaryButtonText}>Submit Review</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  title: {
    color: COLORS.navy,
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.inkLight,
    marginBottom: 32,
  },
  categories: {
    gap: 20,
    marginBottom: 32,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  labelText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.ink,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  starPress: {
    padding: 2,
  },
  fieldLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.inkLight,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.md,
    padding: 16,
    height: 100,
    textAlignVertical: 'top',
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.ink,
    marginBottom: 32,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  ghostButton: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostButtonText: {
    fontFamily: FONTS.bodySemi,
    color: COLORS.inkLight,
    fontSize: 15,
  },
  primaryButton: {
    flex: 2,
    backgroundColor: COLORS.navy,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.subtle,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
  },
});
