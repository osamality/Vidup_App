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
import { Input, _Toast } from 'components';
import { styles } from './styled';
import { resetPassword } from '../../../store/actions/user';
import { connect } from 'react-redux';
import { Color } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';

const ResetPasswordScreen = (props) => {
  const { colors } = useTheme();
  const navigation = props.navigation;
  const { user, resetPassword, isLoading, resetPasswordDispatch } = props;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (resetPassword.isPasswordChanged) {
      navigation.navigate('LoginScreen');
    }
  }, [resetPassword]);
  const onNext = () => {
    if (password == '') {
      _Toast('danger', 'Please enter your password!');
      return;
    }
    if (password.length < 6) {
      _Toast('danger', 'Password should be at least 6 characters long!');
      return;
    }
    if (confirmPassword == '') {
      _Toast('danger', 'Please confirm your password!');
      return;
    }
    if (password != confirmPassword) {
      _Toast('danger', 'New password and confirm password do not match!');
      return;
    } else {
      const payLoad = {
        email: user.email.toLowerCase(),
        new_password: password,
      };
      resetPasswordDispatch(payLoad);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        <View style={styles.container}>
          <Text
            {...testProps('NewPasswordScreen')}
            style={{
              fontSize: RFValue(12),
              color: colors.text,
              fontWeight: '200',
              marginTop: 20,
              letterSpacing: 1,
              lineHeight: 20,
              marginBottom: 10,
              marginLeft: heightPercentageToDP('1%'),
            }}>
            Please enter a new password.
          </Text>
          <View style={styles.buttonMargin}>
            <Input
              testProp={'passwordInputOnResetPassword'}
              autoCapitalize={'none'}
              placeholder="Password"
              isSecure={true}
              value={password}
              onChangeText={(e) => setPassword(e)}
            />
          </View>
          <View style={styles.buttonMargin}>
            <Input
              testProp={'confirmPasswordInputOnResetPassword'}
              autoCapitalize={'none'}
              placeholder="Confirm Password"
              isSecure={true}
              value={confirmPassword}
              onChangeText={(e) => setConfirmPassword(e)}
            />
          </View>

          {!isLoading ? (
            <TouchableHighlight onPress={onNext} underlayColor="none">
              <LinearGradient
                colors={['#FB6200', '#EF0059']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.loginButton}>
                <Text style={styles.whiteColor} {...testProps('signInBtnOnResetPassword')}>
                  Change Password
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
    user: state.user.forgotPassword,
    resetPassword: state.user.resetPassword,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetPasswordDispatch: (payload) => dispatch(resetPassword(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordScreen);
