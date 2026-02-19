import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import Splash from './normal/Splash';
import Parent from './normal/Parent';

// 1️⃣ Define screen types
export type RootStackParamList = {
  Splash: undefined;
  Parent: undefined;
};

// 2️⃣ Create typed stack
const Stack = createStackNavigator<RootStackParamList>();

// 3️⃣ Typed component
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Parent"
          component={Parent}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
