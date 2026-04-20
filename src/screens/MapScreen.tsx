// src/screens/MapScreen.tsx
import React, { useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Dimensions, Platform } from 'react-native';
import { MapComponent, Marker, Circle } from '../components/MapComponent';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { ChevronLeft, Search, Layers, Navigation } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SHADOW, SPACING } from '../constants/layout';
import { TEXT, FONTS } from '../constants/typography';
import { UNIVERSITIES, UniversityKey } from '../constants/universities';
import { useListingsStore } from '../store/listingsStore';
import { useFilterStore } from '../store/filterStore';
import { PropertyCard } from '../components/PropertyCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const MapScreen: React.FC<any> = ({ navigation }) => {
  const { listings } = useListingsStore();
  const { activeUniversity } = useFilterStore();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  
  const mapRef = useRef<any>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => ['12%', '40%', '90%'], []);

  const activeUniData = UNIVERSITIES[activeUniversity];

  const handleMarkerPress = (listing: any) => {
    setSelectedListingId(listing.id);
    bottomSheetRef.current?.snapToIndex(1);
    if (Platform.OS !== 'web') {
      mapRef.current?.animateToRegion({
        latitude: listing.lat - 0.002, // Offset to keep marker visible above bottom sheet
        longitude: listing.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
    <View style={styles.container}>
      <MapComponent
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: activeUniData.gateCoords.lat,
          longitude: activeUniData.gateCoords.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        customMapStyle={mapStyle}
      >
        {/* University Markers */}
        {Object.values(UNIVERSITIES).map((uni) => (
          <Marker
            key={uni.id}
            coordinate={{ latitude: uni.gateCoords.lat, longitude: uni.gateCoords.lng }}
            title={uni.name}
          >
            <View style={styles.uniMarker}>
              <View style={styles.uniBadge}>
                <Text style={styles.uniBadgeText}>{uni.shortName}</Text>
              </View>
              <View style={styles.uniDot} />
            </View>
          </Marker>
        ))}

        {/* Listing Markers */}
        {listings.map((l) => (
          <Marker
            key={l.id}
            coordinate={{ latitude: l.lat, longitude: l.lng }}
            onPress={() => handleMarkerPress(l)}
          >
            <View style={[
              styles.listingMarker,
              l.is_verified ? styles.verifiedMarker : styles.unverifiedMarker,
              selectedListingId === l.id && styles.selectedMarker
            ]}>
              <View style={styles.innerDot} />
            </View>
          </Marker>
        ))}

        {/* Heatmap Circles */}
        {showHeatmap && (
          <>
            <Circle
              center={{ latitude: 8.5060, longitude: 8.5227 }}
              radius={800}
              fillColor="rgba(13, 148, 136, 0.2)"
              strokeColor="rgba(13, 148, 136, 0.5)"
            />
            <Circle
              center={{ latitude: 8.4950, longitude: 8.5100 }}
              radius={1200}
              fillColor="rgba(217, 119, 6, 0.2)"
              strokeColor="rgba(217, 119, 6, 0.5)"
            />
          </>
        )}
      </MapComponent>

      {/* Top Overlays */}
      <View style={styles.topOverlay}>
        <Pressable style={styles.circleButton} onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color={COLORS.navy} />
        </Pressable>
        
        <View style={styles.searchBar}>
          <Search size={18} color={COLORS.inkLight} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search on map..."
            placeholderTextColor={COLORS.inkFaint}
          />
        </View>

        <Pressable 
          style={[styles.circleButton, showHeatmap && styles.activeCircleButton]}
          onPress={() => setShowHeatmap(!showHeatmap)}
        >
          <Layers size={20} color={showHeatmap ? COLORS.white : COLORS.navy} />
        </Pressable>
      </View>

      <Pressable style={styles.locationButton} onPress={() => {}}>
        <Navigation size={20} color={COLORS.navy} />
      </Pressable>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.sheetHandle}
        backgroundStyle={styles.sheetBackground}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetHeader}>
            {listings.length} listings found
          </Text>
          
          <BottomSheetFlatList
            data={listings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PropertyCard 
                listing={item} 
                activeUniversityKey={activeUniversity}
                onPress={() => navigation.navigate('PropertyDetail', { listing: item })}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const mapStyle = [
  {
    "featureType": "poi",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "featureType": "transit",
    "stylers": [{ "visibility": "off" }]
  }
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    left: SPACING.md,
    right: SPACING.md,
    gap: 10,
    alignItems: 'center',
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.subtle,
  },
  activeCircleButton: {
    backgroundColor: COLORS.navy,
  },
  searchBar: {
    flex: 1,
    height: 48,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...SHADOW.subtle,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.navy,
  },
  locationButton: {
    position: 'absolute',
    bottom: '15%',
    right: SPACING.md,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.subtle,
  },
  uniMarker: {
    alignItems: 'center',
  },
  uniBadge: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    ...SHADOW.subtle,
  },
  uniBadgeText: {
    color: COLORS.white,
    fontFamily: FONTS.bodyBold,
    fontSize: 10,
  },
  uniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.navy,
    marginTop: -2,
  },
  listingMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.subtle,
  },
  verifiedMarker: {
    backgroundColor: COLORS.teal,
  },
  unverifiedMarker: {
    backgroundColor: COLORS.terracotta,
  },
  selectedMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    transform: [{ scale: 1.2 }],
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.white,
  },
  sheetHandle: {
    backgroundColor: COLORS.border,
    width: 40,
  },
  sheetBackground: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: SPACING.page,
  },
  sheetHeader: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.inkLight,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
});
