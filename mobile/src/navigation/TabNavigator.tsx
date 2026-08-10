import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, CalendarClock, Car, ReceiptText } from 'lucide-react-native';

import HomeScreen from '../screens/HomeScreen';
import BookingScreen from '../screens/BookingScreen';
import HistoryScreen from '../screens/HistoryScreen';
import VehicleScreen from '../screens/VehicleScreen';

export type TabParamList = {
  Home: undefined;
  Booking: undefined;
  Kendaraan: undefined;
  Riwayat: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#DC2626', // Red
        tabBarInactiveTintColor: '#94A3B8', // Gray
        tabBarStyle: {
          backgroundColor: '#0F172A', // Dark
          borderTopWidth: 2,
          borderTopColor: '#DC2626', // Red border top
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontWeight: '900',
          fontStyle: 'italic',
          textTransform: 'uppercase',
          fontSize: 10,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: 'Beranda'
        }}
      />
      <Tab.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <CalendarClock color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Kendaraan" 
        component={VehicleScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Car color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name="Riwayat" 
        component={HistoryScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <ReceiptText color={color} size={size} />
        }}
      />
    </Tab.Navigator>
  );
}
