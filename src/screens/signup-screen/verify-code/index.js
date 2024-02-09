import React, { useEffect, useState } from 'react';
import { VerifyCode } from 'components';
import { View } from 'react-native';
import { signUp } from '../../../../store/actions/user';
import { connect } from 'react-redux';
import { verifyCode, resendCode } from '../../../../store/actions/user';
import { _Toast } from '../../../components';

const VerifyCodeScreen = (props) => {
  const {
    user,
    navigation,
    isLoading,
    verifyCodeDispath,
    sendCodeDispatch,
    clearTempStateDispatch,
  } = props;
  const [focused, resetFocus] = useState(true);

  const onNext = (code) => {
    if (code == '') {
      _Toast('danger', 'Please enter verification code!');
      return;
    } else {
      const payload = {
        email: user.email,
        code: code,
      };
      verifyCodeDispath(payload);
    }
  };

  useEffect(() => {
    clearTempStateDispatch();
  }, []);

  useEffect(() => {
    if (user.verified) {
      navigation.navigate('UserNameOnSignupScreen');
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
    sendCodeDispatch(user);
  };

  return (
    focused && (
      <VerifyCode
        buttonText="Next"
        onPress={(code) => onNext(code)}
        email={user.email}
        onResendCode={() => onResendCode()}
      />
    )
  );
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    isLoading: state.RequestLoaders.isRequested,
    isSocialLogin: state.user.isSocialLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendCodeDispatch: (user) => dispatch(resendCode(user)),
    verifyCodeDispath: (user) => dispatch(verifyCode(user)),
    clearTempStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth_Temp',
        payload: {},
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyCodeScreen);
