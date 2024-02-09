import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'native-base';
import { styles } from './styled';
import { connect } from 'react-redux';
import { Color, FontFamily } from 'constants';
import { shieldDark, shieldLight } from 'assets';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import { Topheader, Statusbar, Modalbtn } from '../../../components';
import { UnfollowConfirm } from 'components';
import testProps from 'locatorId';
import { Touch } from '../../../components/touch';
import { _Logout } from '../../../../store/actions/user';

const Drawer = (props) => {
  const {
    navigation,
    clearStateDispatch,
    user,
    clearFollowingFollowersDispatch,
    clearPostDispatch,
    clearSearchDispatch,
    changeEmailRequestedStatus,
    Logout,
  } = props;
  const [isVisible, showModal] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    changeEmailRequestedStatus();
  }, []);

  const clearState = () => {
    showModal(true);
  };

  const cancelSignOut = () => {
    showModal(false);
  };

  const proceedSignOut = () => {
    Logout(user.token);
    showModal(false);
    // clearStateDispatch();
    // clearFollowingFollowersDispatch();
    // clearPostDispatch();
    // clearSearchDispatch();
  };

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        <UnfollowConfirm
          isVisible={isVisible}
          type={'signout'}
          isLoading={false}
          hideConfirmation={() => cancelSignOut()}
          onUnfollow={() => proceedSignOut()}
        />
        {/* <View style={{ overflow: 'hidden' }}>
          <View style={[styles.topBar, { backgroundColor: colors.card }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon type="Entypo" name='chevron-thin-left' style={{ fontSize: 18, color: colors.text }} />
            </TouchableOpacity>
            <Text style={{ fontSize: RFValue(16), color: colors.text, fontFamily: FontFamily.medium }}>@{user.username}</Text>
            <View></View>
          </View>
        </View> */}
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            currentIndex={colors.background == '#fff' ? 0 : 1}
            onPressLeft={() => navigation.goBack()}
            textTransform={'lowercase'}
            origin={`@${user?.username}`}
            showChatIcon={false}
            textTransform={'lowercase'}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 5,
            backgroundColor: colors.background,
            flex: 1,
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Image
              source={{
                uri: colors.background == '#fff' ? 'notificationsdim' : 'notificationsdark',
              }}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity
              onPress={() => navigation.push('PushNotificationsSettingScreen')}
              underlayColor="none">
              <Text
                {...testProps('drawerNotificationBtn')}
                style={[styles.bodyText, { color: colors.text }]}>
                Notifications
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Image
              source={{ uri: colors.background == '#fff' ? 'userdim' : 'userdark' }}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity
              onPress={() => navigation.push('ManageAccountScreen')}
              underlayColor="none">
              <Text
                {...testProps('drawerManageAccountBtn')}
                style={[styles.bodyText, { color: colors.text }]}>
                Manage Account
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Image
              source={colors.background == '#fff' ? shieldLight : shieldDark}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity onPress={() => navigation.push('PrivacyScreen')} underlayColor="none">
              <Text
                {...testProps('drawerSavedBtn')}
                style={[styles.bodyText, { color: colors.text }]}>
                Privacy
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Image
              source={{ uri: colors.background == '#fff' ? 'saveddim' : 'saveddark' }}
              style={styles.bodyIcon}
              resizeMode={'contain'}
            />
            <TouchableOpacity onPress={() => navigation.push('SavedScreen')} underlayColor="none">
              <Text
                {...testProps('drawerSavedBtn')}
                style={[styles.bodyText, { color: colors.text }]}>
                Saved
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <View style={{ flexGrow: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: colors.background == '#fff' ? 'aboutdim' : 'aboutdark' }}
                style={styles.bodyIcon}
                resizeMode={'contain'}
              />
              <TouchableOpacity
                onPress={() => navigation.push('AboutSettingScreen')}
                underlayColor="none">
                <Text
                  {...testProps('drawerAboutBtn')}
                  style={[styles.bodyText, { color: colors.text }]}>
                  About
                </Text>
              </TouchableOpacity>
            </View>
            <Touch
              onPress={() => navigation.push('AboutSettingScreen')}
              style={{ alignSelf: 'flex-end' }}>
              <Icon
                type="Entypo"
                name="chevron-thin-right"
                style={{ fontSize: 18, color: colors.text }}
              />
            </Touch>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <TouchableOpacity {...testProps('drawerSignOutBtn')} onPress={clearState}>
              <Text style={[styles.bodyText, { marginHorizontal: 5, color: colors.text }]}>
                Sign out
              </Text>
            </TouchableOpacity>
            {/* <Image source={colors.background == '#fff' ? logout : darkLogout} style={styles.bodyIcon} resizeMode={'contain'} /> */}
            <Icon
              type="AntDesign"
              name="arrowright"
              style={{ fontSize: RFValue(17), color: colors.text }}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    user: state.user.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
    clearPostDispatch: () =>
      dispatch({
        type: 'CLEAR_POSTS',
        payload: {},
      }),
    clearSearchDispatch: () =>
      dispatch({
        type: 'CLEAR_SEARCH',
        payload: {},
      }),
    clearFollowingFollowersDispatch: () =>
      dispatch({
        type: 'CLEAR_FOLLOWING_FOLLOWERS',
        payload: {},
      }),
    changeEmailRequestedStatus: () => {
      dispatch({
        type: 'CHANGE_EMAIL_REQUEST',
        payload: false,
      });
    },
    Logout: (jwt) => dispatch(_Logout(jwt)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
