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
  Search,
  TopVideosView,
  DrawerScreen,
  PersonalPostView,
  Viewallvideos,
  HashtagVideosScreen,
  PublicProfileScreen,
  ViewAllTopUserScreen,
} from 'screens';

const SearchNav = createStackNavigator();

const SearchStack = () => {
  return (
    <SearchNav.Navigator initialRouteName={'search'}>
      <SearchNav.Screen name="search" component={Search} options={{ headerShown: false }} />
      <SearchNav.Screen
        name="TopVideosView"
        component={TopVideosView}
        options={{ headerShown: false }}
      />
      <SearchNav.Screen
        name="PublicProfileScreen"
        component={PublicProfileScreen}
        options={{ headerShown: false }}
      />
      <SearchNav.Screen
        name="ViewAllUserScreen"
        component={ViewAllUserScreen}
        options={{ headerShown: false }}
      />
      <SearchNav.Screen
        name="Viewallvideos"
        component={Viewallvideos}
        options={{ headerShown: false }}
      />
      <SearchNav.Screen
        name="HashtagVideosScreen"
        component={HashtagVideosScreen}
        options={{ headerShown: false }}
      />
      <SearchNav.Screen
        name="ViewAllTopUserScreen"
        component={ViewAllTopUserScreen}
        options={{ headerShown: false }}
      />
      <SearchNav.Screen
        name="PersonalPostView"
        component={PersonalPostView}
        options={{ headerShown: false }}
      />
    </SearchNav.Navigator>
  );
};
export default SearchStack;
