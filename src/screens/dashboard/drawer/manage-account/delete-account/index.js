import React, { useEffect, useRef, useState } from 'react';
import { TouchableHighlight, View, Keyboard, TextInput, Platform } from 'react-native';
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
import { Topheader } from '../../../../../components';

const DeleteAccount = (props) => {
  const { navigation } = props;
  const { colors } = useTheme();
  const [current, currentlyFocused] = useState('');
  const [focused, resetFocus] = useState(true);
  const [keboard, showKeyboard] = useState(false);
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

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            onPressLeft={() => navigation.goBack()}
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={'Delete Account'}
            showChatIcon={false}
          />
        </View>
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
          <View style={styles.container}>
            <KeyboardAwareScrollView style={{ height: '88%' }} showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  color: colors.text,
                  paddingVertical: RFValue(15),
                  fontFamily: FontFamily.normal,
                }}>
                You can{' '}
                <Text style={{ color: colors.text, fontFamily: FontFamily.bold }}>
                  Deactivate your account temporarily.
                </Text>{' '}
                Your account will be disabled and all your videos will be removed. You can
                reactivate your account by logging in again to VIDUP.
              </Text>
              <Text style={{ color: colors.text, paddingVertical: RFValue(10) }}>
                Enter password to deactivate your account.
              </Text>
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Password
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: current == 'name' ? Color.Orange : colors.inputBorder,
                      backgroundColor: colors.inputInnerColor,
                      color: colors.text,
                    },
                  ]}
                />
              </View>
              <TouchableHighlight
                onPress={() => setIsVisible(true)}
                underlayColor="none"
                style={{ marginTop: RFValue(20) }}>
                <LinearGradient
                  colors={['#FB6200', '#EF0059']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.loginButton}>
                  <Text {...testProps('supportBtn')} style={{ color: '#fff' }}>
                    Deactivate Account
                  </Text>
                </LinearGradient>
              </TouchableHighlight>
              <TouchableHighlight underlayColor="none" style={{ marginTop: RFValue(20) }}>
                <Button style={styles.outlineButton} transparent>
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
                  }}></View>
                <Text
                  style={{
                    color: colors.text,
                    alignSelf: 'center',
                    fontFamily: FontFamily.medium,
                    paddingTop: RFValue(15),
                  }}>
                  We hope to see you again shortly!{' '}
                </Text>
              </View>
              <View style={{ width: '100%', paddingTop: RFValue(5) }}>
                <Text
                  style={{
                    color: colors.text,
                    alignSelf: 'center',
                    fontFamily: FontFamily.normal,
                    paddingTop: RFValue(15),
                  }}>
                  Are you sure you want to deactivate your account?{' '}
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
                  <TouchableHighlight underlayColor="none" style={{ marginTop: RFValue(20) }}>
                    <LinearGradient
                      colors={['#FB6200', '#EF0059']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={[styles.loginButton, { maxWidth: 180, minWidth: 180 }]}>
                      <Text {...testProps('supportBtn')} style={{ color: '#fff' }}>
                        Yes, Deactivate
                      </Text>
                    </LinearGradient>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    user: state.user.user,
    isUserUpdated: state.user.updateUser,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateUserDispatch: (user, previousUser) => dispatch(updateUser(user, previousUser)),
    editProfilePicDispatch: (image) => dispatch(updateProfilePic(image)),
    clearUpdateDispatch: () =>
      dispatch({
        type: 'Clear_Update_User_State',
        payload: {},
      }),
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
  };
}
export default connect(null, null)(DeactivateAccount);
