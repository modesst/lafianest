// src/components/MapComponent.tsx
import React, { forwardRef } from 'react';
import MapView, { Marker, Circle, PROVIDER_GOOGLE, MapViewProps } from 'react-native-maps';

export const MapComponent = forwardRef<MapView, MapViewProps>((props, ref) => {
  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      {...props}
    />
  );
});

export { Marker, Circle };
