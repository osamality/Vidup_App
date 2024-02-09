import React, { useEffect, useState } from 'react';
import { View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VerifyCode } from 'components';
import { connect } from 'react-redux';
import { changeEmailRequest, verifyEmailCode } from '../../../../../../../store/actions/user';
import { Topheader } from '../../../../../../components';
import { useTheme } from '@react-navigation/native';

const VerifyCodeResetEmailScreen = (props) => {
  const {
    navigation,
    user,
    verifyEmailCodeDispatch,
    changeEmailRequested,
    changeEmailRequestDispatch,
  } = props;
  const { colors } = useTheme();

  const email = props.route.params.email;
  const password = props.route.params.password;
  const [focused, resetFocus] = useState(true);
  const [userProfile, setUserProfile] = useState(user);

  const onNext = (code) => {
    const payload = {
      email: email.toLowerCase(),
      code: code,
      user_id: userProfile.id,
    };
    userProfile['email'] = email.toLowerCase();

    verifyEmailCodeDispatch(payload, userProfile);
  };

  useEffect(() => {
    if (changeEmailRequested === false) {
      navigation.navigate('Profile', {
        screen: 'ProfileHome',
      });
    }
  }, [changeEmailRequested]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetFocus(false);
    });
    const unsubscribe1 = navigation.addListener('focus', () => {
      global.canceled = false;
      resetFocus(true);
    });
    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, [user]);

  const onResendCode = () => {
    const data = {
      email: email,
      password: password,
    };
    changeEmailRequestDispatch(data);
  };

  return (
    focused && (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
            <View style={{ overflow: 'hidden' }}>
              <Topheader
                onPressLeft={() => navigation.goBack()}
                currentIndex={colors.background == '#fff' ? 0 : 1}
                origin={'Change Email Verification'}
                showChatIcon={false}
              />
            </View>
            <VerifyCode
              buttonText="Next"
              onPress={(code) => onNext(code)}
              email={email}
              onResendCode={() => onResendCode()}
            />
          </SafeAreaView>
        </View>
      </TouchableWithoutFeedback>
    )
  );
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    email: state.user.forgotPassword.email,
    changeEmailRequested: state.user.changeEmailRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeEmailRequestDispatch: (payload) => dispatch(changeEmailRequest(payload)),
    verifyEmailCodeDispatch: (patload, user, previousUser) =>
      dispatch(verifyEmailCode(patload, user, previousUser)),
    changeEmailRequestedStatus: () => {
      dispatch({
        type: 'CHANGE_EMAIL_REQUEST',
        payload: false,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyCodeResetEmailScreen);
