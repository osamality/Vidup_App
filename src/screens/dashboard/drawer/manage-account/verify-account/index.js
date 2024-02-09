import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableHighlight,
  View,
  Keyboard,
  TextInput,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon, Text, Thumbnail, Picker, Item, Button } from 'native-base';
import { connect } from 'react-redux';
import { styles } from './styled';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { binIcon } from 'assets';

import LinearGradient from 'react-native-linear-gradient';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Color, FontFamily } from 'constants';
import Modal from 'react-native-modal';
import { _Toast, Topheader, Input } from '../../../../../components';
import { verifyAccountRequest } from '../../../../../../store/actions/user';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { UnfollowConfirm } from 'components';
import { Pressable } from 'react-native';

const AccountVerification = (props) => {
  const { navigation, verifyAccountRequestDispatch, isLoading, user, userVerifiedStatus } = props;
  const { colors } = useTheme();
  const [current, currentlyFocused] = useState('');
  const [focused, resetFocus] = useState(true);
  const [keboard, showKeyboard] = useState(false);
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentTypeName, setDocumentTypeName] = useState('Select Document');
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [isVisibleDoc, showModal] = useState(false);
  const [documentImage, setDocumentImage] = useState();

  const imageCompress = (path) => {
    ImageResizer.createResizedImage('file://' + path.path, 100, 100, 'JPEG', 100, 0, undefined)
      .then((response) => {
        // console.log('response:::::::', response);
        setDocumentImage(response);
        // setPack(response.uri);
        // editProfilePicDispatch(response);
      })
      .catch((err) => {});
  };

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

  const removeDoc = () => {
    showModal(true);
  };

  const cancelRemoveDoc = () => {
    showModal(false);
  };

  const onConfirmRemoveDoc = () => {
    showModal(false);
    setPicCheck(false);
    setDocumentImage();
  };

  const handleChange = (key, value) => {
    setDocumentType(key);
    setDocumentTypeName(value);
  };

  const _keyboardDidShow = () => {
    showKeyboard(true);
  };

  const _keyboardDidHide = () => {
    currentlyFocused('');
    showKeyboard(false);
  };

  useEffect(() => {
    if (fullname && documentType && documentImage) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
    if (!fullname || !documentImage || !documentType) {
      setSubmitDisabled(true);
    }
  }, [username, fullname, documentImage, documentType]);

  const openPicker = () => {
    ImagePicker.openPicker({
      // width: 60,
      // height: 60,
      cropping: true,
      //compressImageQuality: 1
    }).then((image) => {
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
    });
  };

  useEffect(() => {
    console.log('userVerifiedStatus::::1', userVerifiedStatus);

    userVerifiedStatus?.message
      ? userVerifiedStatus.message ==
          'Your account verification is in progress.This may take upon 14 working days.' &&
        navigation.navigate('VerifyProgressScreen')
      : {};

    userVerifiedStatus.data
      ? (userVerifiedStatus.data.result_code === 1 || userVerifiedStatus.data.result_code === 2) &&
        navigation.navigate('VerifyProgressScreen')
      : {};
  }, [userVerifiedStatus]);

  const onSubmit = () => {
    //   _Toast('danger', 'Please enter your current password!');
    let imgFormat = documentImage.path.substring(documentImage.path.lastIndexOf('.') + 1);
    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('name', fullname);
    formData.append('document_type', documentType);
    formData.append('document', {
      uri: Platform.OS == 'ios' ? documentImage.uri : 'file://' + documentImage.path,
      name:
        Platform.OS == 'ios' ? documentImage.name.toLowerCase() : documentImage.name.toLowerCase(),
      type: 'image/' + imgFormat,
    });

    console.log(formData);
    verifyAccountRequestDispatch(formData);
  };

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        <UnfollowConfirm
          isVisible={isVisibleDoc}
          type={'removeDocument'}
          isLoading={false}
          hideConfirmation={() => cancelRemoveDoc()}
          onUnfollow={() => onConfirmRemoveDoc()}
        />
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            onPressLeft={() => navigation.goBack()}
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={'Account Verification'}
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
                Verify your account and get a{' '}
                <Text style={{ color: colors.text, fontFamily: FontFamily.bold }}>
                  checked badge
                </Text>{' '}
                next to your name. This shows that you are the real presence of a public figure,
                celebrity or brand.
              </Text>
              <Text style={{ color: colors.text, paddingVertical: RFValue(10) }}>
                Enter the details below and we’ll determine if your account meets our verification
                criteria.
              </Text>
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Username
                </Text>
                <Input
                  editable={false}
                  value={`@${user.username}`}
                  autoCapitalize={'none'}
                  testProp={'passwordInputField'}
                  style={[
                    styles.input,
                    {
                      borderColor: current == 'name' ? Color.Orange : colors.inputBorder,
                      backgroundColor: colors.inputInnerColor,
                      color: colors.text,
                    },
                  ]}
                  onChangeText={(value) => setUsername(value)}
                />
              </View>
              <View>
                <Text
                  style={[
                    styles.label,
                    { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Full Name
                </Text>
                <Input
                  value={fullname}
                  autoCapitalize={'none'}
                  testProp={'passwordInputField'}
                  style={[
                    styles.input,
                    {
                      borderColor: current == 'name' ? Color.Orange : colors.inputBorder,
                      backgroundColor: colors.inputInnerColor,
                      color: colors.text,
                    },
                  ]}
                  onChangeText={(value) => setFullname(value)}
                />
              </View>
              <View>
                <Text
                  {...testProps('editProfileTextGenderLabel')}
                  style={[
                    styles.label,
                    { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Identification Document
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
                      <Text style={{ color: colors.text }}>{documentTypeName}</Text>
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
                      onSelect={() => handleChange('driverLicense', "Driver's License")}>
                      <Text
                        {...testProps('editProfileMenuOptionMale')}
                        style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                        Driver's License
                      </Text>
                    </MenuOption>
                    <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() =>
                        handleChange('nationalIdentityCard', ' National Identity Card')
                      }>
                      <Text
                        {...testProps('editProfileMenuOptionFemale')}
                        style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                        National Identity Card
                      </Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
              {documentImage ? (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', paddingTop: RFValue(15) }}>
                  <Text style={{ color: colors.text }}>{'Driving License Front & Back.jpeg'}</Text>
                  <TouchableWithoutFeedback onPress={() => removeDoc()}>
                    <Image
                      source={colors.background == '#fff' ? binIcon : binIcon}
                      style={styles.binIcon}
                      resizeMode={'contain'}
                    />
                  </TouchableWithoutFeedback>
                </View>
              ) : (
                <TouchableHighlight
                  underlayColor="none"
                  style={{ marginTop: RFValue(20) }}
                  onPress={() => openPicker()}>
                  <Button style={styles.outlineButton} transparent onPress={() => openPicker()}>
                    <Text
                      {...testProps('supportBtn')}
                      style={{
                        width: '100%',
                        color: '#FB6200',
                        textAlign: 'center',
                        alignSelf: 'center',
                      }}>
                      Choose File
                    </Text>
                  </Button>
                </TouchableHighlight>
              )}
              <View style={{ marginTop: RFValue(15) }}>
                <Text style={{ color: colors.text }}>
                  Please note that you have to continue following the{' '}
                  <Text
                    onPress={() => {
                      navigation.push('LegalInformation');
                    }}
                    style={{
                      color: '#007AFF',
                      textDecorationLine: 'underline',
                    }}>
                    {' '}
                    Terms and Conditions
                  </Text>{' '}
                  to stay verified.
                </Text>
              </View>
              {!isLoading ? (
                <TouchableHighlight
                  onPress={() => onSubmit()}
                  // onPress={openDialog}
                  underlayColor="none"
                  disabled={submitDisabled}
                  style={{
                    marginTop: RFValue(15),
                    opacity: submitDisabled ? 0.5 : 1,
                    marginBottom: '5%',
                  }}>
                  <LinearGradient
                    colors={['#FB6200', '#EF0059']}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.loginButton}>
                    <Text {...testProps('supportBtn')} style={{ color: '#fff' }}>
                      Submit
                    </Text>
                  </LinearGradient>
                </TouchableHighlight>
              ) : (
                <LinearGradient
                  colors={['#FB6200', '#EF0059']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={{
                    ...styles.loginButton,
                    marginTop: RFValue(15),
                    opacity: submitDisabled ? 0.5 : 1,
                    marginBottom: '5%',
                  }}>
                  <ActivityIndicator color="#fff" size="small" />
                </LinearGradient>
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
    userVerifiedStatus: state.user.userVerifiedStatus,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    verifyAccountRequestDispatch: (payload) => dispatch(verifyAccountRequest(payload)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(AccountVerification);
