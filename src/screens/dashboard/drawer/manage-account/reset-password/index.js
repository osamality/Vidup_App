import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableHighlight,
  View,
  Keyboard,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Text, Thumbnail, Picker, Item, Textarea } from 'native-base';
import { connect } from 'react-redux';
import { styles } from './styled';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Color, FontFamily } from 'constants';
import { changePassword } from '../../../../../../store/actions/user';
import { _Toast, Topheader } from '../../../../../../src/components';
import { IconButton, Input, Link } from '../../../../../../src/components';
const ChangePasswordScreen = (props) => {
  const { user, changePassword, isLoading, changePasswordDispatch, navigation } = props;
  const { colors } = useTheme();
  const [current, currentlyFocused] = useState('');
  const [focused, resetFocus] = useState(true);
  const [keboard, showKeyboard] = useState(false);

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

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // useEffect(() => {
  //     if (changePassword.isPasswordChanged) {
  //         navigation.navigate('LoginScreen');
  //     }
  // }, [changePassword])

  const onNext = () => {
    // navigation.navigate('LoginScreen');
    // return
    if (currentPassword == '') {
      _Toast('danger', 'Please enter your current password!');
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
    if (confirmPassword == '') {
      _Toast('danger', 'Please confirm your password!');
      return;
    }
    if (password != confirmPassword) {
      _Toast('danger', 'New password and confirm password do not match!');
      return;
    } else {
      const payLoad = {
        old_password: currentPassword,
        new_password: password,
      };
      changePasswordDispatch(payLoad);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
          <View style={{ overflow: 'hidden' }}>
            <Topheader
              onPressLeft={() => navigation.goBack()}
              currentIndex={colors.background == '#fff' ? 0 : 1}
              origin={'Change Password'}
              showChatIcon={false}
            />
          </View>
          <View style={{ backgroundColor: colors.background, flex: 1 }}>
            <View style={styles.container}>
              <KeyboardAwareScrollView
                style={{ height: '88%' }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={'always'}>
                <View>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.background == '#fff' ? Color.MediumGrey : colors.text,
                      },
                    ]}>
                    Current Password
                  </Text>
                  {/* <TextInput style={[styles.input, { borderColor: current == 'name' ? Color.Orange : colors.inputBorder, backgroundColor: colors.inputInnerColor, color: colors.text }]} onChangeText={(e) => setCurrentPassword(e)} secureTextEntry={true}/> */}
                  <Input
                    autoCapitalize={'none'}
                    isSecure={true}
                    testProp={'currentPasswordInputField'}
                    onChangeText={(e) => setCurrentPassword(e)}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.background == '#fff' ? Color.MediumGrey : colors.text,
                      },
                    ]}>
                    New Password
                  </Text>
                  {/* <TextInput style={[styles.input, { borderColor: current == 'name' ? Color.Orange : colors.inputBorder, backgroundColor: colors.inputInnerColor, color: colors.text }]} onChangeText={(e) => setPassword(e)} secureTextEntry={true}/> */}
                  <Input
                    autoCapitalize={'none'}
                    isSecure={true}
                    testProp={'passwordInputField'}
                    onChangeText={(e) => setPassword(e)}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.label,
                      {
                        color: colors.background == '#fff' ? Color.MediumGrey : colors.text,
                      },
                    ]}>
                    Confirm New Password
                  </Text>
                  {/* <TextInput editable={true} style={[styles.input, { borderColor: current == 'email' ? Color.Orange : colors.inputBorder, backgroundColor: colors.inputInnerColor, color: colors.text }]} onChangeText={(e) => setConfirmPassword(e)} secureTextEntry={true}/> */}
                  <Input
                    autoCapitalize={'none'}
                    isSecure={true}
                    testProp={'confirmPasswordInputField'}
                    onChangeText={(e) => setConfirmPassword(e)}
                  />
                </View>
                {!isLoading ? (
                  <TouchableHighlight
                    underlayColor="none"
                    style={{ marginTop: RFValue(20) }}
                    onPress={onNext}>
                    <LinearGradient
                      colors={['#FB6200', '#EF0059']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={styles.loginButton}>
                      <Text {...testProps('supportBtn')} style={{ color: '#fff' }}>
                        Change Password
                      </Text>
                    </LinearGradient>
                  </TouchableHighlight>
                ) : (
                  <LinearGradient
                    colors={['#FB6200', '#EF0059']}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={[styles.loginButton, { marginTop: RFValue(20) }]}>
                    <ActivityIndicator color="#fff" size="small" />
                  </LinearGradient>
                )}
              </KeyboardAwareScrollView>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    changePassword: state.user.changePassword,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changePasswordDispatch: (payload) => dispatch(changePassword(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen);
