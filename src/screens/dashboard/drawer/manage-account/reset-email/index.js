import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableHighlight,
  View,
  Keyboard,
  TextInput,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Text, Thumbnail, Picker, Item, Button } from 'native-base';
import { connect } from 'react-redux';
import { styles } from './styled';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Color, FontFamily } from 'constants';
import Modal from 'react-native-modal';
import { changeEmailRequest } from '../../../../../../store/actions/user';
import { _Toast, Topheader, Input } from '../../../../../components';
import { withPause } from 'react-native-redash';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const ChangeEmailScreen = (props) => {
  const { navigation, changeEmailRequested, isLoading, changeEmailRequestDispatch } = props;
  const { colors } = useTheme();
  const [current, currentlyFocused] = useState('');
  const [focused, resetFocus] = useState(true);
  const [keboard, showKeyboard] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    const unsubscribe1 = navigation.addListener('blur', () => {
      resetFocus(false);
    });
    return () => {
      unsubscribe1();
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    showKeyboard(true);
  };

  const _keyboardDidHide = () => {
    currentlyFocused('');
    showKeyboard(false);
  };

  const openDialog = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      _Toast('danger', 'Please enter valid email!');
      return;
    }
    if (password && email) {
      setIsVisible(true);
    } else {
      _Toast('danger', 'Please enter your email and password');
    }
  };
  const onSubmit = () => {
    setIsVisible(false);
    if (password && email) {
      const data = {
        email: email,
        password: password,
      };
      changeEmailRequestDispatch(data);
    } else {
      _Toast('danger', 'Please enter your email and password');
    }
  };

  useEffect(() => {
    if (changeEmailRequested) {
      navigation.navigate('VerifyCodeEmailScreen', { email: email, password: password });
    }
  }, [changeEmailRequested]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsVisible(false);
  //   }, 1500);
  // }, [isLoading]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
          <View style={{ overflow: 'hidden' }}>
            <Topheader
              onPressLeft={() => navigation.goBack()}
              currentIndex={colors.background == '#fff' ? 0 : 1}
              origin={'Change Email Address'}
              showChatIcon={false}
            />
          </View>
          <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <View style={styles.container}>
              <KeyboardAwareScrollView
                style={{ height: '88%' }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={true}>
                <Text
                  style={{
                    color: colors.text,
                    paddingVertical: RFValue(15),
                    fontFamily: FontFamily.normal,
                  }}>
                  You can{' '}
                  <Text style={{ color: colors.text, fontFamily: FontFamily.bold }}>
                    Change your email address
                  </Text>{' '}
                  To change your email address enter your new email and your password below and
                  press continue, you will receive a email with verification code.
                </Text>
                <Text style={{ color: colors.text, paddingVertical: RFValue(10) }}>
                  Enter new email and password to continue.
                </Text>
                <View>
                  <Text
                    style={[
                      styles.label,
                      { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                    ]}>
                    Email
                  </Text>
                  <Input
                    autoCapitalize={'none'}
                    // isSecure={true}
                    keyboardType={'email-address'}
                    testProp={'emailInputField'}
                    style={[
                      styles.input,
                      {
                        borderColor: current == 'name' ? Color.Orange : colors.inputBorder,
                        backgroundColor: colors.inputInnerColor,
                        color: colors.text,
                      },
                    ]}
                    onChangeText={(value) => setEmail(value)}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.label,
                      { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                    ]}>
                    Password
                  </Text>
                  <Input
                    autoCapitalize={'none'}
                    isSecure={true}
                    testProp={'passwordInputField'}
                    style={[
                      styles.input,
                      {
                        borderColor: current == 'name' ? Color.Orange : colors.inputBorder,
                        backgroundColor: colors.inputInnerColor,
                        color: colors.text,
                      },
                    ]}
                    onChangeText={(value) => setPassword(value)}
                  />
                </View>
                {isLoading ? (
                  <TouchableHighlight
                    onPress={openDialog}
                    underlayColor="none"
                    style={{ marginTop: RFValue(20) }}>
                    <LinearGradient
                      colors={['#FB6200', '#EF0059']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={styles.loginButton}>
                      <ActivityIndicator color={'#fff'} size={'small'} />
                    </LinearGradient>
                  </TouchableHighlight>
                ) : (
                  <TouchableHighlight
                    onPress={openDialog}
                    underlayColor="none"
                    style={{ marginTop: RFValue(20) }}>
                    <LinearGradient
                      colors={['#FB6200', '#EF0059']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={styles.loginButton}>
                      <Text {...testProps('supportBtn')} style={{ color: '#fff' }}>
                        Continue
                      </Text>
                    </LinearGradient>
                  </TouchableHighlight>
                )}
                <TouchableHighlight
                  underlayColor="none"
                  style={{ marginTop: RFValue(20) }}
                  onPress={() => navigation.goBack()}>
                  <Button
                    style={styles.outlineButton}
                    transparent
                    onPress={() => navigation.goBack()}>
                    <Text
                      {...testProps('supportBtn')}
                      style={{
                        width: '100%',
                        color: '#FB6200',
                        textAlign: 'center',
                        alignSelf: 'center',
                      }}>
                      Cancel
                    </Text>
                  </Button>
                </TouchableHighlight>
              </KeyboardAwareScrollView>
            </View>
          </View>
          <View>
            <Modal
              testID={'modal'}
              isVisible={isVisible}
              onBackdropPress={() => setIsVisible(false)}
              swipeDirection={['up', 'left', 'right', 'down']}
              style={styles.view}>
              <View style={{ backgroundColor: colors.card, borderRadius: RFValue(10) }}>
                <View
                  style={{
                    width: '100%',
                    paddingVertical: RFValue(10),
                    borderBottomWidth: 1,
                    borderBottomColor: colors.background == '#fff' ? '#F2F2F7' : Color.LightGrey3,
                  }}>
                  <View
                    style={{
                      borderWidth: 3,
                      borderRadius: 50,
                      borderColor: Color.LightGrey1,
                      width: 100,
                      alignSelf: 'center',
                      marginTop: 10,
                    }}
                  />
                  {/* <Text
                    style={{
                      color: colors.text,
                      alignSelf: 'center',
                      fontFamily: FontFamily.medium,
                      paddingTop: RFValue(15),
                    }}></Text> */}
                </View>
                <View style={{ width: '100%', paddingTop: RFValue(5) }}>
                  <Text
                    style={{
                      color: colors.text,
                      alignSelf: 'center',
                      fontFamily: FontFamily.normal,
                      paddingTop: RFValue(15),
                      width: widthPercentageToDP(80),
                      textAlign: 'center',
                    }}>
                    Are you sure you want to change your email address?{' '}
                  </Text>
                  <View
                    style={{
                      marginBottom: RFValue(35),
                      flexDirection: 'row',
                      width: '100%',
                      justifyContent: 'center',
                    }}>
                    <TouchableHighlight
                      onPress={() => setIsVisible(false)}
                      underlayColor="none"
                      style={{ marginTop: RFValue(20) }}>
                      <Button
                        onPress={() => setIsVisible(false)}
                        style={[
                          styles.outlineButton,
                          { maxWidth: RFValue(140), marginRight: RFValue(10) },
                        ]}
                        transparent>
                        <Text
                          {...testProps('supportBtn')}
                          style={{
                            width: '100%',
                            color: '#FB6200',
                            textAlign: 'center',
                            alignSelf: 'center',
                          }}>
                          Cancel
                        </Text>
                      </Button>
                    </TouchableHighlight>
                    {isLoading ? (
                      <TouchableHighlight underlayColor="none" style={{ marginTop: RFValue(20) }}>
                        <LinearGradient
                          colors={['#FB6200', '#EF0059']}
                          start={{ x: 1, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          style={[styles.loginButton, { maxWidth: 180, minWidth: 180 }]}>
                          <ActivityIndicator color={'#fff'} size={'small'} />
                        </LinearGradient>
                      </TouchableHighlight>
                    ) : (
                      <TouchableHighlight
                        underlayColor="none"
                        style={{ marginTop: RFValue(20) }}
                        onPress={onSubmit}>
                        <LinearGradient
                          colors={['#FB6200', '#EF0059']}
                          start={{ x: 1, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          style={[styles.loginButton, { maxWidth: 180, minWidth: 180 }]}>
                          <Text {...testProps('supportBtn')} style={{ color: '#fff' }}>
                            Yes
                          </Text>
                        </LinearGradient>
                      </TouchableHighlight>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};
function mapStateToProps(state) {
  return {
    changeEmailRequested: state.user.changeEmailRequested,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeEmailRequestDispatch: (payload) => dispatch(changeEmailRequest(payload)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmailScreen);
