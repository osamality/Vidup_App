import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View, Keyboard, Pressable, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Text, Thumbnail, Picker, Item } from 'native-base';
import { connect } from 'react-redux';
import { updateUser, updateProfilePic } from '../../../../../store/actions/user';
import { styles } from './editAboutStyled';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { _Toast, ConfirmationModal } from '../../../../components';
import CountryPicker, { DARK_THEME, DEFAULT_THEME } from 'react-native-country-picker-modal';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Color } from 'constants';
const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';
import { Statusbar, ProfileThumb } from 'components';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { noUserPlaceholder } from 'assets';
import { useTheme } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const dateMinusOne = new Date();
dateMinusOne.setDate(dateMinusOne.getDate() - 1);
dateMinusOne.toISOString();

const EditAboutInformation = (props) => {
  const {
    user,
    isUserUpdated,
    isLoading,
    route,
    editProfilePicDispatch,
    clearStateDispatch,
    updateUserDispatch,
    clearUpdateDispatch,
    navigation,
  } = props;
  const [userProfile, setUserProfile] = useState(user);
  const [previousUser, setOld] = useState(user);
  const [focused, resetFocus] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(
    user.country_code != '' && user.countryCode != null ? user.country_code : 'PK',
  );
  const [selectedCallingCode, setSelectedCallingCode] = useState('92');
  const [gender, selectGender] = useState(user.gender);
  const [current, currentlyFocused] = useState('');
  const [keboard, showKeyboard] = useState(false);
  const [updatingPic, setPicCheck] = useState(false);
  const [profilePack, setPack] = useState('');
  const [userThumb, setThumb] = useState(user.profile_pic ? user.profile_pic : noUserPlaceholder);
  const [isVisible, showModal] = useState({ check: false, type: 'general' });
  const [updateUname, showDialog] = useState(false);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const { colors } = useTheme();

  const onChange = (event) => {
    const currentDate = event || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleChange = (key, value) => {
    if (key == 'phone_number') {
      let selectedCountry = selectedCountry;
      setUserProfile({ ...userProfile, [key]: value });
    } else {
      setUserProfile({ ...userProfile, [key]: value });
    }
  };

  useEffect(() => {
    if (route?.params?.ImageUri) {
      let image = route?.params?.ImageUri;
      setPicCheck(true);
      if (Platform.OS == 'ios') {
        let type = image.filename.split('.', 2);
        let types = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG', 'heic', 'HEIC'];
        if (types.indexOf(type[1]) >= 0) {
          imageCompress(image);
        } else {
          _Toast('danger', `Selected image format "${type[1]}" not supported!`);
        }
      } else {
        imageCompress(image);
      }
    }
  }, [route?.params]);

  const clearState = () => {
    navigation.navigate('LoginScreen');
    clearStateDispatch();
    _Toast(
      'warning',
      'Your email has been updated. Kindly verify new email using forget password!',
    );
  };

  const onSave = (proceed) => {
    if (!userProfile.name || userProfile.name == ' ') {
      _Toast('danger', 'Please enter name first');
      return;
    }
    if (userProfile.name.length < 7 || userProfile.name.length > 30) {
      _Toast(
        'danger',
        'Name length should be greater than 6 characters and less than 30 characters.',
      );
      return;
    }
    if (!userProfile.username) {
      _Toast('danger', 'Please enter username first');
      return;
    }
    if (userProfile.username.length < 7 || userProfile.username.length > 22) {
      _Toast(
        'danger',
        'Username length should be greater than 6 characters and less than 21 characters. Please try again!',
      );
      return;
    }
    if (userProfile.username.indexOf(' ') >= 0) {
      _Toast('danger', 'Username can not have a whitespace');
      return;
    }
    if (!userProfile.email) {
      _Toast('danger', 'Please enter email first');
      return;
    }
    if (userProfile.email.indexOf(' ') >= 0) {
      _Toast('danger', 'Email can not have a whitespace');
      return;
    }
    let pNumber = userProfile.phone_number ? userProfile.phone_number : '';
    if (pNumber.indexOf(' ') >= 0) {
      _Toast('danger', 'Phone number can not have a whitespace');
      return;
    }
    if (pNumber.length > 15) {
      _Toast('danger', 'Ensure that Phone Number field has no more than 15 characters.');
      return;
    }
    if (userProfile.username != previousUser.username && !proceed) {
      showDialog(true);
      return;
    }
    showDialog(false);
    userProfile['country_code'] = selectedCountry;
    userProfile['calling_Code'] = selectedCallingCode;
    setPicCheck(false);
    updateUserDispatch(userProfile, previousUser);
  };

  useEffect(() => {
    if (isVisible.check == false) {
      if (isVisible.type == 'camera') {
        if (Platform.OS == 'ios') {
          setTimeout(() => {
            _OpenCamera();
          }, 1000);
        } else {
          _OpenCamera();
        }
      } else if (isVisible.type == 'gallery') {
        if (Platform.OS == 'ios') {
          setTimeout(() => {
            openPicker();
          }, 1000);
        } else {
          openPicker();
        }
      }
    }
  }, [isVisible]);

  const _OpenCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      imageCompress(image.path);
    });
  };

  const openPicker = () => {
    ImagePicker.openPicker({
      // width: 60,
      // height: 60,
      cropping: true,
      //compressImageQuality: 1
    }).then((image) => {
      setPicCheck(true);
      if (Platform.OS == 'ios') {
        let type = image.filename.split('.', 2);
        let types = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG', 'heic', 'HEIC'];
        if (types.indexOf(type[1]) >= 0) {
          // imageCompress(image.path);
        } else {
          _Toast('danger', `Selected image format "${type[1]}" not supported!`);
        }
      } else {
        imageCompress(image.path);
      }
    });
  };

  const imageCompress = (path) => {
    ImageResizer.createResizedImage(path, 100, 100, 'JPEG', 100, 0, undefined)
      .then((response) => {
        setPack(response.uri);
        editProfilePicDispatch(response);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    if (isUserUpdated.isSuccess && !updatingPic) {
      navigation.navigate('HomeScreen');
      clearUpdateDispatch();
    }
    const unsubscribe1 = navigation.addListener('blur', () => {
      resetFocus(false);
      clearUpdateDispatch();
    });
    return () => {
      unsubscribe1();
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, [isUserUpdated]);

  useEffect(() => {
    setThumb(user.profile_pic);
  }, [user.profile_pic]);

  const _keyboardDidShow = () => {
    showKeyboard(true);
  };

  const _keyboardDidHide = () => {
    currentlyFocused('');
    showKeyboard(false);
  };
  const updateCountry = (value) => {
    setSelectedCallingCode(value.callingCode[0]);
    setSelectedCountry(value.cca2);
  };
  const triggerStyles = {
    triggerText: {
      color: 'white',
    },
    triggerWrapper: {
      padding: 5,
      backgroundColor: 'transparent',
    },
    triggerTouchable: {
      underlayColor: 'transparent',
      activeOpacity: 70,
    },
  };

  return (
    <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
      <SafeAreaView style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        <Statusbar />
        <ConfirmationModal
          isVisible={updateUname}
          isLoading={false}
          discriptionText={
            'Are you sure you want to update your Username as well, you will need to login again?'
          }
          actionName="Continue"
          cancellationName="Cancel"
          hideConfirmation={() => showDialog(false)}
          onPress={() => onSave(true)}
        />
        {focused && (
          <Spinner
            visible={isLoading}
            textContent={'Please Wait...'}
            textStyle={{ fontSize: 16, color: '#fff' }}
          />
        )}
        <View style={styles.container}>
          <View style={styles.topBar}>
            <TouchableOpacity
              {...testProps('editProfileUpdateCloseBtn')}
              onPress={() => navigation.navigate('HomeScreen')}>
              <View style={{ width: 50 }}>
                <Icon type="AntDesign" name="close" style={{ fontSize: 22, color: colors.text }} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              {...testProps('editProfileUpdateSaveBtn')}
              onPress={() => onSave(false)}>
              <View style={{ width: 50 }}>
                <Icon type="AntDesign" name="check" style={{ color: '#FB6200', paddingLeft: 10 }} />
              </View>
            </TouchableOpacity>
          </View>

          <KeyboardAwareScrollView style={{ height: '88%' }} showsVerticalScrollIndicator={false}>
            <View style={styles.thumbnailSection}>
              <Touch onPress={() => showModal({ check: true, type: 'general' })}>
                {user.profile_pic ? (
                  <ProfileThumb
                    testProp={'editProfileThumbImage'}
                    profilePic={userThumb}
                    style={{ borderRadius: 82, height: 82, width: 82 }}
                  />
                ) : (
                  <Thumbnail
                    style={{ borderRadius: 82, height: 82, width: 82 }}
                    source={noUserPlaceholder}
                  />
                )}

                <View
                  {...testProps('editProfileCameraBtn')}
                  style={{
                    position: 'absolute',
                    backgroundColor: '#ffff',
                    width: 30,
                    height: 30,
                    borderRadius: 50,
                    bottom: 0,
                    right: 1,
                    shadowColor: '#000',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.32,
                    shadowRadius: 5.46,

                    elevation: 9,
                  }}>
                  <Icon type="SimpleLineIcons" name="camera" style={{ fontSize: 12 }} />
                </View>
              </Touch>
            </View>
            <View>
              <Text
                {...testProps('editProfileTextNameLabel')}
                style={[
                  styles.label,
                  { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                ]}>
                Name
              </Text>
              <TextInput
                {...testProps('editProfileTextNameInput')}
                onFocus={() => currentlyFocused('name')}
                value={userProfile.name}
                onChangeText={(e) => handleChange('name', e)}
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
            <View>
              <Text
                {...testProps('editProfileTextUsernameLabel')}
                style={[
                  styles.label,
                  { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                ]}>
                Username
              </Text>
              <TextInput
                {...testProps('editProfileTextUsernameInput')}
                onFocus={() => currentlyFocused('uname')}
                value={userProfile.username}
                onChangeText={(e) => handleChange('username', e)}
                style={[
                  styles.input,
                  {
                    borderColor: current == 'uname' ? Color.Orange : colors.inputBorder,
                    backgroundColor: colors.inputInnerColor,
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View>
              <Text
                {...testProps('editProfileTextBioLabel')}
                style={[
                  styles.label,
                  { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                ]}>
                Bio
              </Text>
              <TextInput
                {...testProps('editProfileTextBioInput')}
                onFocus={() => currentlyFocused('bio')}
                multiline
                value={userProfile.bio}
                onChangeText={(e) => {
                  if (e.length <= 250) {
                    handleChange('bio', e);
                  } else {
                    _Toast('danger', 'Maximum length is 250 characters');
                  }
                }}
                style={[
                  styles.input,
                  {
                    borderColor: current == 'bio' ? Color.Orange : colors.inputBorder,
                    backgroundColor: colors.inputInnerColor,
                    color: colors.text,
                    paddingTop: RFValue(12),
                  },
                ]}
              />
            </View>
            <View>
              <Text
                {...testProps('editBirthday')}
                style={[
                  styles.label,
                  { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                ]}>
                Date of birth
              </Text>
              <Pressable
                onPress={() => {
                  currentlyFocused('dob');
                  setShow(true);
                }}>
                <Text
                  style={[
                    styles.input,
                    {
                      borderColor: current == 'dob' ? Color.Orange : colors.inputBorder,
                      backgroundColor: colors.inputInnerColor,
                      color: colors.text,
                    },
                  ]}>
                  {userProfile.date_of_birth}
                </Text>
              </Pressable>

              <DatePicker
                modal
                androidVariant={'iosClone'}
                open={show}
                date={date}
                mode={'date'}
                maximumDate={dateMinusOne}
                textColor={colors.text}
                onConfirm={(date) => {
                  setShow(false);
                  handleChange('date_of_birth', moment(date).utc().format('YYYY-MM-DD'));
                }}
                onCancel={() => {
                  setShow(false);
                }}
              />
            </View>
            <View>
              <Text
                {...testProps('editProfileTextEmailLabel')}
                style={[
                  styles.label,
                  { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                ]}>
                Email
              </Text>
              <TextInput
                {...testProps('editProfileTextEmailInput')}
                onFocus={() => currentlyFocused('email')}
                editable={false}
                value={userProfile.email}
                onChangeText={(e) => handleChange('email', e)}
                style={[
                  styles.input,
                  {
                    borderColor: current == 'email' ? Color.Orange : colors.inputBorder,
                    backgroundColor: colors.inputInnerColor,
                    color: colors.text,
                  },
                ]}
              />
            </View>
            <View>
              <Text
                {...testProps('editProfileTextPhoneLabel')}
                style={[
                  styles.label,
                  { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                ]}>
                Phone Number
              </Text>
              <View
                style={[
                  styles.input,
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 0,
                    borderColor: current == 'phone' ? Color.Orange : colors.inputBorder,
                    backgroundColor: colors.inputInnerColor,
                    color: colors.text,
                  },
                ]}>
                <CountryPicker
                  theme={colors.background !== '#fff' ? DARK_THEME : DEFAULT_THEME}
                  countryCode={selectedCountry}
                  containerButtonStyle={{ alignItems: 'center', padding: RFValue(8) }}
                  withFilter={true}
                  withCallingCodeButton={true}
                  withFlagButton={false}
                  withAlphaFilter={true}
                  withCallingCode={true}
                  onSelect={(value) => updateCountry(value)}
                />

                <Icon
                  testID={'editProfilePhoneNumberBtn'}
                  type="AntDesign"
                  name="caretdown"
                  style={{ marginLeft: RFValue(0), fontSize: RFValue(10), color: colors.text }}
                />
                <View
                  style={{
                    width: 1,
                    height: RFValue(32),
                    backgroundColor: '#d0d0d0',
                    marginHorizontal: RFValue(10),
                  }}></View>
                <TextInput
                  {...testProps('editProfileTextPhoneInput')}
                  onFocus={() => currentlyFocused('phone')}
                  keyboardType={'phone-pad'}
                  value={userProfile.phone_number}
                  onChangeText={(e) => handleChange('phone_number', e)}
                  style={[
                    styles.input,
                    { borderWidth: 0, width: '75%', paddingHorizontal: 1, color: colors.text },
                  ]}
                />
              </View>
              {/* <TextInput value={userProfile.phone} onChangeText={(e) => handleChange('phone', e)} style={styles.input} /> */}
            </View>
            <View
              style={{
                paddingBottom: 30,
              }}>
              <Text
                {...testProps('editProfileTextGenderLabel')}
                style={[
                  styles.label,
                  { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                ]}>
                Gender
              </Text>
              <Menu>
                <MenuTrigger
                  customStyles={{
                    triggerText: {
                      color: 'white',
                    },
                    triggerWrapper: {
                      backgroundColor: 'transparent',
                    },
                    triggerTouchable: {
                      underlayColor: 'transparent',
                      activeOpacity: 0.1,
                    },
                  }}>
                  <View
                    {...testProps('editProfileTextGeanderSelectedText')}
                    style={[
                      styles.input,
                      {
                        borderColor: colors.inputBorder,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: colors.inputInnerColor,
                      },
                    ]}>
                    <Text style={{ color: colors.text }}>
                      {userProfile.gender ? userProfile.gender : 'Select Gender'}
                    </Text>
                    <Icon
                      type="AntDesign"
                      name="caretdown"
                      style={{ marginLeft: RFValue(0), fontSize: 12, color: colors.text }}
                    />
                  </View>
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={{
                    marginTop: -85,
                    width: widthPercentageToDP('90%'),
                    marginRight: RFValue(10),
                    backgroundColor: colors.card,
                  }}>
                  <MenuOption
                    style={{ marginVertical: RFValue(5) }}
                    onSelect={() => handleChange('gender', 'Male')}>
                    <Text
                      {...testProps('editProfileMenuOptionMale')}
                      style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                      Male
                    </Text>
                  </MenuOption>
                  <MenuOption
                    style={{ marginVertical: RFValue(5) }}
                    onSelect={() => handleChange('gender', 'Female')}>
                    <Text
                      {...testProps('editProfileMenuOptionFemale')}
                      style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                      Female
                    </Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <ConfirmationModal
          isVisible={isVisible.check}
          isLoading={false}
          discriptionText={'Select from gallery or camera?'}
          actionName="Camera"
          cancellationName="Gallery"
          hideConfirmation={() => showModal({ check: false, type: 'general' })}
          onPress={() => showModal({ check: false, type: 'camera' })}
          secondPress={() => showModal({ check: false, type: 'gallery' })}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditAboutInformation);
