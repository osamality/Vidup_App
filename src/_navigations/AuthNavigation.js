//Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';
import {
  LOGIN,
  VerifyCodeOnSignupScreen,
  SIGNUP,
  UserNameOnSignupScreen,
  BirthDayOnSignUpScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  VerifyCodeOnForgotPasswordScreen,
  ChooseUsername,
  PrivacyPolicyScreen,
  LegalInformationScreen,
} from 'screens';
import { Button, Icon } from 'native-base';
import { Image, Text } from 'react-native';
import DashboardNavigation from './DashboardNavigation';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';

// enableScreens();

// const Stack = createNativeStackNavigator();

const Stack = createStackNavigator();

const AuthNavigation = (props) => {
  const { isSocialLogin } = props;

  const { colors } = useTheme();

  return (
    <Stack.Navigator initialRouteName="LoginScreen">
      <Stack.Screen name="LoginScreen" component={LOGIN} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpScreen" component={SIGNUP} options={{ headerShown: false }} />
      <Stack.Screen
        name="ChooseUname"
        component={ChooseUsername}
        options={({ navigation }) => ({
          title: 'Enter Username',

          headerTitleStyle: { textAlign: 'center' },
          headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <Button
              {...testProps('ChooseUnameBackBtn')}
              transparent
              onPress={() => {
                if (isSocialLogin) {
                  navigation.navigate('LoginScreen');
                } else {
                  navigation.goBack();
                }
              }}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: '#464646' }}
              />
            </Button>
          ),
          headerRight: () => <></>,
        })}
      />
      <Stack.Screen
        name="VerifyCodeOnSignupScreen"
        component={VerifyCodeOnSignupScreen}
        options={({ navigation }) => ({
          title: 'Sign Up',
          headerTitleStyle: { textAlign: 'center' },
          headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <>
              {/* <Button
                {...testProps('VerifyCodeOnSignupScreenBackBtn')}
                transparent
                onPress={() => navigation.goBack()}>
                <Icon
                  type="Entypo"
                  name="chevron-thin-left"
                  style={{ fontSize: 20, color: '#464646' }}
                />
              </Button> */}
            </>
          ),
          headerRight: () => <></>,
          // headerRight: () => (<Image
          //     style={{ width: 20, height: 20, marginRight: 20 }}
          //     source={require('assets/images/icon/Info/Info-3x.png')}
          // />)
        })}
      />
      <Stack.Screen
        name="UserNameOnSignupScreen"
        component={UserNameOnSignupScreen}
        options={({ navigation }) => ({
          title: 'Sign Up',

          headerTitleStyle: { textAlign: 'center' },
          headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <Button
              {...testProps('UserNameOnSignupScreenBackBtn')}
              transparent
              onPress={() => {
                if (isSocialLogin) {
                  navigation.navigate('LoginScreen');
                } else {
                  navigation.goBack();
                }
              }}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: '#464646' }}
              />
            </Button>
          ),
          headerRight: () => <></>,
        })}
      />
      <Stack.Screen
        name="BirthDayOnSignUpScreen"
        component={BirthDayOnSignUpScreen}
        options={({ navigation }) => ({
          title: 'Sign Up',

          headerTitleStyle: { textAlign: 'center' },
          headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <Button
              {...testProps('BirthDayOnSignUpScreenBackBtn')}
              transparent
              onPress={() => navigation.goBack()}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: '#464646' }}
              />
            </Button>
          ),
          headerRight: () => <></>,
        })}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={({ navigation }) => ({
          title: <Text {...testProps('ForgotPasswordScreenTitle')}>Change Password</Text>,
          headerTitleStyle: { textAlign: 'center' },

          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <Button
              {...testProps('ForgotPasswordScreenBackBtn')}
              transparent
              onPress={() => navigation.goBack()}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: colors.text }}
              />
            </Button>
          ),
          headerRight: () => <></>,
        })}
      />
      <Stack.Screen
        name="VerifyCodeOnForgotPasswordScreen"
        component={VerifyCodeOnForgotPasswordScreen}
        options={({ navigation }) => ({
          title: (
            <Text {...testProps('VerifyCodeOnForgotPasswordScreenTitle')}>Change Password</Text>
          ),
          headerTitleStyle: { textAlign: 'center' },

          headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <Button
              {...testProps('VerifyCodeOnForgotPasswordScreenBackBtn')}
              transparent
              onPress={() => navigation.goBack()}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: '#464646' }}
              />
            </Button>
          ),
          headerRight: () => <></>,
        })}
      />
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
        options={({ navigation }) => ({
          title: <Text {...testProps('ResetPasswordScreenTitle')}>Change Password</Text>,
          headerTitleStyle: { textAlign: 'center' },

          headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <Button
              {...testProps('ResetPasswordScreenBackBtn')}
              transparent
              onPress={() => navigation.goBack()}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: '#464646' }}
              />
            </Button>
          ),
          headerRight: () => <></>,
        })}
      />
      <Stack.Screen
        name="PrivacyPolicyOnAuthScreen"
        component={PrivacyPolicyScreen}
        options={({ navigation }) => ({
          title: <Text {...testProps('PrivacyPolicyOnAuthScreen')}>Privacy Policy</Text>,
          headerTitleStyle: { textAlign: 'center' },

          headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <Button
              {...testProps('PrivacyPolicyOnAuthScreenBackBtn')}
              transparent
              onPress={() => navigation.goBack()}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: '#464646' }}
              />
            </Button>
          ),
          headerRight: () => <></>,
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="TermAndServiceScreen"
        component={LegalInformationScreen}
        options={({ navigation }) => ({
          title: <Text {...testProps('TermAndServiceScreen')}>Terms Of Service</Text>,
          headerTitleStyle: { textAlign: 'center' },

          headerStyle: {
            elevation: 0,
            shadowColor: 'transparent',
            backgroundColor: colors.background,
          },
          headerLeft: () => (
            <Button
              {...testProps('TermAndServiceScreenBackBtn')}
              transparent
              onPress={() => navigation.goBack()}>
              <Icon
                type="Entypo"
                name="chevron-thin-left"
                style={{ fontSize: 20, color: '#464646' }}
              />
            </Button>
          ),
          headerRight: () => <></>,
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardNavigation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

function mapStateToProps(state) {
  return {
    isSocialLogin: state.user.isSocialLogin,
  };
}

export default connect(mapStateToProps, null)(AuthNavigation);
