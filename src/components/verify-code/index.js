import React, { createRef, useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ColorPropType,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import CountDown from 'react-native-countdown-component';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { Color, FontFamily } from 'constants';
import testProps from 'locatorId';
import { Item, Input } from 'native-base';
import { _Toast } from 'components';

//Redux
import { forgotPassword } from '../../../store/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';

const VerifyCodeComponent = (props) => {
  const {
    isLoading,
    buttonText,
    onPress,
    onResendCode,
    forgotPassword,
    user,
    forgotPasswordDispatch,
    email,
  } = props;

  let OTPInputRef = useRef(null);
  const { colors } = useTheme();
  let [code, setCode] = useState('');
  let [isFocused, setisFocused] = useState([true, false, false, false, false, false]);
  let [resendBtn, setResend] = useState(false);
  let [countDown, resetCounter] = useState(59);

  useEffect(() => {
    setTimeout(() => {
      OTPInputRef.focusField(0);
    }, 500);
  }, []);

  const codeResend = () => {
    onResendCode();
    setCode('');
    resetCounter(59);
    setResend(false);
  };

  const _sendCode = (code) => {
    if (!code) {
      _Toast('danger', 'Please enter OTP');
      return;
    }
    if (code.length < 6) {
      _Toast('danger', 'Please enter complete six digit OTP');
      return;
    }
    let isNum = /^\d+$/.test(code);
    if (!isNum) {
      _Toast('danger', 'OTP can not contain characters other than digits.');
      return;
    } else {
      onPress(code);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        <View style={styles.container}>
          <Text
            {...testProps('otpTitle')}
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: '300',
              fontFamily: FontFamily.regular,
              marginTop: 20,
              letterSpacing: 1,
              lineHeight: 20,
              marginBottom: 10,
            }}>
            Please enter the{' '}
            <Text style={{ fontWeight: '500', fontFamily: FontFamily.regular, fontSize: 14 }}>
              6 digit code
            </Text>{' '}
            sent to <Text style={{ fontWeight: '400' }}>{email}</Text>
          </Text>
          <OTPInputView
            ref={(ref) => {
              OTPInputRef = ref;
            }}
            {...testProps('otpInput')}
            style={{ width: '100%', height: hp('7%') }}
            pinCount={6}
            keyboardType={'phone-pad'}
            autoFocusOnLoad={false}
            code={code}
            onCodeChanged={setCode}
            //placeholderCharacter="-"
            placeholderTextColor={colors.text}
            codeInputHighlightStyle={styles.borderStyleHighLighted}
            codeInputFieldStyle={[styles.codeInput, { color: colors.text, fontSize: 15 }]}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(otp) => {
              _sendCode(otp);
            }}
          />

          {isLoading ? (
            <TouchableHighlight underlayColor="none">
              <LinearGradient
                colors={['#FB6200', '#EF0059']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.loginButton}>
                <ActivityIndicator color="#fff" size="small" />
              </LinearGradient>
            </TouchableHighlight>
          ) : (
            <TouchableHighlight onPress={() => _sendCode(code)} underlayColor="none">
              <LinearGradient
                colors={['#FB6200', '#EF0059']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.loginButton}>
                <Text {...testProps('verifyCodeBtn')} style={styles.whiteColor}>
                  {buttonText}
                </Text>
              </LinearGradient>
            </TouchableHighlight>
          )}
          <Text
            style={{
              textAlign: 'left',
              lineHeight: 14,
              fontWeight: '300',
              marginVertical: 7,
              marginTop: 20,
              color: colors.text,
              fontFamily: FontFamily.regular,
              fontSize: 12,
            }}>
            If you do not receive the code in the email address you provided then check your spam.
          </Text>
          <Text
            style={{
              textAlign: 'left',
              lineHeight: 14,
              fontWeight: '300',
              marginVertical: 7,
              color: colors.text,
              fontFamily: FontFamily.regular,
              fontSize: 12,
            }}>
            After one minute you can click on resend button to try again.
          </Text>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.text,
                fontFamily: FontFamily.light,
                fontSize: 14,
              }}>
              Resend Code in{' '}
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: '500',
                  fontFamily: FontFamily.regular,
                }}>
                00:
              </Text>
            </Text>
            {!resendBtn ? (
              <CountDown
                until={countDown}
                onFinish={() => setResend(true)}
                digitStyle={{ alignItems: 'flex-start' }}
                digitTxtStyle={{ fontFamily: FontFamily.medium, color: colors.text }}
                timeToShow={['S']}
                timeLabels={{ s: null }}
                size={RFValue(16)}
              />
            ) : (
              <Text
                style={{
                  fontWeight: '500',
                  fontFamily: FontFamily.regular,
                  textAlign: 'center',
                  color: colors.text,
                  fontSize: 16,
                }}>
                00
              </Text>
            )}
          </View>
          {resendBtn && (
            <TouchableHighlight onPress={() => codeResend()} underlayColor="none">
              <Text
                {...testProps('resendCodeBtnOnSignUpScreen')}
                style={{
                  textAlign: 'center',
                  marginTop: 20,
                  fontWeight: '400',
                  textDecorationLine: 'underline',
                  color: Color.Blue,
                }}>
                Resend
              </Text>
            </TouchableHighlight>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 35,
    height: '100%',
  },
  loginButton: {
    height: hp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 5,
  },
  whiteColor: {
    color: '#fff',
  },
  codeInput: {
    height: RFValue(40),
    width: RFValue(40),
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#D0D0D0',
    textAlign: 'center',
    color: 'black',
    marginHorizontal: 3,
  },
  borderStyleBase: {
    width: 30,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: Color.Orange,
  },

  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
  },

  underlineStyleHighLighted: {
    borderColor: '#03DAC6',
  },
});

function mapStateToProps(state) {
  return {
    isLoading: state.RequestLoaders.isRequested,
    user: state.user.user,
    forgotPassword: state.user.forgotPassword,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    forgotPasswordDispatch: (email) => dispatch(forgotPassword(email)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyCodeComponent);
