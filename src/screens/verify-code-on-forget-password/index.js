import React, { useEffect, useState } from 'react';
import { VerifyCode } from 'components';
import { connect } from 'react-redux';
import { verifyCode, resendCode } from '../../../store/actions/user';
import { BaseRouter } from '@react-navigation/native';

const VerifyCodeOnForgotPasswordScreen = (props) => {
  const { navigation, route } = props;
  const { user, email, verifyCodeDispath, sendCodeDispatch } = props;
  const [focused, resetFocus] = useState(true);
  const onNext = (code) => {
    const payload = {
      email: email.toLowerCase(),
      code: code,
    };
    verifyCodeDispath(payload);
  };

  useEffect(() => {
    if (user.verified) {
      navigation.navigate('ResetPasswordScreen');
    }
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
    let temp = user;
    temp.email = route.params?.inCommingEmail;
    sendCodeDispatch(temp);
  };

  return (
    focused && (
      <VerifyCode
        buttonText="Next"
        onPress={(code) => onNext(code)}
        email={route.params?.inCommingEmail}
        onResendCode={() => onResendCode()}
      />
    )
  );
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    email: state.user.forgotPassword.email,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendCodeDispatch: (user) => dispatch(resendCode(user)),
    verifyCodeDispath: (user) => dispatch(verifyCode(user)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyCodeOnForgotPasswordScreen);
