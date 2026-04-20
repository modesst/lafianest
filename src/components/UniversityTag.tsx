// src/components/UniversityTag.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GraduationCap } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { RADIUS, SPACING } from '../constants/layout';
import { FONTS } from '../constants/typography';
import { UNIVERSITIES, UniversityKey } from '../constants/universities';

interface UniversityTagProps {
  universityKey: UniversityKey;
}

export const UniversityTag: React.FC<UniversityTagProps> = ({ universityKey }) => {
  const university = UNIVERSITIES[universityKey];

  return (
    <View style={styles.container}>
      <GraduationCap size={11} color={COLORS.white} style={styles.icon} />
      <Text style={styles.text}>
        {university.shortName}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.navy,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    color: COLORS.white,
    fontFamily: FONTS.bodySemi,
    fontSize: 11,
  },
});
