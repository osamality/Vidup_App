import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Input } from 'components';
import { styles } from './styled';
import { forgotPassword } from '../../../store/actions/user';
import { connect } from 'react-redux';
import { Color } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { _Toast } from '../../components';

const ForgotPasswordScreen = (props) => {
  const { colors } = useTheme();
  const navigation = props.navigation;
  const { forgotPassword, isLoading, forgotPasswordDispatch } = props;
  const [email, setEmail] = useState(forgotPassword.email);

  useEffect(() => {
    if (forgotPassword.isCodeSent) {
      navigation.navigate('VerifyCodeOnForgotPasswordScreen', { inCommingEmail: email });
    }
  }, [forgotPassword]);
  const onNext = () => {
    if (email == '') {
      _Toast('danger', 'Please enter your email!');
      return;
    }
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      _Toast('danger', 'Please enter valid email!');
      return;
    } else {
      forgotPasswordDispatch(email);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{ backgroundColor: colors.background }}>
        <View style={styles.container}>
          <Text
            {...testProps('ResetPassowrdEmailVerificationScreen')}
            style={{
              color: colors.text,
              fontSize: RFValue(12),
              fontWeight: '200',
              marginTop: 20,
              letterSpacing: 1,
              lineHeight: 20,
              marginBottom: 10,
            }}>
            Please enter your{' '}
            <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: RFValue(12) }}>
              Email or Phone Number
            </Text>{' '}
            and we will send you a{' '}
            <Text style={{ fontWeight: 'bold', fontSize: RFValue(12) }}>6 digit code</Text> to reset
            your password.
          </Text>
          <View style={styles.buttonMargin}>
            <Input
              testProp={'forgotPasswordInput'}
              autoCapitalize={'none'}
              placeholder="Email or Phone Number"
              value={email}
              onChangeText={(e) => setEmail(e)}
            />
          </View>

          {!isLoading ? (
            <TouchableHighlight onPress={onNext} underlayColor="none">
              <LinearGradient
                colors={['#FB6200', '#EF0059']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.loginButton}>
                <Text style={styles.whiteColor} {...testProps('forgotPasswordNextButton')}>
                  Next
                </Text>
              </LinearGradient>
            </TouchableHighlight>
          ) : (
            <LinearGradient
              colors={['#FB6200', '#EF0059']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.loginButton}>
              <ActivityIndicator color="#fff" size="small" />
            </LinearGradient>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
function mapStateToProps(state) {
  return {
    forgotPassword: state.user.forgotPassword,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    forgotPasswordDispatch: (payload) => dispatch(forgotPassword(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);
