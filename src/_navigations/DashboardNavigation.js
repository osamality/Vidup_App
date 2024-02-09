//Navigation
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import {
  EditAboutScreen,
  FollowingFollowersScreen,
  FollowersRequest,
  Chat,
  Comments,
  ChatHome,
  Canvas,
  PostScreen,
  ViewAllUserScreen,
  DrawerScreen,
  PersonalPostView,
  TrimVideoScreen,
  PublicProfileScreen,
  WeeklyVideoViewScreen,
  EditPostScreen,
} from 'screens';
import DashboardTabs from './BottomTabNavigation';
import { FullScreenPlayer } from 'components';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';

// enableScreens();
// const Stack = createNativeStackNavigator();

const Stack = createStackNavigator();

const DashboardNavigation = ({ deviceOrientation }) => {
  return (
    // <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff'}}>
    <Stack.Navigator initialRouteName={'HScreen'}>
      <Stack.Screen name="HomeScreen" component={DashboardTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="ProfileUpdateScreen"
        component={EditAboutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FollowingFollowersScreen"
        component={FollowingFollowersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ChatScreen" component={Chat} options={{ headerShown: false }} />
      <Stack.Screen
        name="CommentScreen"
        component={Comments}
        options={{ headerShown: false, tabBarVisible: false }}
      />
      <Stack.Screen
        name="FullScreen"
        component={FullScreenPlayer}
        options={{
          headerShown: false,
          tabBarVisible: false,
          screenOrientation: 'landscape',
        }}
      />
      <Stack.Screen name="ChatHome" component={ChatHome} options={{ headerShown: false }} />
      <Stack.Screen
        name="CanvasView"
        component={Canvas}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="PostScreen" component={PostScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="EditPostScreen"
        component={EditPostScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TrimVideoScreen"
        component={TrimVideoScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
    // </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    deviceOrientation: state.GlobalCheckReducer.deviceOrientation,
  };
}

export default connect(mapStateToProps, null)(DashboardNavigation);
