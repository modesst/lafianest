// src/components/MapComponent.web.tsx
import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

// Mock types for web to avoid bundling native-only code
export const MapComponent = forwardRef<any, any>((props, ref) => {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.text}>Map View is not supported on Web in this prototype.</Text>
      <Text style={styles.subtext}>Please use an Android or iOS device to view the interactive map.</Text>
    </View>
  );
});

export const Marker = (props: any) => <View />;
export const Circle = (props: any) => <View />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDeep,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtext: {
    color: COLORS.inkLight,
    fontSize: 14,
    textAlign: 'center',
  },
});
