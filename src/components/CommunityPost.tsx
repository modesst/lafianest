// src/components/CommunityPost.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AlertCircle, MessageSquare, Flag, ChevronDown, ChevronUp } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { CommunityPost as CommunityPostType } from '../types';
import { UniversityTag } from './UniversityTag';

interface CommunityPostProps {
  post: CommunityPostType;
  onReport?: () => void;
  onReply?: () => void;
}

export const CommunityPost: React.FC<CommunityPostProps> = ({ 
  post, 
  onReport,
  onReply 
}) => {
  const [expanded, setExpanded] = useState(false);
  const isScamAlert = post.tag === 'scam_alert';

  return (
    <View style={[styles.container, isScamAlert && styles.scamAlertContainer]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <UniversityTag universityKey={post.university} />
          <Text style={styles.timeText}>
            {new Date(post.created_at).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.tagRow}>
          <View style={[styles.tagPill, isScamAlert && styles.scamTagPill]}>
            {isScamAlert && <AlertCircle size={12} color={COLORS.error} style={{ marginRight: 4 }} />}
            <Text style={[styles.tagText, isScamAlert && styles.scamTagText]}>
              {post.tag.replace('_', ' ').toUpperCase()}
            </Text>
          </View>
          {!post.is_removed && post.tag === 'scam_alert' && (
            <View style={styles.reviewBadge}>
              <Text style={styles.reviewText}>Under Review</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <Text 
          style={[TEXT.body, styles.content]} 
          numberOfLines={expanded ? undefined : 3}
        >
          {post.content}
        </Text>
        
        {post.content.length > 120 && (
          <Pressable onPress={() => setExpanded(!expanded)} style={styles.expandButton}>
            <Text style={styles.expandText}>{expanded ? 'Read less' : 'Read more'}</Text>
          </Pressable>
        )}

        {isScamAlert && (post.scam_landlord_name || post.scam_area) && (
          <View style={styles.scamDetails}>
            <Text style={styles.scamDetailText}>
              <Text style={{ fontFamily: FONTS.bodyBold }}>Landlord:</Text> {post.scam_landlord_name || 'Not specified'}
            </Text>
            <Text style={styles.scamDetailText}>
              <Text style={{ fontFamily: FONTS.bodyBold }}>Area:</Text> {post.scam_area || 'Not specified'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.actionButton} onPress={onReply}>
          <MessageSquare size={16} color={COLORS.inkLight} />
          <Text style={styles.actionText}>Reply</Text>
        </Pressable>
        
        <Pressable style={styles.reportButton} onPress={onReport}>
          <Flag size={14} color={COLORS.inkFaint} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  scamAlertContainer: {
    backgroundColor: COLORS.errorLight,
    borderColor: COLORS.error + '40', // 25% opacity error color
  },
  header: {
    marginBottom: SPACING.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    ...TEXT.bodySmall,
    color: COLORS.inkFaint,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.sm,
  },
  scamTagPill: {
    backgroundColor: COLORS.error + '20', // 12% opacity
  },
  tagText: {
    ...TEXT.badge,
    color: COLORS.inkMid,
    fontSize: 10,
  },
  scamTagText: {
    color: COLORS.error,
    fontFamily: FONTS.bodyBold,
  },
  reviewBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.inkFaint,
  },
  reviewText: {
    fontSize: 10,
    fontFamily: FONTS.body,
    color: COLORS.inkFaint,
  },
  body: {
    marginBottom: SPACING.md,
  },
  content: {
    color: COLORS.ink,
    lineHeight: 22,
  },
  expandButton: {
    marginTop: 4,
  },
  expandText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.terracotta,
  },
  scamDetails: {
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: RADIUS.sm,
    gap: 4,
  },
  scamDetailText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.error,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.inkLight,
  },
  reportButton: {
    padding: 4,
  },
});
