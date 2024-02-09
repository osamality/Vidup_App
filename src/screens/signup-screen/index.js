import React, { useState, useCallback, useEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableHighlight } from 'react-native';
import { Button, Link } from 'native-base';
const phoneCode = require('components/country-phone-code-json/code.json');
import { styles } from './styled';
import { Input, IconButton, _Toast } from 'components';
import { signUp, LoginWithGoogle, LoginWithFacebook } from '../../../store/actions/user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

//Components
import { connect } from 'react-redux';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';
import testProps from 'locatorId';
import { useTheme } from '@react-navigation/native';

const SignupScreen = (props) => {
  const { colors } = useTheme();
  const {
    user,
    tempUser,
    LoginWithGoogle,
    loginRequest,
    route,
    LoginWithFacebook,
    isLoading,
    signUpDispatch,
    clearStateDispatch,
  } = props;
  const navigation = props.navigation;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [passwordSecureView, setPasswordSecureView] = useState(false);
  const [fcmToken, setToken] = useState('');

  const PasswordSecureView = () => {
    setPasswordSecureView(!passwordSecureView);
  };

  const screenNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const navigateToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  useEffect(() => {
    setToken(route.params?.fcm);
  }, [route.params?.fcm]);

  // const isFocused = navigation.isFocused();

  // useEffect(() => {
  //   clearStateDispatch();
  // }, [isFocused]);

  useEffect(() => {
    if (tempUser.token) {
      navigation.navigate('Dashboard');
      return;
    }
    if (tempUser.verified) {
      navigation.navigate('UserNameOnSignupScreen');
      return;
    }
    if (tempUser.email) {
      screenNavigation('VerifyCodeOnSignupScreen');
      return;
    }
  }, [tempUser]);

  // if (user.token) {
  //   navigation.navigate('Dashboard');
  //   return;
  // }
  // if (user.verified) {
  //   navigation.navigate('UserNameOnSignupScreen');
  //   return;
  // }
  // if (user.email) {
  //   screenNavigation('VerifyCodeOnSignupScreen');
  //   return;
  // }

  const onNext = () => {
    if (email == '') {
      _Toast('danger', 'Please enter your email!');
      return;
    }
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      _Toast('danger', 'Please enter valid email!');
      return;
    }
    if (password == '') {
      _Toast('danger', 'Please enter your password!');
      return;
    }
    if (password.length < 6) {
      _Toast('danger', 'Password should be at least 6 characters long!');
      return;
    }
    if (password !== confirmPassword) {
      _Toast('danger', 'Password does not match!');
      return;
    } else {
      const user = { email, password };
      signUpDispatch(user);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      LoginWithGoogle(userInfo.serverAuthCode, fcmToken);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const loginWithFb = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            initUser(data.accessToken);
          });
        }
      },
      function (error) {},
    );
  };

  const initUser = async (token) => {
    await fetch('https://graph.facebook.com/v2.5/me?fields=email&access_token=' + token)
      .then((response) => response.json())
      .then((json) => {
        // Some user object has been set up somewhere, build that user here

        LoginWithFacebook(token, json.email, fcmToken);
      })
      .catch((err) => {});
  };

  return (
    <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
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
              <Image style={styles.logo} source={require('assets/images/logo/logo-small.png')} />
            </View>
            <KeyboardAwareScrollView
              showsVerticalScrollIndicator={false}
              // contentContainerStyle={{ flex: 1, marginTop: 20 }}
              contentContainerStyle={{ height: hp('72%'), marginTop: 20 }}
              keyboardShouldPersistTaps={'always'}>
              <View style={{ flex: 1 }}>
                <View>
                  <Text
                    {...testProps('signUptitleOnSignUpScreen')}
                    style={[styles.signIntext, { color: colors.text }]}>
                    Sign up for a new account
                  </Text>
                  <View style={styles.buttonMargin}>
                    <Input
                      testProp={'signUpEmailInputField'}
                      autoCapitalize={'none'}
                      name="email"
                      placeholder="Email or Phone Number"
                      value={email}
                      onChangeText={(e) => setEmail(e)}
                    />
                  </View>
                  <View style={styles.buttonMargin}>
                    <Input
                      testProp={'signUpPasswordInputField'}
                      autoCapitalize={'none'}
                      placeholder="Password"
                      isSecure={true}
                      name="password"
                      value={password}
                      onChangeText={(e) => setPassword(e)}
                    />
                  </View>
                  <View style={styles.buttonMargin}>
                    <Input
                      testProp={'signUpConfirmPasswordInputField'}
                      autoCapitalize={'none'}
                      placeholder="Confirm Password"
                      isSecure={true}
                      name="confirm-password"
                      value={confirmPassword}
                      onChangeText={(e) => setConfirmPassword(e)}
                    />
                  </View>
                  {!isLoading ? (
                    <TouchableHighlight onPress={onNext} underlayColor="none">
                      <LinearGradient
                        colors={['#FB6200', '#EF0059']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.loginButton}>
                        <Text {...testProps('signUpBtnOnSignUpScreen')} style={styles.whiteColor}>
                          Next
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
                  <Text
                    {...testProps('signInBtnOnSignUpScreen')}
                    style={[
                      styles.footerText,
                      {
                        marginBottom: 15,
                        color: colors.text,
                      },
                    ]}>
                    Already have an account?{' '}
                    <Text
                      onPress={() => navigation.navigate('LoginScreen')}
                      style={{
                        color: Color.Blue,
                        textDecorationLine: 'underline',
                        fontFamily: FontFamily.medium,
                        fontSize: RFValue(14),
                      }}>
                      Sign In
                    </Text>{' '}
                  </Text>
                  {/* <View style={styles.socialButton}>
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
                          testProp={'signUpWithGoogleBtn'}
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
                          testProp={'signUpWithFacebookBtn'}
                          source={require('../../assets/images/icon/Facebook/Facebook-3x.png')}
                        />
                      </View>
                    </View>

                   
                  </View> 
                  <Text
                    style={[
                      styles.footerText,
                      {
                        marginTop: 20,
                        textAlign: 'center',
                        marginBottom: 30,
                        color: colors.text,
                      },
                    ]}>
                    Or sign up with
                  </Text> */}
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
    tempUser: state.user.tempUser,
    isLoading: state.RequestLoaders.isRequested,
    loginRequest: state.RequestLoaders.loginRequest,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    signUpDispatch: (user) => dispatch(signUp(user)),
    LoginWithGoogle: (googleCode, fcm) => dispatch(LoginWithGoogle(googleCode, fcm)),
    LoginWithFacebook: (fbCode, email, fcm) => dispatch(LoginWithFacebook(fbCode, email, fcm)),
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
