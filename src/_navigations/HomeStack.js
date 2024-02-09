//Navigation
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  EditAboutScreen,
  FollowingFollowersScreen,
  FollowersRequest,
  HomeScreen,
  Chat,
  Comments,
  ChatHome,
  PostViewScreen,
  PostScreen,
  ViewAllUserScreen,
  DrawerScreen,
  PersonalPostView,
  TrimVideoScreen,
  PublicProfileScreen,
  ViewAllLikedUsers,
} from 'screens';
import DashboardTabs from './BottomTabNavigation';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName={'Home'}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, cardStyle: { opacity: 1 } }}
      />
      <Stack.Screen
        name="PersonalPostView"
        component={PersonalPostView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PublicProfileScreen"
        component={PublicProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FollowersRequestScreen"
        component={FollowersRequest}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ViewAllLikedUsers"
        component={ViewAllLikedUsers}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default HomeStack;
