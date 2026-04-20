// src/screens/PropertyDetailScreen.tsx
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Pressable, 
  Dimensions, 
  SafeAreaView,
  Alert
} from 'react-native';
import { 
  ChevronLeft, 
  Share2, 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Calendar, 
  Play,
  ShieldCheck,
  User
} from 'lucide-react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { useFilterStore } from '../store/filterStore';
import { PriceTag } from '../components/PriceTag';
import { VerifiedBadge } from '../components/VerifiedBadge';
import { DistanceBadge } from '../components/DistanceBadge';
import { UniversityTag } from '../components/UniversityTag';
import { MoveInChecklist } from '../components/MoveInChecklist';
import { AffordabilityMeter } from '../components/AffordabilityMeter';
import { RentHistoryTimeline } from '../components/RentHistoryTimeline';
import { NeighborhoodScore } from '../components/NeighborhoodScore';
import { LandlordTrustScore } from '../components/LandlordTrustScore';
import { SafeMessageButton } from '../components/SafeMessageButton';
import { ScamReportButton } from '../components/ScamReportButton';
import { ViewingScheduler } from '../components/ViewingScheduler';
import { UniversityKey } from '../constants/universities';
import { useAuthStore } from '../store/authStore';
import { useViewingStore } from '../store/viewingStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const PropertyDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { listing } = route.params;
  const { activeUniversity } = useFilterStore();
  const { user, updateProfile } = useAuthStore();
  const { scheduleViewing } = useViewingStore();
  
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  if (!listing) return null;

  const neighborhoodScores = {
    safety: 4, electricity: 3, water: 5, noise: 2, market: 4,
  };

  const handleBack = () => navigation.goBack();

  const handleSchedulePress = () => {
    sheetRef.current?.snapToIndex(0);
  };

  const handleConfirmViewing = async (data: any) => {
    try {
      await scheduleViewing({
        listing_id: listing.id,
        landlord_id: listing.owner_id,
        scheduled_at: data.date.toISOString(),
        friend_name: data.friendName,
        friend_phone: data.friendPhone,
        friend_notified: !!data.friendName,
      });
      sheetRef.current?.close();
      Alert.alert("Viewing Scheduled", "The landlord has been notified. Stay safe!");
    } catch (error) {
      Alert.alert("Error", "Could not schedule viewing. Please try again.");
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Photo Gallery */}
        <View style={styles.galleryContainer}>
          <Image 
            source={{ uri: listing.photos[0] || 'https://via.placeholder.com/400x300' }} 
            style={styles.mainImage}
          />
          <View style={styles.galleryOverlay}>
            <View style={styles.topActions}>
              <Pressable style={styles.circleButton} onPress={handleBack}>
                <ChevronLeft size={24} color={COLORS.navy} />
              </Pressable>
              <View style={styles.rightActions}>
                <Pressable style={styles.circleButton}>
                  <Share2 size={20} color={COLORS.navy} />
                </Pressable>
                <Pressable style={styles.circleButton}>
                  <Heart size={20} color={COLORS.navy} />
                </Pressable>
              </View>
            </View>
            <View style={styles.photoCount}>
              <Text style={styles.photoCountText}>1/{listing.photos.length || 1}</Text>
            </View>
          </View>
        </View>

        {/* Price Header */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <PriceTag amount={listing.rent} frequency={listing.payment_frequency} size="large" />
            {listing.is_verified && <VerifiedBadge />}
          </View>
          
          <Text style={[TEXT.h2, styles.title]}>{listing.title}</Text>
          
          <View style={styles.locationRow}>
            <MapPin size={16} color={COLORS.terracotta} />
            <Text style={[TEXT.body, styles.address]} numberOfLines={2}>
              {listing.address}
            </Text>
          </View>

          <View style={styles.distanceRow}>
            <DistanceBadge lat={listing.lat} lng={listing.lng} universityKey={activeUniversity} />
            <View style={styles.uniTags}>
              {listing.university_tags.map((tag: UniversityKey) => (
                <UniversityTag key={tag} universityKey={tag} />
              ))}
            </View>
          </View>

          {/* Info Pills Row */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.infoPills}>
            <View style={styles.infoPill}>
              <Bed size={16} color={COLORS.navy} />
              <Text style={styles.infoPillText}>{listing.beds || 1} Beds</Text>
            </View>
            <View style={styles.infoPill}>
              <Bath size={16} color={COLORS.navy} />
              <Text style={styles.infoPillText}>{listing.baths || 1} Bath</Text>
            </View>
            <View style={styles.infoPill}>
              <Calendar size={16} color={COLORS.navy} />
              <Text style={styles.infoPillText}>{listing.payment_frequency}</Text>
            </View>
          </ScrollView>

          {/* About */}
          <View style={styles.section}>
            <Text style={[TEXT.h3, styles.sectionTitle]}>About this Property</Text>
            <Text 
              style={[TEXT.body, styles.description]} 
              numberOfLines={isAboutExpanded ? undefined : 3}
            >
              {listing.description || 'No description provided.'}
            </Text>
            <Pressable onPress={() => setIsAboutExpanded(!isAboutExpanded)}>
              <Text style={styles.expandLink}>
                {isAboutExpanded ? 'Read less' : 'Read more'}
              </Text>
            </Pressable>
          </View>

          {/* Move-In Checklist */}
          <View style={styles.section}>
            <MoveInChecklist 
              checklist={listing.move_in_checklist || {}} 
              lastConfirmedAt={listing.last_confirmed_at}
            />
          </View>

          {/* Affordability Meter */}
          <View style={styles.section}>
            <AffordabilityMeter 
              rentAmount={listing.rent} 
              paymentFrequency={listing.payment_frequency} 
              monthlyBudget={user?.monthly_budget || null}
              onSetBudget={(budget) => updateProfile({ monthly_budget: budget })}
            />
          </View>

          {/* Rent History */}
          <View style={styles.section}>
            <RentHistoryTimeline history={listing.rent_history || []} />
          </View>

          {/* Neighborhood */}
          <View style={styles.section}>
            <NeighborhoodScore 
              scores={neighborhoodScores} 
              reviewCount={12} 
            />
          </View>

          {/* About Landlord */}
          <View style={styles.section}>
            <Text style={[TEXT.h3, styles.sectionTitle]}>About the Landlord</Text>
            <View style={styles.landlordRow}>
              <View style={styles.landlordInfo}>
                <View style={styles.landlordAvatar}>
                  <User size={24} color={COLORS.navy} />
                </View>
                <View>
                  <Text style={styles.landlordName}>Listing Owner</Text>
                  <Text style={styles.landlordMeta}>Verified Member</Text>
                </View>
              </View>
              <LandlordTrustScore score={82} size={60} />
            </View>
          </View>

          {/* Schedule Viewing */}
          <Pressable style={styles.scheduleButton} onPress={handleSchedulePress}>
            <Calendar size={18} color={COLORS.navy} />
            <Text style={styles.scheduleButtonText}>📅 Schedule a Viewing</Text>
          </Pressable>

          <ScamReportButton onPress={() => {}} />
          
          <Text style={styles.disclaimer}>
            LafiaNest is a platform for students and landlords. Always verify properties in person before making payments.
          </Text>

        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPrice}>
          <PriceTag amount={listing.rent} frequency={listing.payment_frequency} />
        </View>
        <View style={styles.messageButtonWrapper}>
          <SafeMessageButton onPress={() => {}} />
        </View>
      </View>

      {/* Viewing Bottom Sheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: COLORS.border }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <ViewingScheduler 
            onConfirm={handleConfirmViewing}
            onCancel={() => sheetRef.current?.close()}
          />
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  galleryContainer: {
    height: 280,
    width: '100%',
    position: 'relative',
  },
  mainImage: {
    ...StyleSheet.absoluteFillObject,
  },
  galleryOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: SPACING.md,
    justifyContent: 'space-between',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.subtle,
  },
  photoCount: {
    position: 'absolute',
    bottom: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  photoCountText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.bodySemi,
  },
  content: {
    padding: SPACING.page,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: COLORS.ink,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  address: {
    flex: 1,
    color: COLORS.inkMid,
    lineHeight: 22,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  uniTags: {
    flexDirection: 'row',
    gap: 6,
  },
  infoPills: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.bgDeep,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    marginRight: 10,
  },
  infoPillText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.navy,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 12,
    color: COLORS.ink,
  },
  description: {
    color: COLORS.inkMid,
    lineHeight: 24,
  },
  expandLink: {
    marginTop: 4,
    color: COLORS.terracotta,
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
  },
  landlordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  landlordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  landlordAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landlordName: {
    fontFamily: FONTS.bodyBold,
    fontSize: 16,
    color: COLORS.ink,
  },
  landlordMeta: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.inkLight,
  },
  scheduleButton: {
    flexDirection: 'row',
    height: 54,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: COLORS.navy,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  scheduleButtonText: {
    fontFamily: FONTS.bodyBold,
    fontSize: 15,
    color: COLORS.navy,
  },
  disclaimer: {
    marginTop: 24,
    textAlign: 'center',
    ...TEXT.bodySmall,
    color: COLORS.inkFaint,
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.page,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...SHADOW.float,
  },
  bottomPrice: {
    flex: 1,
  },
  messageButtonWrapper: {
    flex: 2,
  },
});
