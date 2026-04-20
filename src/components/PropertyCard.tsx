// src/components/PropertyCard.tsx
import React, { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Pressable, 
  Animated, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MapPin, Bed, Bath } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT } from '../constants/typography';
import { UniversityKey } from '../constants/universities';
import { Listing } from '../types';
import { PriceTag } from './PriceTag';
import { DistanceBadge } from './DistanceBadge';
import { UniversityTag } from './UniversityTag';
import { VerifiedBadge } from './VerifiedBadge';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PropertyCardProps {
  listing: Listing;
  activeUniversityKey: UniversityKey;
  onPress?: () => void;
  horizontal?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  listing, 
  activeUniversityKey,
  onPress,
  horizontal = false
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  };

  const cardWidth = horizontal ? SCREEN_WIDTH * 0.72 : '100%';

  return (
    <Animated.View 
      style={[
        styles.container, 
        { width: cardWidth as any, transform: [{ scale: scaleAnim }] }
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressedShadow
        ]}
      >
        {/* Image Area */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: listing.photos[0] || 'https://via.placeholder.com/400x300?text=No+Image' }} 
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.45)']}
            style={styles.gradient}
          />
          
          {/* Top Overlays */}
          <View style={styles.topOverlays}>
            <DistanceBadge 
              lat={listing.lat} 
              lng={listing.lng} 
              universityKey={activeUniversityKey} 
            />
            <View style={styles.heartButton}>
              <Heart size={18} color={COLORS.navy} />
            </View>
          </View>

          {/* Bottom Overlays */}
          <View style={styles.bottomOverlays}>
            {listing.is_verified && <VerifiedBadge />}
            <View style={styles.universityTagsRow}>
              {listing.university_tags.slice(0, 2).map(tag => (
                <UniversityTag key={tag} universityKey={tag} />
              ))}
            </View>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.body}>
          <View style={styles.priceRow}>
            <PriceTag amount={listing.rent} frequency={listing.payment_frequency} />
            <View style={styles.typePill}>
              <Text style={styles.typeText}>
                {listing.property_type.replace('_', ' ')}
              </Text>
            </View>
          </View>

          <Text style={[TEXT.h3, styles.title]} numberOfLines={2}>
            {listing.title}
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={12} color={COLORS.terracotta} style={styles.locationIcon} />
            <Text style={[TEXT.bodySmall, styles.locationText]} numberOfLines={1}>
              {listing.address}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.amenities}>
              <View style={styles.amenityItem}>
                <Bed size={14} color={COLORS.inkLight} />
                <Text style={styles.amenityText}>{listing.beds || 1}</Text>
              </View>
              <View style={styles.dot} />
              <View style={styles.amenityItem}>
                <Bath size={14} color={COLORS.inkLight} />
                <Text style={styles.amenityText}>{listing.baths || 1}</Text>
              </View>
            </View>

            {listing.lease_type === 'semester' && (
              <View style={styles.leasePill}>
                <Text style={styles.leaseText}>Flexible Lease</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    ...SHADOW.card,
    marginBottom: SPACING.md,
  },
  pressable: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  pressedShadow: {
    ...SHADOW.float,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  topOverlays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.sm,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  bottomOverlays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: SPACING.sm,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  heartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  universityTagsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  body: {
    padding: SPACING.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.bgDeep,
    borderRadius: RADIUS.pill,
  },
  typeText: {
    ...TEXT.badge,
    color: COLORS.inkMid,
    textTransform: 'capitalize',
  },
  title: {
    marginBottom: SPACING.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amenities: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amenityText: {
    ...TEXT.bodySmall,
    color: COLORS.inkLight,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.inkFaint,
    marginHorizontal: 8,
  },
  leasePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.terracottaLight,
    borderRadius: RADIUS.sm,
  },
  leaseText: {
    ...TEXT.badge,
    color: COLORS.terracotta,
    fontSize: 10,
  },
});
