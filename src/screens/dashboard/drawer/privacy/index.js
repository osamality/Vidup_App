import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'native-base';
import { styles } from './styled';
import { connect } from 'react-redux';
import { Color, FontFamily } from 'constants';
import { logout, darkLogout } from 'assets';
import { RFValue } from 'react-native-responsive-fontsize';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useTheme } from '@react-navigation/native';
import { Switch } from 'native-base';
import { Topheader } from '../../../../components';
import { updatePrivateMode } from '../../../../../store/actions/user';
import testProps from 'locatorId';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const Privacy = (props) => {
  const { navigation, updateUserDispatch, user } = props;
  const { colors } = useTheme();

  const [privateAccountCheck, setPrivateAccountCheck] = useState(user.is_private);
  const [viewCountCheck, setViewCountCheck] = useState(user.is_video_view_count);
  const [tagTypeName, setTagTypeName] = useState(user.tag_in_post);
  const [previousUser, setOld] = useState(user);
  const [userProfile, setUserProfile] = useState(user);

  const handlePrivateCheck = async (e, key) => {
    userProfile[key] = e;
    updateUserDispatch(userProfile, previousUser);
  };

  const handleCountCheck = async (e, key) => {
    userProfile[key] = e;
    updateUserDispatch(userProfile, previousUser);
  };

  const handleTagCheck = async (e, key) => {
    userProfile[key] = e;
    updateUserDispatch(userProfile, previousUser);
  };

  const handleChange = (key, value) => {
    setTagTypeName(value);

    handleTagCheck(key, 'tag_in_post');
  };

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      {/* {
        isLoading &&
        <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 999, flexDirection: 'column', alignContent: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} size="small" />
        </View>
      } */}
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            onPressLeft={() => navigation.goBack()}
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={'Privacy'}
            showChatIcon={false}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingTop: RFValue(15),
              paddingBottom: RFValue(10),
              backgroundColor: colors.background,
            }}>
            <View>
              <Text
                {...testProps('')}
                style={[styles.bodyText, { color: colors.text, fontFamily: FontFamily.medium }]}>
                Private Account
              </Text>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: 10,
                paddingBottom: RFValue(25),
                borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
              }}>
              <Text style={[styles.bodyText, { color: colors.text }]}>
                Turning this toggle ON will hide your videos from the people who don’t follow you.
              </Text>
              <Switch
                {...testProps('')}
                value={privateAccountCheck}
                onValueChange={(e) => {
                  setPrivateAccountCheck(e, 'is_private');
                  handlePrivateCheck(e, 'is_private');
                }}
              />
            </View>
          </View>
          {privateAccountCheck && (
            <>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingTop: RFValue(15),
                  paddingBottom: RFValue(10),
                  backgroundColor: colors.background,
                }}>
                <View>
                  <Text
                    {...testProps('')}
                    style={[
                      styles.bodyText,
                      { color: colors.text, fontFamily: FontFamily.medium },
                    ]}>
                    View Counts
                  </Text>
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingTop: 10,
                    paddingBottom: RFValue(25),
                    borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
                  }}>
                  <Text style={[styles.bodyText, { color: colors.text }]}>
                    Turning this toggle OFF will hide the view counts on your videos.
                  </Text>
                  <Switch
                    {...testProps('')}
                    value={!viewCountCheck}
                    onValueChange={(e) => {
                      setViewCountCheck(!e, 'viewCountCheck');
                      handleCountCheck(!e, 'is_video_view_count');
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  paddingHorizontal: 25,
                  paddingBottom: RFValue(10),
                  backgroundColor: colors.background,
                }}>
                <Text
                  {...testProps('')}
                  style={[
                    styles.label,
                    // { color: colors.background == '#fff' ? Color.MediumGrey : colors.text },
                  ]}>
                  Who can tag you in their post?
                </Text>
                <Menu>
                  <MenuTrigger
                    customStyles={{
                      triggerText: {
                        color: 'white',
                      },
                      triggerWrapper: {
                        backgroundColor: 'transparent',
                      },
                      triggerTouchable: {
                        underlayColor: 'transparent',
                        activeOpacity: 0.1,
                      },
                    }}>
                    <View
                      {...testProps('')}
                      style={[
                        styles.input,
                        {
                          borderColor: colors.inputBorder,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: colors.inputInnerColor,
                        },
                      ]}>
                      <Text style={{ color: colors.text }}>
                        {tagTypeName === 'OnlyMe' ? 'No One' : tagTypeName}
                      </Text>
                      <Icon
                        type="AntDesign"
                        name="caretdown"
                        style={{ marginLeft: RFValue(0), fontSize: 12, color: colors.text }}
                      />
                    </View>
                  </MenuTrigger>
                  <MenuOptions
                    optionsContainerStyle={{
                      marginTop: 45,
                      width: widthPercentageToDP('86%'),
                      marginRight: RFValue(10),
                      backgroundColor: colors.card,
                    }}>
                    {/* <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => handleChange('Everyone', 'Everyone')}>
                      <Text
                        {...testProps('')}
                        style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                        Everyone
                      </Text>
                    </MenuOption> */}
                    <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => handleChange('Followers', 'Followers')}>
                      <Text
                        {...testProps('')}
                        style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                        Followers
                      </Text>
                    </MenuOption>
                    <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => handleChange('OnlyMe', 'No One')}>
                      <Text
                        {...testProps('')}
                        style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                        No One
                      </Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
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
    updateUserDispatch: (user, previousUser) => dispatch(updatePrivateMode(user, previousUser)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Privacy);
