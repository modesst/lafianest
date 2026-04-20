// src/screens/StudentHomeScreen.tsx
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  TextInput, 
  FlatList, 
  SafeAreaView,
  Dimensions
} from 'react-native';
import { 
  Bell, 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Plus,
  ShieldCheck,
  User,
  ChevronDown
} from 'lucide-react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { UNIVERSITIES, UNIVERSITY_LIST, UniversityKey } from '../constants/universities';
import { useAuthStore } from '../store/authStore';
import { useListingsStore } from '../store/listingsStore';
import { useFilterStore } from '../store/filterStore';
import { useRoommateStore } from '../store/roommateStore';
import { PropertyCard } from '../components/PropertyCard';
import { SectionHeader } from '../components/SectionHeader';
import { FilterChip } from '../components/FilterChip';
import { SkeletonCard } from '../components/SkeletonCard';
import { RoommateCard } from '../components/RoommateCard';
import { LandlordTrustScore } from '../components/LandlordTrustScore';
import { AnimatedWrapper } from '../components/AnimatedWrapper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StudentHomeScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuthStore();
  const { listings, isLoading, fetchListings } = useListingsStore();
  const { activeUniversity, setActiveUniversity } = useFilterStore();
  const { posts, fetchPosts } = useRoommateStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const universitySheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  useEffect(() => {
    fetchListings();
    fetchPosts(activeUniversity);
  }, [activeUniversity]);

  const activeUniData = UNIVERSITIES[activeUniversity];

  const nearUniListings = listings.filter(l => 
    l.university_tags.includes(activeUniversity)
  );

  const recentlyAdded = [...listings].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 5);

  const noIncrementListings = listings.filter(l => l.no_increment_pledge);

  const trustedLandlords = [
    { id: '1', name: 'Alhaji Bako', score: 92, listings: 4 },
    { id: '2', name: 'Madam Grace', score: 85, listings: 2 },
    { id: '3', name: 'Engr. Yusuf', score: 78, listings: 7 },
  ];

  const handleUniversityPress = () => universitySheetRef.current?.snapToIndex(0);

  const selectUniversity = (key: UniversityKey) => {
    setActiveUniversity(key);
    universitySheetRef.current?.close();
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <Plus size={16} color={COLORS.white} />
            </View>
            <Text style={styles.logoText}>LafiaNest</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton}>
              <Bell size={22} color={COLORS.navy} />
              <View style={styles.notifDot} />
            </Pressable>
            <Pressable style={styles.avatarCircle} onPress={() => navigation.navigate('Profile')}>
              <User size={20} color={COLORS.navy} />
            </Pressable>
          </View>
        </View>
        
        <Pressable style={styles.locationSubRow} onPress={handleUniversityPress}>
          <MapPin size={14} color={COLORS.terracotta} />
          <Text style={styles.locationText}>
            {activeUniData.city} — {activeUniData.shortName}
          </Text>
          <ChevronDown size={14} color={COLORS.inkLight} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AnimatedWrapper>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color={COLORS.inkLight} style={{ marginRight: 12 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search area, price, type…"
                placeholderTextColor={COLORS.inkFaint}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Pressable style={styles.filterButton}>
              <SlidersHorizontal size={20} color={COLORS.white} />
            </Pressable>
          </View>

          {/* Filter Chips */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filterChipsRow}
            contentContainerStyle={{ paddingHorizontal: SPACING.page }}
          >
            <FilterChip label="All" isActive={true} onPress={() => {}} />
            <FilterChip label="Self-contain" isActive={false} onPress={() => {}} />
            <FilterChip label="Room & Parlour" isActive={false} onPress={() => {}} />
            <FilterChip label="Flat" isActive={false} onPress={() => {}} />
            <FilterChip label="Under ₦30k" isActive={false} onPress={() => {}} />
            <FilterChip label="Verified" isActive={false} onPress={() => {}} />
          </ScrollView>

          {/* Sections */}
          <View style={styles.pagePadding}>
            
            <SectionHeader 
              label={`Near ${activeUniData.shortName}`} 
              onSeeAll={() => navigation.navigate('Map')}
            />
            {isLoading ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {[1, 2].map(i => (
                  <View key={i} style={{ width: SCREEN_WIDTH * 0.72, marginRight: SPACING.md }}>
                    <SkeletonCard />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <FlatList
                data={nearUniListings}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <PropertyCard 
                    listing={item} 
                    activeUniversityKey={activeUniversity} 
                    horizontal 
                    onPress={() => navigation.navigate('PropertyDetail', { listing: item })}
                  />
                )}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={{ width: SPACING.md }} />}
              />
            )}

            <SectionHeader 
              label="Recently Added" 
              onSeeAll={() => navigation.navigate('Map')}
            />
            {isLoading ? (
              [1, 2, 3].map(i => <SkeletonCard key={i} />)
            ) : (
              recentlyAdded.map(item => (
                <PropertyCard 
                  key={item.id}
                  listing={item} 
                  activeUniversityKey={activeUniversity} 
                  onPress={() => navigation.navigate('PropertyDetail', { listing: item })}
                />
              ))
            )}

            <View style={styles.pledgeSection}>
              <View style={styles.pledgeHeaderRow}>
                <ShieldCheck size={18} color={COLORS.terracotta} />
                <SectionHeader label="No-Increment Pledge Homes" showSeeAll={false} />
              </View>
              <FlatList
                data={noIncrementListings}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <PropertyCard 
                    listing={item} 
                    activeUniversityKey={activeUniversity} 
                    horizontal 
                    onPress={() => navigation.navigate('PropertyDetail', { listing: item })}
                  />
                )}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={() => <View style={{ width: SPACING.md }} />}
              />
            </View>

            <SectionHeader 
              label="Find a Roommate" 
              onSeeAll={() => navigation.navigate('Roommate')}
            />
            <FlatList
              data={posts.slice(0, 3)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <RoommateCard post={item} onMessage={() => navigation.navigate('Roommate')} />
              )}
              keyExtractor={item => item.id}
            />

            <SectionHeader label="Highly Trusted Landlords" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.landlordList}>
              {trustedLandlords.map(ll => (
                <View key={ll.id} style={styles.landlordCard}>
                  <View style={styles.landlordHeader}>
                    <View style={styles.landlordAvatar}>
                      <User size={24} color={COLORS.navy} />
                    </View>
                    <LandlordTrustScore score={ll.score} size={50} showLabel={false} />
                  </View>
                  <Text style={styles.landlordName}>{ll.name}</Text>
                  <Text style={styles.landlordListings}>{ll.listings} listings</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </AnimatedWrapper>
      </ScrollView>

      {/* University Switcher Sheet */}
      <BottomSheet
        ref={universitySheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: COLORS.border }}
      >
        <BottomSheetView style={styles.sheetContent}>
          <Text style={[TEXT.h3, styles.sheetTitle]}>Viewing listings near:</Text>
          <BottomSheetFlatList
            data={UNIVERSITY_LIST}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Pressable 
                style={[
                  styles.uniItem,
                  activeUniversity === item.id && styles.activeUniItem
                ]}
                onPress={() => selectUniversity(item.id)}
              >
                <View style={[styles.uniDot, { backgroundColor: item.color }]} />
                <Text style={[
                  styles.uniItemText,
                  activeUniversity === item.id && styles.activeUniItemText
                ]}>
                  {item.name} ({item.shortName})
                </Text>
                {activeUniversity === item.id && <ShieldCheck size={18} color={COLORS.navy} />}
              </Pressable>
            )}
            contentContainerStyle={styles.uniList}
          />
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.page,
    paddingTop: 8,
    paddingBottom: 12,
    ...SHADOW.subtle,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    color: COLORS.navy,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
    padding: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  locationSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.inkLight,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.page,
    marginTop: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDeep,
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.ink,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.subtle,
  },
  filterChipsRow: {
    marginBottom: 8,
  },
  pagePadding: {
    paddingHorizontal: SPACING.page,
  },
  pledgeSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  pledgeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  landlordList: {
    marginBottom: 20,
  },
  landlordCard: {
    width: 140,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    ...SHADOW.card,
    alignItems: 'center',
  },
  landlordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  landlordAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landlordName: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.ink,
    textAlign: 'center',
    marginBottom: 2,
  },
  landlordListings: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.inkLight,
  },
  sheetContent: {
    flex: 1,
    padding: SPACING.page,
  },
  sheetTitle: {
    color: COLORS.navy,
    marginBottom: 20,
  },
  uniList: {
    gap: 12,
  },
  uniItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    gap: 12,
  },
  activeUniItem: {
    backgroundColor: COLORS.bgDeep,
    borderWidth: 1,
    borderColor: COLORS.navy,
  },
  uniDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  uniItemText: {
    flex: 1,
    fontFamily: FONTS.bodySemi,
    fontSize: 15,
    color: COLORS.inkMid,
  },
  activeUniItemText: {
    color: COLORS.navy,
    fontFamily: FONTS.bodyBold,
  },
});
