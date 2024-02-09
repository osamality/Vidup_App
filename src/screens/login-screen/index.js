import React, { memo, useState, useCallback, useEffect } from 'react';
import { styles } from './styled';
import {
  Text,
  View,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Login,
  LoginWithGoogle,
  LoginWithFacebook,
  chooseUsername,
} from '../../../store/actions/user';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { IconButton, Input, Link, _Toast } from '../../components';
import { RFValue } from 'react-native-responsive-fontsize';
import testProps from 'locatorId';
import messaging from '@react-native-firebase/messaging';
import { useTheme } from '@react-navigation/native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import Orientation from 'react-native-orientation-locker';
import { Color } from 'constants';

const LoginScreen = (props) => {
  const { colors } = useTheme();
  const {
    user,
    isLoading,
    loginRequest,
    chooseUsernameDispatch,
    loggedInUserDispatch,
    LoginWithGoogle,
    LoginWithFacebook,
    resetLoaderDispatch,
    tempUser,
    clearStateDispatch,
    navigation,
    isSignupCompleted,
  } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setToken] = useState('');
  const [date, setDate] = useState(new Date());

  // const isFocused = navigation.isFocused();

  // useEffect(() => {
  //   clearStateDispatch();
  // }, [isFocused]);

  const setGoogleConfig = () => {
    GoogleSignin.configure({
      //scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      // webClientId: '206379303108-oin2l71blkd5n5kku97ft9msqn4bt2nj.apps.googleusercontent.com', // google console
      webClientId: '111167663529-hdss236j6t4mq3ggcmdishq5davb8n62.apps.googleusercontent.com', // firebase
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      //hostedDomain: '', // specifies a hosted domain restriction
      //loginHint: '', // [iOS] The user's ID, or email address, to be prefilled in the authentication UI if possible. [See docs here](https://developers.google.com/identity/sign-in/ios/api/interface_g_i_d_sign_in.html#a0a68c7504c31ab0b728432565f6e33fd)
      //forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      //accountName: '', // [Android] specifies an account name on the device that should be used
      //iosClientId: '111167663529-ip3qgcke1funr4n0lv3j9fq995cjcl3e.apps.googleusercontent.com', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      //googleServicePlistPath: '', // [iOS] optional, if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
    });
  };

  const navigateTo = useCallback(
    (whereTo) => {
      props.navigation.navigate(whereTo);
    },
    [props.navigation],
  );

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('RESPONSE: ', userInfo.serverAuthCode, fcmToken);
      LoginWithGoogle(userInfo.serverAuthCode, fcmToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('ERROR cancelled');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(' In progress');
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Google service not available');
        // play services not available or outdated
      } else {
        console.log('SOmething else', JSON.stringify(error));
        // some other error happened
      }
    }
  };

  const loginWithFb = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            console.log('Access TOken: ', data.accessToken);
            initUser(data.accessToken);
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const initUser = async (token) => {
    await fetch('https://graph.facebook.com/v2.5/me?fields=email&access_token=' + token)
      .then((response) => response.json())
      .then((json) => {
        // Some user object has been set up somewhere, build that user here
        console.log(token, '   EMail', json.email);
        LoginWithFacebook(token, json.email, fcmToken);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  };

  const onLogin = () => {
    if (email == '') {
      _Toast('danger', 'Please enter your email or username!');
      return;
    } else if (password == '') {
      _Toast('danger', 'Please enter your password!');
      return;
    } else {
      const user = {
        username: email,
        password,
        device_token: fcmToken,
        isLoading: true,
      };
      console.log(user);
      loggedInUserDispatch(user);
    }
  };

  useEffect(() => {
    console.log('Temp USer: ', tempUser);
    if (tempUser.token) {
      navigation.navigate('Dashboard');
      return;
    }
    if (tempUser.verified) {
      navigation.navigate('UserNameOnSignupScreen');
      return;
    }
    if (tempUser.email) {
      navigation.navigate('VerifyCodeOnSignupScreen');
      return;
    }
  }, [tempUser]);

  useEffect(() => {
    setGoogleConfig();
    if (Platform.OS == 'ios') {
      IosPermision();
    }

    registerAppWithFCM();
    if (user.token) {
      navigateTo('Dashboard');
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
      resetLoaderDispatch();
      clearStateDispatch();
    });

    return () => {
      unsubscribe1();
    };
  }, []);

  useEffect(() => {
    if (loginRequest.isSuccess) {
      navigation.navigate('ChooseUname', { origin: 'login' });
      //navigate to choose username
    }
  }, [loginRequest]);

  const registerAppWithFCM = async () => {
    await messaging().registerDeviceForRemoteMessages();
    await messaging()
      .getToken()
      .then((fcm) => {
        setToken(fcm);
      });
  };

  const IosPermision = async () => {
    const authorizationStatus = await messaging().requestPermission();
    if (authorizationStatus) {
    }
  };

  const onSignupButton = () => {
    navigation.navigate('SignUpScreen', { fcm: fcmToken });
  };
  useEffect(() => {
    console.log('isSignupCompleted ::: ', isSignupCompleted);
    // if (isSignupCompleted === false) {
    //   navigation.navigate('SignUpScreen', { fcm: fcmToken });
    // }
  }, [isSignupCompleted]);

  return (
    <View style={[styles.MainContainer, { paddingBottom: 0, backgroundColor: colors.background }]}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={colors.background == '#fff' ? 'dark-content' : 'light-content'}
      />
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView>
          <View style={styles.container}>
            {loginRequest.isRequested && (
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: 999,
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.background,
                  opacity: 0.8,
                }}>
                <ActivityIndicator color={colors.primary} size="small" />
              </View>
            )}
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require('../../assets/images/logo/logo-small.png')}
              />
            </View>
            <KeyboardAwareScrollView
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ height: hp('75%') }}
              keyboardShouldPersistTaps={'always'}>
              <View style={{ flex: 1 }}>
                <View>
                  <Text
                    {...testProps('loginBodyTitle')}
                    style={[styles.signIntext, { color: colors.text }]}>
                    Sign in to your account
                  </Text>
                  <View style={styles.buttonMargin}>
                    <Input
                      placeholder="Email, Username or Phone Number"
                      value={email}
                      autoCapitalize={'none'}
                      testProp={'loginEmailInputField'}
                      onChangeText={(e) => setEmail(e)}
                    />
                  </View>
                  <View style={styles.buttonMargin}>
                    <Input
                      placeholder="Password"
                      autoCapitalize={'none'}
                      value={password}
                      isSecure={true}
                      testProp={'loginPasswordInputField'}
                      onChangeText={(e) => setPassword(e)}
                    />
                  </View>

                  <View
                    style={[
                      styles.buttonMargin,
                      { marginBottom: RFValue(13), marginLeft: hp('1%') },
                    ]}>
                    <Link
                      testProp={'forgotPasswordBtnOnLoginScreen'}
                      label="Forgot Password?"
                      onPress={() => navigateTo('ForgotPasswordScreen')}
                    />
                  </View>
                  {!isLoading ? (
                    <TouchableHighlight onPress={onLogin} underlayColor="none">
                      <LinearGradient
                        colors={['#FB6200', '#EF0059']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.loginButton}>
                        <Text {...testProps('loginSignInBtn')} style={styles.whiteColor}>
                          Sign In
                        </Text>
                      </LinearGradient>
                    </TouchableHighlight>
                  ) : (
                    <LinearGradient
                      colors={['#FB6200', '#EF0059']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={styles.loginButton}>
                      <ActivityIndicator color="#fff" size="small" />
                    </LinearGradient>
                  )}
                </View>
                <View style={[styles.bottomText, { overflow: 'hidden', flexGrow: 1 }]}>
                  <View
                    {...testProps('loginSignUpBtn')}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={[styles.footerText, { color: colors.text }]}>
                      Don't have an account?{' '}
                    </Text>
                    <Link
                      testProp={'signUpBtnOnLoginScreen'}
                      label="Sign up"
                      onPress={onSignupButton}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 30,
                      width: 100,
                    }}>
                    <View style={{ padding: 3, overflow: 'hidden', paddingTop: 0 }}>
                      <View
                        style={[
                          styles.iconShadow,
                          {
                            backgroundColor:
                              colors.background != '#fff' ? Color.LightGrey5 : '#fff',
                          },
                        ]}>
                        <IconButton
                          style={{ width: 20.5, height: 21 }}
                          onPress={() => signInWithGoogle()}
                          testProp={'loginWithGoogleBtn'}
                          source={require('../../assets/images/icon/Google/Google-3x.png')}
                        />
                      </View>
                    </View>

                    <View style={{ padding: 3, overflow: 'hidden', paddingTop: 0 }}>
                      <View
                        style={[
                          styles.iconShadow,
                          {
                            backgroundColor:
                              colors.background != '#fff' ? Color.LightGrey5 : '#fff',
                          },
                        ]}>
                        <IconButton
                          style={{ width: 21, height: 21 }}
                          onPress={() => loginWithFb()}
                          testProp={'loginWithFacebookBtn'}
                          source={require('../../assets/images/icon/Facebook/Facebook-3x.png')}
                        />
                      </View>
                    </View>
                    {/* <IconButton source={require('../../assets/images/icon/Outlook/Outlook-3x.png')} /> */}
                  </View>
                  <Text
                    style={[
                      styles.footerText,
                      {
                        color: colors.text,
                        marginTop: 20,
                        textAlign: 'center',
                        marginBottom: 30,
                      },
                    ]}>
                    Or sign in with
                  </Text>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    isLoading: state.RequestLoaders.isRequested,
    tempUser: state.user.tempUser,
    loginRequest: state.RequestLoaders.loginRequest,
    isSignupCompleted: state.user.isSignupCompleted,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loggedInUserDispatch: (user) => dispatch(Login(user)),
    LoginWithGoogle: (googleCode, fcm) => dispatch(LoginWithGoogle(googleCode, fcm)),
    LoginWithFacebook: (fbCode, email, fcm) => dispatch(LoginWithFacebook(fbCode, email, fcm)),
    chooseUsernameDispatch: (username, email) => dispatch(chooseUsername(username, email)),
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
    resetLoaderDispatch: () =>
      dispatch({
        type: 'LOADING',
        payload: false,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
