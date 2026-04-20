// src/navigation/linking.ts
import * as Linking from 'expo-linking';

export const linking = {
  prefixes: [Linking.createURL('/'), 'https://lafianest.com', 'lafianest://'],
  config: {
    screens: {
      Auth: 'auth',
      MainTabs: {
        screens: {
          Home: 'home',
          Map: 'map',
          Saved: 'saved',
          Community: 'community',
          Profile: 'profile',
        },
      },
      PropertyDetail: 'listing/:id',
      Chat: 'chat/:listingId/:receiverId',
    },
  },
};
