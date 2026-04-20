// src/components/RoommateCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { RoommatePost } from '../types';
import { UniversityTag } from './UniversityTag';
import { PriceTag } from './PriceTag';

interface RoommateCardProps {
  post: RoommatePost;
  onMessage?: () => void;
}

export const RoommateCard: React.FC<RoommateCardProps> = ({ post, onMessage }) => {
  const firstName = post.user_name?.split(' ')[0] || 'Student';
  const initials = firstName.substring(0, 1).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <UniversityTag universityKey={post.university} />
          <Text style={styles.nameText}>{firstName} · {post.academic_level}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.budgetRow}>
          <Text style={styles.budgetLabel}>Budget:</Text>
          <PriceTag amount={post.monthly_budget} frequency="monthly" />
        </View>

        <View style={styles.tagsRow}>
          {post.lifestyle_tags.slice(0, 3).map(tag => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.timeText}>
            Posted {new Date(post.created_at).toLocaleDateString()}
          </Text>
          <Pressable 
            style={({ pressed }) => [
              styles.messageButton,
              pressed && styles.buttonPressed
            ]}
            onPress={onMessage}
          >
            <Text style={styles.messageButtonText}>Message</Text>
          </Pressable>
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
    padding: SPACING.md,
    marginBottom: SPACING.md,
    width: 280,
    marginRight: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarText: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    color: COLORS.navy,
  },
  headerInfo: {
    flex: 1,
    gap: 4,
  },
  nameText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.ink,
  },
  body: {
    gap: SPACING.md,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  budgetLabel: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.inkLight,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.bg,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagText: {
    ...TEXT.badge,
    color: COLORS.inkMid,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  timeText: {
    ...TEXT.bodySmall,
    color: COLORS.inkFaint,
  },
  messageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.terracotta,
  },
  buttonPressed: {
    backgroundColor: COLORS.terracottaLight,
  },
  messageButtonText: {
    color: COLORS.terracotta,
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
  },
});
