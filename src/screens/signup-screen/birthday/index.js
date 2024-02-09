import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, Platform } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './styled';
import { updateBirthday } from '../../../../store/actions/user';
import { connect } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import moment from 'moment';
import { Color, FontFamily } from 'constants';
import DatePicker from 'react-native-date-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import testProps from 'locatorId';
import { useTheme } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { TermsModal } from '../../../components/termsModal';
import { PrivacyModal } from '../../../components/privacyModal';

const BirthdayScreen = (props) => {
  const { colors } = useTheme();
  const navigation = props.navigation;
  const { user, updateDateOfBirthDispatch, isLoading } = props;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleTerms, setIsVisibleTerms] = useState(false);
  const [fcmToken, setToken] = useState('');

  const dateMinusOne = new Date();
  dateMinusOne.setDate(dateMinusOne.getDate() - 1);
  dateMinusOne.toISOString();

  const onChange = (event) => {
    const currentDate = event || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const registerAppWithFCM = async () => {
    await messaging()
      .getToken()
      .then((fcm) => {
        setToken(fcm);
      });
  };

  useEffect(() => {
    registerAppWithFCM();
  }, []);

  const onSubmit = () => {
    const payload = {
      userId: user.id,
      device_token: fcmToken,
      dob: moment(date).format('YYYY-MM-DD'),
    };
    updateDateOfBirthDispatch(payload);
  };

  const showMode = () => {
    setShow(true);
  };

  const onBackClick = () => {
    setIsVisible(false);
  };

  const onBackClickTerms = () => {
    setIsVisibleTerms(false);
  };

  useEffect(() => {}, [date]);

  useEffect(() => {
    if (user.token) {
      //alert("You are already Signed In with this email!!");
      navigation.navigate('Dashboard');
    }
  }, [user]);
  return (
    <View style={{ backgroundColor: colors.background, flex: 1, paddingHorizontal: wp('12%') }}>
      <Text
        {...testProps('birthdayTitleOnSignUpScreen')}
        style={{
          fontSize: RFValue(14),
          fontFamily: FontFamily.regular,
          letterSpacing: 1,
          color: colors.text,
          marginTop: hp('3%'),
        }}>
        Select your birthday
      </Text>

      <View style={{ alignSelf: 'center' }}>
        <DatePicker
          {...testProps('birdayDate')}
          mode="date"
          androidVariant="nativeAndroid"
          date={date}
          maximumDate={dateMinusOne}
          textColor={colors.text}
          onDateChange={onChange}
        />
      </View>

      <TouchableHighlight onPress={onSubmit} underlayColor="none">
        <LinearGradient
          colors={['#FB6200', '#EF0059']}
          start={{ x: 1, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={styles.loginButton}>
          {!isLoading ? (
            <Text {...testProps('birthdaySignUpBtnonSignUpScreen')} style={styles.whiteColor}>
              Sign Up
            </Text>
          ) : (
            <ActivityIndicator color="white" size="small" />
          )}
        </LinearGradient>
      </TouchableHighlight>
      <Text
        style={{
          fontSize: RFValue(12),
          fontFamily: FontFamily.regular,
          letterSpacing: 1,
          color: Color.MediumGrey,
          marginTop: hp('3%'),
        }}>
        By clicking the Sign Up button, you agree to our{' '}
        <Text
          onPress={() => {
            navigation.navigate('TermAndServiceScreen');
          }}
          style={{
            color: Color.Blue,
            textDecorationLine: 'underline',
            fontFamily: FontFamily.medium,
            fontSize: RFValue(12),
          }}>
          Terms of Service
        </Text>{' '}
        and have read and acknowledge our{' '}
        <Text
          onPress={() => {
            navigation.navigate('PrivacyPolicyOnAuthScreen');
          }}
          style={{
            color: Color.Blue,
            textDecorationLine: 'underline',
            fontFamily: FontFamily.medium,
            fontSize: RFValue(12),
          }}>
          Privacy Policy.
        </Text>
      </Text>
      <PrivacyModal isVisible={isVisible} onBackClick={onBackClick} />
      <TermsModal isVisible={isVisibleTerms} onBackClick={onBackClickTerms} />
    </View>
  );
};

function mapStateToProps(state) {
  return {
    user: state.user.user,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateDateOfBirthDispatch: (payload) => dispatch(updateBirthday(payload)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BirthdayScreen);
