import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { styles } from './styled';
import { Button, Icon, Input, Item } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { updateUserName } from '../../../../store/actions/user';
import { connect } from 'react-redux';
import { _Toast } from '../../../components';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import testProps from 'locatorId';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import axios from '../../../../store/utils/axiosCongif';
import {
  chooseUsername,
  validateSocialUsername,
  fetchUserNameSuggestions,
} from '../../../../store/actions/user';
import { HeaderBackButton } from '@react-navigation/stack';

const ChooseUname = (props) => {
  const { colors } = useTheme();
  const navigation = props.navigation;
  const [userName, setUserName] = useState('');
  const {
    user,
    route,
    clearTempStateDispatch,
    isLoading,
    updateUserNameDispatch,
    chooseUsernameDispatch,
    loginRequest,
    loadingDispatch,
    loginDispatch,
    isSocialLogin,
  } = props;
  const [suggestions, setSuggestions] = useState([]);
  const [isValidUserName, setIsValidUserName] = useState(true);

  const screenNavigation = (screen) => {
    navigation.navigate(screen);
  };

  const onNext = () => {
    if (userName == '') {
      _Toast('danger', 'Please enter your username!');
      return;
    }
    if (userName.length < 6 || userName.length > 26) {
      _Toast(
        'danger',
        'Username length should be greater than 6 characters and less than 21 characters.Please try again!',
      );
      return;
    }
    if (userName.indexOf(' ') >= 0) {
      _Toast('danger', 'Username can not have a whitespace');
      return;
    } else {
      loadingDispatch(true);
      validateSocialUsername(userName, loginRequest?.email)
        .then((res) => {
          const { status, message, data, code } = res.data;
          axios.init(data.token);
          loginDispatch(data);
          loadingDispatch(false);
        })
        .catch((error) => {
          fetchUserNameSuggestions(userName)
            .then(({ data }) => {
              setIsValidUserName(false);
              setSuggestions(data.data);
              loadingDispatch(false);
            })
            .catch((error) => {
              loadingDispatch(false);
            });
        });
    }
  };

  useEffect(() => {
    clearTempStateDispatch();
  }, []);

  useEffect(() => {
    if (user.token) {
      screenNavigation('Dashboard');
    }
  }, [user]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        <View style={styles.container}>
          <Text
            {...testProps('userNameTitleOnSignUpScreen')}
            style={{
              fontSize: RFValue(14),
              fontFamily: FontFamily.regular,
              marginTop: 20,
              letterSpacing: 1,
              color: colors.text,
              marginLeft: heightPercentageToDP('1%'),
            }}>
            Choose a username
          </Text>
          <Item rounded style={{ marginTop: 10, marginBottom: 15, borderRadius: 5 }}>
            <Input
              {...testProps('userNameInputOnSignUpScreen')}
              autoCapitalize={'none'}
              style={{ paddingLeft: 20, color: colors.text }}
              value={userName}
              onChangeText={(e) => setUserName(e)}
            />
            <View>
              {/* <Text>
                {userName && (
                  <TouchableHighlight underlayColor="none" onPress={() => setUserName('')}>
                    <Icon
                      type="SimpleLineIcons"
                      name={'close'}
                      style={{ paddingRight: 10, color: colors.text, fontSize: 20 }}
                    />
                  </TouchableHighlight>
                )}
              </Text> */}
            </View>
          </Item>
          {!isValidUserName && (
            <View
              style={{
                marginLeft: 2,
                paddingRight: 17,
                borderWidth: 1,
                borderColor: 'transparent',
              }}>
              <View
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Icon
                    type="AntDesign"
                    name="warning"
                    style={{ color: '#D00000', fontSize: 16, marginLeft: 3 }}
                  />
                </View>
                <View>
                  <Text style={{ color: '#D00000', fontSize: 12, marginLeft: 10 }}>
                    This username isn’t available. Enter a new one or try one of our suggestions
                  </Text>
                </View>
              </View>
              <Text style={{ fontSize: 14, marginTop: 20, color: colors.text }}>
                Suggested Usernames
              </Text>
              <View
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {suggestions.map((elem) => {
                  return (
                    <Button
                      rounded
                      bordered
                      style={{
                        borderColor: '#F4F4F4',
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginRight: 5,
                        marginBottom: 10,
                        height: RFValue(25),
                      }}
                      onPress={() => setUserName(elem)}>
                      <Text style={{ color: colors.text, fontSize: 12 }}>{elem}</Text>
                    </Button>
                  );
                })}
              </View>
            </View>
          )}

          {!isLoading ? (
            <TouchableHighlight onPress={onNext} underlayColor="none">
              <LinearGradient
                colors={['#FB6200', '#EF0059']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.loginButton}>
                <Text {...testProps('userNameBtnOnSignUpScreen')} style={styles.whiteColor}>
                  {isSocialLogin ? 'Sign In' : 'Next'}
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
    user: state.user.user,
    isLoading: state.RequestLoaders.isRequested,
    loginRequest: state.RequestLoaders.loginRequest,
    isSocialLogin: state.user.isSocialLogin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateUserNameDispatch: (payload) => dispatch(updateUserName(payload)),
    chooseUsernameDispatch: (uname, email) => dispatch(chooseUsername(uname, email)),
    loadingDispatch: (loading) =>
      dispatch({
        type: 'LOADING',
        payload: loading,
      }),
    loginDispatch: (data) =>
      dispatch({
        type: 'LOGIN',
        payload: data,
      }),
    clearTempStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth_Temp',
        payload: {},
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChooseUname);
