import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View, SafeAreaView, Image } from 'react-native';
import { Text } from 'native-base';
import { connect } from 'react-redux';
import { fetchUserById } from '../../../../../store/actions/user';
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';
import { useTheme } from '@react-navigation/native';
import { lockDark, lockLight } from 'assets';
import testProps from 'locatorId';

const clearState = () => {
  clearStateDispatch();
};
const PublicAbout = (props) => {
  const { route, updatedUser, fetchUserDispatch, navigation, publicUser } = props;

  const [visitingUser, setUser] = useState(route.params?.userVisited);

  const { colors } = useTheme();

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
        {route.params.userVisited.is_private && !route.params.userVisited.follow_back ? (
          <View
            style={{
              backgroundColor: '#fafafa',
              flex: 1,
              borderTopWidth: colors.background == '#fff' ? 5 : 0,
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
              <View
                style={{
                  fontSize: 18,
                  justifyContent: 'center',
                  borderColor: 'transparent',
                  shadowColor: '#000',
                  borderTopWidth: 4,
                  borderRadius: 3,
                  flex: 1,
                }}>
                <Image
                  {...testProps('publicProfileNoVideosImg')}
                  source={colors.background == '#fff' ? lockLight : lockDark}
                  style={{ alignSelf: 'center', tintColor: Color.LightGrey1 }}
                />
                <Text
                  {...testProps('publicProfileNoVideoText')}
                  style={{
                    color: Color.LightGrey1,
                    alignSelf: 'center',
                    marginTop: RFValue(10),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  This account is private
                </Text>
                <Text
                  {...testProps('publicProfileNoVideoText')}
                  style={{
                    color: Color.LightGrey1,
                    alignSelf: 'center',
                    marginTop: RFValue(1),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  Follow this account for more info.
                </Text>
              </View>
            </SafeAreaView>
          </View>
        ) : (
          <ScrollView style={{ marginHorizontal: 20 }}>
            <View style={{ marginTop: 30 }}>
              <Text {...testProps('publicProfileaboutNameLabel')} style={_styles.label}>
                Name
              </Text>
              <Text {...testProps('publicProfileaboutNameText')} style={_styles.value}>
                {visitingUser.name !== 'null' ? visitingUser.name : ''}
              </Text>
            </View>
            <View>
              <Text {...testProps('publicProfileaboutUsernameLabel')} style={_styles.label}>
                Username
              </Text>
              <Text {...testProps('publicProfileaboutUsernameText')} style={_styles.value}>
                {visitingUser.username !== 'null' ? visitingUser.username : ''}
              </Text>
            </View>
            <View>
              <Text {...testProps('publicProfileaboutBioLabel')} style={_styles.label}>
                Bio
              </Text>
              <Text {...testProps('publicProfileaboutBioText')} style={_styles.value}>
                {visitingUser.bio !== 'null' ? visitingUser.bio : ''}
              </Text>
            </View>
            <View>
              <Text {...testProps('publicProfileaboutEmailLabel')} style={_styles.label}>
                Email
              </Text>
              <Text {...testProps('publicProfileaboutEmailText')} style={_styles.value}>
                {visitingUser.email !== 'null' ? visitingUser.email : ''}
              </Text>
            </View>
            <View>
              <Text {...testProps('publicProfileaboutPhoneLabel')} style={_styles.label}>
                Phone
              </Text>
              <Text {...testProps('publicProfileaboutPhoneText')} style={_styles.value}>
                {visitingUser?.calling_Code !== null ? `+${visitingUser.calling_Code}` : ''}
                {visitingUser.phone_number !== null ? visitingUser.phone_number : ''}
              </Text>
            </View>
            <View>
              <Text {...testProps('publicProfileaboutGenderLabel')} style={_styles.label}>
                Gender
              </Text>
              <Text {...testProps('publicProfileaboutGenderText')} style={_styles.value}>
                {visitingUser.gender !== 'null' ? visitingUser.gender : ''}
              </Text>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    savedUser: state.user.user,
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

export default connect(mapStateToProps, mapDispatchToProps)(PublicAbout);
