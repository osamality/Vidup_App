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

import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Color, FontFamily } from 'constants';
import Modal from 'react-native-modal';
import { deActivateAccount } from '../../../../../../store/actions/user';
import { _Toast, Topheader, Input } from '../../../../../components';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { verify } from 'assets';

const VerifyProgress = (props) => {
  const { navigation, deActivateAccount, isLoading, userVerifiedStatus } = props;
  const { colors } = useTheme();
  const [current, currentlyFocused] = useState('');
  const [focused, resetFocus] = useState(true);
  const [keboard, showKeyboard] = useState(false);
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
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
    }, 1200);
  }, [isLoading]);
  const openDialog = () => {
    if (password) {
      setIsVisible(true);
    } else {
      _Toast('danger', 'Please enter your password');
    }
  };
  const onSubmit = () => {
    if (password) {
      deActivateAccount(password);
    } else {
      _Toast('danger', 'Please enter your password');
    }
  };

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            onPressLeft={() => navigation.navigate('ManageAccountScreen')}
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={'Account Verification'}
            showChatIcon={false}
          />
        </View>
        <View style={{ ...styles.container, backgroundColor: colors.background }}>
          <KeyboardAwareScrollView
            style={{ marginTop: '60%' }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={true}>
            <Image
              source={colors.background == '#fff' ? verify : verify}
              style={{
                alignSelf: 'center',
                resizeMode: 'contain',
                height: 80,
                tintColor: colors.background == '#fff' ? '#A8A8A8' : '#F2F2F7',
              }}
              resizeMode={'contain'}
            />
            <Text style={{ color: colors.text, textAlign: 'center', marginVertical: 30 }}>
              {userVerifiedStatus.message
                ? userVerifiedStatus.message
                : userVerifiedStatus.data?.result
                ? userVerifiedStatus.data?.result
                : 'Your account verification is in progress. This may take upto 14 working days.'}
            </Text>
          </KeyboardAwareScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    isLoading: state.RequestLoaders.isRequested,
    userVerifiedStatus: state.user.userVerifiedStatus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deActivateAccount: (password) => dispatch(deActivateAccount(password)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(VerifyProgress);
