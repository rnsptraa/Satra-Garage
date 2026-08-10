import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TabNavigator from './src/navigation/TabNavigator';
import LandingScreen from './src/screens/LandingScreen';
import AdminTabNavigator from './src/navigation/AdminTabNavigator';

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Register: undefined;
  MainApp: undefined;
  AdminApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#000000" />
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#F1F5F9' },
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="AdminApp" component={AdminTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
