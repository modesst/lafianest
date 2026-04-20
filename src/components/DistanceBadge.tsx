// src/components/DistanceBadge.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { TEXT } from '../constants/typography';
import { UNIVERSITIES, UniversityKey } from '../constants/universities';
import { getDistanceToCampus, formatDistance } from '../utils/distance';

interface DistanceBadgeProps {
  lat: number;
  lng: number;
  universityKey: UniversityKey;
}

export const DistanceBadge: React.FC<DistanceBadgeProps> = ({ lat, lng, universityKey }) => {
  const university = UNIVERSITIES[universityKey];
  const distance = getDistanceToCampus(lat, lng, universityKey);
  const label = formatDistance(distance, university.shortName);

  return (
    <View style={styles.container}>
      <MapPin size={12} color={COLORS.teal} style={styles.icon} />
      <Text style={[TEXT.badge, styles.text]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tealLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: COLORS.teal,
  },
});
