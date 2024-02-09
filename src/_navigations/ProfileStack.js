//Navigation
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  ProfileScreen,
  PersonalPostView,
  PublicProfileScreen,
  DrawerScreen,
  PushNotificationsSettingScreen,
  PrivacyScreen,
  SavedScreen,
  AboutSettingScreen,
  PrivacyPolicyScreen,
  LegalInformationScreen,
  SupportScreen,
  ManageAccountScreen,
  ResetPasswordScreenInManageAccount,
  ChangeEmailScreenInManageAccount,
  DeactivateAccountScreen,
  AccountVerificationScreen,
  VerifyProgressScreen,
  SavedPostsView,
  WeeklyVideoViewScreen,
  VerifyCodeEmailScreen,
} from 'screens';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator initialRouteName={'ProfileHome'}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ headerShown: false }} />
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
        name="SavedPostsView"
        component={SavedPostsView}
        options={{ headerShown: false, tabBarVisible: false }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={DrawerScreen}
        options={{ headerShown: false, gestureDirection: 'horizontal-inverted' }}
      />
      <Stack.Screen
        name="PushNotificationsSettingScreen"
        component={PushNotificationsSettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyScreen"
        component={PrivacyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SavedScreen" component={SavedScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="AboutSettingScreen"
        component={AboutSettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LegalInformation"
        component={LegalInformationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupportScreen"
        component={SupportScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageAccountScreen"
        component={ManageAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPasswordScreenInManageAccount"
        component={ResetPasswordScreenInManageAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangeEmailScreenInManageAccount"
        component={ChangeEmailScreenInManageAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeactivateAccountScreen"
        component={DeactivateAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountVerificationScreen"
        component={AccountVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyProgressScreen"
        component={VerifyProgressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="weeklyVideoViewScreen"
        component={WeeklyVideoViewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyCodeEmailScreen"
        component={VerifyCodeEmailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default ProfileStack;
