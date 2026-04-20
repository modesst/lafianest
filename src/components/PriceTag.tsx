// src/components/PriceTag.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { TEXT } from '../constants/typography';
import { formatRent } from '../utils/distance';

interface PriceTagProps {
  amount: number;
  frequency?: 'yearly' | '6monthly' | 'monthly';
  size?: 'small' | 'large';
}

export const PriceTag: React.FC<PriceTagProps> = ({ 
  amount, 
  frequency = 'yearly',
  size = 'small' 
}) => {
  const label = frequency === 'monthly' ? '/mo' : frequency === '6monthly' ? '/6mo' : '/yr';

  return (
    <View style={styles.container}>
      <Text style={size === 'large' ? TEXT.priceLarge : TEXT.price}>
        {formatRent(amount)}
      </Text>
      <Text style={[TEXT.bodySmall, styles.label]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  label: {
    color: COLORS.inkLight,
    marginLeft: 2,
  },
});
