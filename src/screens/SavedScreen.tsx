// src/screens/SavedScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import { HeartOff } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { TEXT } from '../constants/typography';
import { SPACING } from '../constants/layout';
import { PropertyCard } from '../components/PropertyCard';
import { EmptyState } from '../components/EmptyState';
import { useListingsStore } from '../store/listingsStore';
import { useFilterStore } from '../store/filterStore';
import { useAuthStore } from '../store/authStore';
import { Listing } from '../types';

export const SavedScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const { listings, isLoading, fetchListings } = useListingsStore();
  const { activeUniversity } = useFilterStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // In a production app, we'd fetch saved IDs from Supabase
    // For now, we mock it by taking the first 2 listings
    setSavedListings(listings.slice(0, 2));
  }, [listings]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={TEXT.h2}>Saved Homes</Text>
        <Text style={[TEXT.bodySmall, { color: COLORS.inkLight }]}>
          {savedListings.length} properties you loved
        </Text>
      </View>

      <FlatList
        data={savedListings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={isLoading} 
            onRefresh={fetchListings} 
            tintColor={COLORS.navy} 
          />
        }
        renderItem={({ item }) => (
          <PropertyCard
            listing={item}
            activeUniversityKey={activeUniversity}
            onPress={() => navigation.navigate('PropertyDetail', { listing: item })}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <EmptyState
              emoji="❤️"
              heading="No saved homes yet"
              subtext="Tap the heart icon on any property to keep track of homes you're interested in."
              ctaLabel="Explore Homes"
              onCta={() => navigation.navigate('Home')}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: SPACING.page,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listContent: {
    padding: SPACING.page,
    paddingBottom: 40,
    flexGrow: 1,
  },
});
