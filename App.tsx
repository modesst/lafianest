// App.tsx
import React, { useEffect, useCallback, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';

import "./global.css";

import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/colors';
import { useAuthStore } from './src/store/authStore';

// Keep the splash screen visible
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const { initialize } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      try {
        console.log('App: Starting preparation');
        await initialize();
        // Give fonts a moment or proceed if error
        console.log('App: Auth initialized');
      } catch (e) {
        console.warn('App: Preparation error:', e);
      } finally {
        setAppReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady && (fontsLoaded || fontError)) {
      console.log('App: onLayoutRootView -> Hiding splash');
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady, fontsLoaded, fontError]);

  if (!appReady || (!fontsLoaded && !fontError)) {
    console.log('App: Still loading...', { appReady, fontsLoaded, hasFontError: !!fontError });
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F2557" />
        <Text style={{ marginTop: 20, color: '#0F2557' }}>LafiaNest is loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <AppNavigator />
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F3EE',
  },
});
