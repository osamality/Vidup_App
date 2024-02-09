import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'native-base';
import { styles } from './styled';
import { connect } from 'react-redux';
import { Color, FontFamily } from 'constants';
import { logout, darkLogout } from 'assets';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import { Switch } from 'native-base';
import { Topheader } from '../../../../components';
import {
  updateNotificationSettings,
  getNotificationSettings,
} from '../../../../../store/actions/user';
import testProps from 'locatorId';

const Notifications = (props) => {
  const {
    navigation,
    getNotificationSettings,
    notificationSettings,
    isLoading,
    updateUserNotificationSettings,
    updateNotificationState,
  } = props;
  const { colors } = useTheme();
  const [comments, setComments] = useState(false);
  const [follows, setFollows] = useState(false);
  const [likes, setLikes] = useState(false);
  const [mention, setMention] = useState(false);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      getNotificationSettings();
    });
    return () => {
      unsubscribe1();
    };
  }, []);

  const onNotificationSubmit = (value, type) => {
    notificationSettings[type] = value;
    updateUserNotificationSettings(notificationSettings);
    updateNotificationState(notificationSettings);
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
            origin={'Notifications'}
            showChatIcon={false}
          />
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            paddingTop: RFValue(15),
            paddingBottom: RFValue(10),
            backgroundColor: colors.background,
          }}>
          <View>
            <Text
              {...testProps('drawerNotificationTitle')}
              style={[styles.bodyText, { color: colors.text, fontFamily: FontFamily.medium }]}>
              Push Notifications
            </Text>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 5,
            backgroundColor: colors.background,
            flex: 1,
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Text style={[styles.bodyText, { color: colors.text }]}>Comments</Text>
            <Switch
              {...testProps('drawerNotificationCommentsSwitch')}
              value={notificationSettings?.comments}
              onValueChange={(e) => onNotificationSubmit(e, 'comments')}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Text style={[styles.bodyText, { color: colors.text }]}>Likes</Text>
            <Switch
              {...testProps('drawerNotificationLikesSwitch')}
              value={notificationSettings?.likes}
              onValueChange={(e) => onNotificationSubmit(e, 'likes')}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Text style={[styles.bodyText, { color: colors.text }]}>Follows</Text>
            <Switch
              {...testProps('drawerNotificationFollowsSwitch')}
              value={notificationSettings?.follows}
              onValueChange={(e) => onNotificationSubmit(e, 'follows')}
            />
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
              borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            }}>
            <Text style={[styles.bodyText, { color: colors.text }]}>Mentions</Text>
            <Switch
              {...testProps('drawerNotificationMentionSwitch')}
              value={notificationSettings?.mention}
              onValueChange={(e) => onNotificationSubmit(e, 'mention')}
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
    notificationSettings: state.user.notificationSettings,
    isLoading: state.RequestLoaders.isRequested,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
    getNotificationSettings: () => dispatch(getNotificationSettings()),
    updateUserNotificationSettings: (settings) => dispatch(updateNotificationSettings(settings)),
    updateNotificationState: (data) =>
      dispatch({
        type: 'Notification_Settings',
        payload: data,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
