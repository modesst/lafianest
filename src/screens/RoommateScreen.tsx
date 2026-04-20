// src/screens/RoommateScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  FlatList, 
  SafeAreaView,
  Dimensions,
  TextInput
} from 'react-native';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  ChevronRight,
  User
} from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { UNIVERSITY_LIST } from '../constants/universities';
import { useRoommateStore } from '../store/roommateStore';
import { useAuthStore } from '../store/authStore';
import { RoommateCard } from '../components/RoommateCard';
import { FilterChip } from '../components/FilterChip';
import { EmptyState } from '../components/EmptyState';
import { AnimatedWrapper } from '../components/AnimatedWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Tab = 'browse' | 'my_post';

export const RoommateScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  const { posts, isLoading, fetchPosts, myPost } = useRoommateStore();
  const { user } = useAuthStore();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = activeFilter === 'All' 
    ? posts 
    : posts.filter(p => p.university === activeFilter.toLowerCase());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[TEXT.h1, styles.headerTitle]}>Find a Roommate</Text>
        <Text style={[TEXT.body, styles.headerSubtitle]}>
          Connect with students looking to split rent
        </Text>
      </View>

      <View style={styles.tabBar}>
        <Pressable 
          style={[styles.tab, activeTab === 'browse' && styles.activeTab]} 
          onPress={() => setActiveTab('browse')}
        >
          <Text style={[styles.tabText, activeTab === 'browse' && styles.activeTabText]}>Browse Posts</Text>
        </Pressable>
        <Pressable 
          style={[styles.tab, activeTab === 'my_post' && styles.activeTab]} 
          onPress={() => setActiveTab('my_post')}
        >
          <Text style={[styles.tabText, activeTab === 'my_post' && styles.activeTabText]}>My Post</Text>
        </Pressable>
      </View>

      <AnimatedWrapper style={{ flex: 1 }}>
        {activeTab === 'browse' ? (
          <View style={{ flex: 1 }}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.filtersRow}
              contentContainerStyle={{ paddingHorizontal: SPACING.page }}
            >
              <FilterChip 
                label="All" 
                isActive={activeFilter === 'All'} 
                onPress={() => setActiveFilter('All')} 
              />
              {UNIVERSITY_LIST.map(uni => (
                <FilterChip 
                  key={uni.id}
                  label={uni.shortName} 
                  isActive={activeFilter === uni.shortName} 
                  onPress={() => setActiveFilter(uni.shortName)} 
                />
              ))}
            </ScrollView>

            <FlatList
              data={filteredPosts}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={() => (
                <View style={styles.safetyNotice}>
                  <AlertTriangle size={20} color={COLORS.gold} />
                  <Text style={styles.safetyText}>
                    Never send money to a potential roommate before meeting in person.
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <View style={{ paddingHorizontal: SPACING.page }}>
                  <RoommateCard post={item} />
                </View>
              )}
              ListEmptyComponent={() => (
                <EmptyState 
                  emoji="👥"
                  heading="No posts found"
                  subtext="Be the first to post looking for a roommate on this campus"
                  ctaLabel="Create Post"
                  onCta={() => setActiveTab('my_post')}
                />
              )}
              contentContainerStyle={styles.listPadding}
            />
          </View>
        ) : (
          <View style={styles.myPostContainer}>
            {myPost ? (
              <View style={styles.myPostWrapper}>
                <Text style={styles.sectionLabel}>Your active post</Text>
                <RoommateCard post={myPost} />
                <View style={styles.postActions}>
                  <Pressable style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Post</Text>
                  </Pressable>
                  <Pressable style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <EmptyState 
                emoji="✨"
                heading="No active post"
                subtext="Looking for a roommate? Create a post to let others know."
                ctaLabel="Create My Post"
                onCta={() => {}}
              />
            )}
          </View>
        )}
      </AnimatedWrapper>

      {/* Create FAB */}
      {activeTab === 'browse' && (
        <Pressable style={styles.fab} onPress={() => setActiveTab('my_post')}>
          <Plus size={24} color={COLORS.white} />
        </Pressable>
      )}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.page,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingVertical: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.navy,
  },
  tabText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.inkLight,
  },
  activeTabText: {
    color: COLORS.navy,
  },
  filtersRow: {
    paddingVertical: 12,
    maxHeight: 64,
  },
  listPadding: {
    paddingBottom: 100,
  },
  safetyNotice: {
    flexDirection: 'row',
    backgroundColor: COLORS.goldLight,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: SPACING.page,
    marginBottom: 20,
    marginTop: 8,
    gap: 12,
    alignItems: 'center',
  },
  safetyText: {
    flex: 1,
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.gold,
    lineHeight: 18,
  },
  myPostContainer: {
    flex: 1,
    padding: SPACING.page,
  },
  myPostWrapper: {
    gap: 16,
  },
  sectionLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.inkLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  postActions: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 2,
    height: 48,
    backgroundColor: COLORS.navy,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.bodySemi,
  },
  deleteButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.error,
    fontFamily: FONTS.bodySemi,
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
