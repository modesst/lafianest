// src/screens/CommunityScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Pencil, Plus, AlertCircle, Info } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { UNIVERSITY_LIST, UniversityKey } from '../constants/universities';
import { useCommunityStore } from '../store/communityStore';
import { useAuthStore } from '../store/authStore';
import { CommunityPost } from '../components/CommunityPost';
import { FilterChip } from '../components/FilterChip';
import { EmptyState } from '../components/EmptyState';

type CommunityTab = 'all' | 'room_available' | 'splitting_costs' | 'scam_alert' | 'looking_for_room';

const TABS: { id: CommunityTab; label: string; icon?: any }[] = [
  { id: 'all', label: 'All' },
  { id: 'scam_alert', label: '⚠️ Scam Alerts' },
  { id: 'room_available', label: 'Room Available' },
  { id: 'splitting_costs', label: 'Splitting Costs' },
  { id: 'looking_for_room', label: 'Looking for Room' },
];

export const CommunityScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CommunityTab>('all');
  const { posts, isLoading, fetchPosts, activeTag } = useCommunityStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchPosts(undefined, activeTab === 'all' ? undefined : activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[TEXT.h1, styles.headerTitle]}>Community Board</Text>
        <Text style={[TEXT.body, styles.headerSubtitle]}>
          Housing tips & scam alerts from students
        </Text>
      </View>

      <View style={styles.tabsWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabsContainer}
        >
          {TABS.map((tab) => (
            <Pressable
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.postWrapper}>
            <CommunityPost 
              post={item} 
              onReport={() => {}}
              onReply={() => {}}
            />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            emoji="💬"
            heading="No posts yet"
            subtext="Be the first to share something with the student community"
            ctaLabel="Create Post"
            onCta={() => {}}
          />
        )}
        contentContainerStyle={styles.listPadding}
        refreshing={isLoading}
        onRefresh={() => fetchPosts(undefined, activeTab === 'all' ? undefined : activeTab)}
      />

      <Pressable style={styles.fab} onPress={() => {}}>
        <Pencil size={24} color={COLORS.white} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    padding: SPACING.page,
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    color: COLORS.navy,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: COLORS.inkLight,
  },
  tabsWrapper: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tabsContainer: {
    paddingHorizontal: SPACING.page,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.bgDeep,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activeTab: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  tabText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.inkMid,
  },
  activeTabText: {
    color: COLORS.white,
  },
  listPadding: {
    padding: SPACING.page,
    paddingBottom: 100,
  },
  postWrapper: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.terracotta,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.float,
  },
});
