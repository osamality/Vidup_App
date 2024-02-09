import React, { useEffect, useRef, useState } from 'react';
import { TouchableHighlight, View, Keyboard, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Text, Thumbnail, Picker, Item, Textarea } from 'native-base';
import { connect } from 'react-redux';
import { styles } from './styled';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import LinearGradient from 'react-native-linear-gradient';
const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';
import { Statusbar } from 'components';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { noUserPlaceholder } from 'assets';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Color, FontFamily } from 'constants';
import { Topheader } from '../../../../../components';
import { saveSupportTicket } from '../../../../../../store/actions/user';
import { _Toast } from '../../../../../../src/components';

const Support = (props) => {
  const { navigation, saveSupportTicket, isLoading } = props;
  const { colors } = useTheme();
  const [current, currentlyFocused] = useState('');
  const [focused, resetFocus] = useState(true);
  const [keboard, showKeyboard] = useState(false);
  const [requestedFeature, setRequestedFeature] = useState('Request New Feature');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitDisabled, setSubmitDisabled] = useState(true);

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

  useEffect(() => {
    if (message && name && email) {
      setSubmitDisabled(false);
    }else{
      setSubmitDisabled(true);
    }
  }, [message, email, name]);

  const onSubmit = () => {
    if (message == '') {
      _Toast('danger', 'Please enter your Message!');
      return;
    } else if (message.length < 10) {
      _Toast('danger', 'Message should atleast contain 3 words!');
      return;
    } else if (name == '') {
      _Toast('danger', 'Please enter your Name!');
      return;
    } else if (email == '') {
      _Toast('danger', 'Please enter your email!');
      return;
    } else if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      _Toast('danger', 'Please enter valid email!');
      return;
    } else {
      if (requestedFeature && message && name && email) {
        let tempObject = {
          requested_feature: requestedFeature,
          message: message,
          name,
          email,
        };
        saveSupportTicket(tempObject, () => {
          setMessage('');
          setEmail('');
          setName('');
        });
      } else {
        _Toast('danger', 'Please enter all fields');
      }
    }
  };

  return (
    <View style={[styles.MainContainer, { backgroundColor: colors.card }]}>
      <SafeAreaView
        style={[styles.MainContainer, { backgroundColor: colors.card }]}
        edges={['top']}>
        <Statusbar />
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            onPressLeft={() => navigation.goBack()}
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={'Support'}
            showChatIcon={false}
          />
        </View>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={styles.container}>
            <KeyboardAwareScrollView style={{ height: '88%' }} showsVerticalScrollIndicator={false}>
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Request Type
                </Text>
                <Menu>
                  <MenuTrigger>
                    <View
                      style={[
                        styles.input,
                        {
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: colors.inputInnerColor,
                        },
                      ]}>
                      <Text style={{ color: colors.text }}>{requestedFeature}</Text>
                      <Icon
                        type="AntDesign"
                        name="caretdown"
                        style={{ marginLeft: RFValue(0), fontSize: 12, color: colors.text }}
                      />
                    </View>
                  </MenuTrigger>
                  <MenuOptions
                    optionsContainerStyle={{
                      width: widthPercentageToDP('90%'),
                      backgroundColor: colors.card,
                      marginTop: 55,
                      marginLeft: 0,
                    }}>
                    <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => setRequestedFeature('Request New Feature')}>
                      <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                        Request New Feature
                      </Text>
                    </MenuOption>
                    <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => setRequestedFeature('New Inquiry')}>
                      <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                        New Inquiry
                      </Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Message
                </Text>
                <Textarea
                  style={[
                    styles.input,
                    {
                      borderRadius: RFValue(5),
                      borderColor: current == 'name' ? Color.Orange : colors.inputBorder,
                      backgroundColor: colors.inputInnerColor,
                      color: colors.text,
                    },
                  ]}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                  rowSpan={3}
                  placeholderTextColor={colors.text}
                  placeholder="Describe your suggestion or complain..."
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Your Name
                </Text>
                <TextInput
                  value={name}
                  style={[
                    styles.input,
                    {
                      borderColor: current == 'name' ? Color.Orange : colors.inputBorder,
                      backgroundColor: colors.inputInnerColor,
                      color: colors.text,
                    },
                  ]}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Your Email
                </Text>
                <TextInput
                  editable={true}
                  value={email}
                  style={[
                    styles.input,
                    {
                      borderColor: current == 'email' ? Color.Orange : colors.inputBorder,
                      backgroundColor: colors.inputInnerColor,
                      color: colors.text,
                    },
                  ]}
                  onChangeText={(email) => setEmail(email)}
                  autoCapitalize="none"
                />
              </View>

              {!isLoading ? (
                <TouchableHighlight
                  underlayColor="none"
                  style={{ marginTop: RFValue(20) }}
                  onPress={onSubmit}>
                  <LinearGradient
                    colors={['#FB6200', '#EF0059']}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    disabled={submitDisabled}
                    style={[styles.loginButton, { 
                      opacity: submitDisabled ? 0.5 : 1
                      }]}>
                    <Text {...testProps('supportBtn')} style={{ color: '#fff' }}>
                      Submit
                    </Text>
                  </LinearGradient>
                </TouchableHighlight>
              ) : (
                <TouchableHighlight underlayColor="none" style={{ marginTop: RFValue(20) }}>
                  <LinearGradient
                    colors={['#FB6200', '#EF0059']}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.loginButton}>
                    <ActivityIndicator color="#fff" size="small" />
                  </LinearGradient>
                </TouchableHighlight>
              )}
            </KeyboardAwareScrollView>
          </View>
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
    saveSupportTicket: (supportInformation, callback) =>
      dispatch(saveSupportTicket(supportInformation, callback)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Support);
