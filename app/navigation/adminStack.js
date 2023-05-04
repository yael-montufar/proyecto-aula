import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import QRScannerScreen from '../screens/QRScannerScreen';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="QR" component={QRScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
