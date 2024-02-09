//Navigation
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NotificationScreen,
  FollowersRequest,
  PublicProfileScreen,
  PersonalPostView,
} from 'screens';

const Stack = createStackNavigator();

const NotificationStack = () => {
  return (
    <Stack.Navigator initialRouteName={'NotificationScreen'}>
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FollowersRequestScreen"
        component={FollowersRequest}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PublicProfileScreen"
        component={PublicProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PersonalPostView"
        component={PersonalPostView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default NotificationStack;
