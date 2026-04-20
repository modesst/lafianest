// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Map as MapIcon, PlusCircle, Heart, User, Users, MessageSquare } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { AuthScreen } from '../screens/AuthScreen';
import { StudentHomeScreen } from '../screens/StudentHomeScreen';
import { MapScreen } from '../screens/MapScreen';
import { ListingFormScreen } from '../screens/ListingFormScreen';
import { PropertyDetailScreen } from '../screens/PropertyDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RoommateScreen } from '../screens/RoommateScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { SavedScreen } from '../screens/SavedScreen';
import { useAuthStore } from '../store/authStore';
import { linking } from './linking';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          height: 80, 
          paddingBottom: 20, 
          paddingTop: 12, 
          backgroundColor: COLORS.white, 
          borderTopWidth: 1, 
          borderTopColor: COLORS.border,
          elevation: 8,
          shadowColor: COLORS.navy,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: COLORS.navy,
        tabBarInactiveTintColor: COLORS.inkFaint,
        tabBarLabelStyle: { fontFamily: 'DMSans_500Medium', fontSize: 11 },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={StudentHomeScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Home size={24} color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <MapIcon size={24} color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <Heart size={24} color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} /> 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ 
          tabBarIcon: ({ color }) => <User size={24} color={color} /> 
        }} 
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { session } = useAuthStore();
  
  return (
    <NavigationContainer linking={linking as any}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={HomeTabs} />
            <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
            <Stack.Screen name="Roommate" component={RoommateScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="ListingForm" component={ListingFormScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
