import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, Platform, SafeAreaView } from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import { fetchUserById } from '../../../../../store/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

const clearState = () => {
  clearStateDispatch();
};

const dateMinusOne = new Date();
dateMinusOne.setDate(dateMinusOne.getDate() - 1);
dateMinusOne.toISOString();

const About = (props) => {
  const { savedUser, updatedUser, fetchUserDispatch, navigation, publicUser, visitingUser } = props;

  const [user, setUser] = useState(savedUser);
  const [date, setDate] = useState(new Date());
  const { colors } = useTheme();

  const onChange = (event) => {
    const currentDate = event || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const _styles = {
    label: {
      fontSize: RFValue(12),
      fontFamily: FontFamily.regular,
      color: colors.background == '#fff' ? Color.MediumGrey : colors.text,
    },
    value: {
      fontSize: RFValue(14),
      marginTop: RFValue(4),
      marginBottom: RFValue(25),
      fontFamily: FontFamily.regular,
      color: colors.background == '#fff' ? Color.DarkGrey : colors.text,
    },
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        borderTopWidth: 5,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4.62,
        elevation: 4,
      }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <TouchableOpacity onPress={clearState}></TouchableOpacity>
        <ScrollView style={{ marginHorizontal: 20 }}>
          <View style={{ marginTop: 30 }}>
            <Text {...testProps('profileScreenAboutTabNameLabel')} style={_styles.label}>
              Name
            </Text>
            <Text {...testProps('profileScreenAboutTabNameText')} style={_styles.value}>
              {visitingUser.name !== 'null' ? visitingUser.name : ''}
            </Text>
          </View>
          <View>
            <Text {...testProps('profileScreenAboutTabUsernameLabel')} style={_styles.label}>
              Username
            </Text>
            <Text {...testProps('profileScreenAboutTabUsernameText')} style={_styles.value}>
              {visitingUser.username !== 'null' ? visitingUser.username : ''}
            </Text>
          </View>
          <View>
            <Text {...testProps('profileScreenAboutTabBioLabel')} style={_styles.label}>
              Bio
            </Text>
            <Text {...testProps('profileScreenAboutTabBioText')} style={_styles.value}>
              {visitingUser.bio !== 'null' ? visitingUser.bio : ''}
            </Text>
          </View>
          <View>
            <Text {...testProps('profileScreenAboutTabEmailLabel')} style={_styles.label}>
              Email
            </Text>
            <Text {...testProps('profileScreenAboutTabEmailText')} style={_styles.value}>
              {visitingUser.email !== 'null' ? visitingUser.email : ''}
            </Text>
          </View>
          <View>
            <Text {...testProps('profileScreenAboutTabDobLabel')} style={_styles.label}>
              Date of Birth
            </Text>
            <Text {...testProps('profileScreenAboutTabDobText')} style={_styles.value}>
              {visitingUser?.date_of_birth}
            </Text>
          </View>
          <View>
            <Text {...testProps('profileScreenAboutTabPhoneLabel')} style={_styles.label}>
              Phone
            </Text>
            <Text {...testProps('profileScreenAboutTabPhoneText')} style={_styles.value}>
              {visitingUser?.calling_Code ? `+${visitingUser.calling_Code}` : ''}
              {visitingUser?.phone_number ? visitingUser.phone_number : ''}
            </Text>
          </View>
          <View>
            <Text {...testProps('profileScreenAboutTabGenderLabel')} style={_styles.label}>
              Gender
            </Text>
            <Text {...testProps('profileScreenAboutTabGenderText')} style={_styles.value}>
              {visitingUser.gender !== 'null' ? visitingUser.gender : ''}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    savedUser: state.user.user,
    visitingUser: state.user.visitingUser,
    updatedUser: state.user.updateUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchUserDispatch: (userId) => dispatch(fetchUserById(userId)),
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(About);
