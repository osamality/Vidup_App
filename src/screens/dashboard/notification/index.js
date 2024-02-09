import React, { useEffect, useState } from 'react';
import { Container, Badge, View, Text, Thumbnail, Icon } from 'native-base';
import { Image } from 'react-native';
import { styles } from './styled';
import { TouchableWithoutFeedback, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { FollowerRequests } from '../../../../store/actions/follow-following';
import {
  fetchUserNotifications,
  readAllNotifications,
  updateNotificationStatus,
} from '../../../../store/actions/user';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { lightMessageIcon, darkMessageIcon } from 'assets';
const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';
import { Color, FontFamily } from 'constants';
import moment from 'moment';
import { noUserFound, noUserPlaceholder, darkNoUserFound } from 'assets';
import { useTheme } from '@react-navigation/native';
import { Statusbar, ProfileThumb, _Toast } from '../../../components';
import { fetchPostById } from '../../../../store/actions/posts';
import testProps from 'locatorId';
import { Touch } from '../../../components/touch';

const notification = (props) => {
  const {
    requests,
    getFollowerRequest,
    getUserNotifications,
    readAllNotificationDispatch,
    currentLoggedInUser,
    navigation,
    isLoading,
    notifications,
    updateNotificationStatus,
    updateNotificationCount,
    requestLoader,
  } = props;
  const [selected, select] = useState('All Activities');
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      getFollowerRequest();
      updateNotificationCount(0);
      onSelect(selected);
    });
    return () => {
      unsubscribe1();
    };
  }, []);

  useEffect(() => {
    if (isLoading) {
      if (selected == 'All Activities') {
        getUserNotifications('all_activities');
      } else if (selected == 'Comments') {
        getUserNotifications('comments');
      } else if (selected == 'Likes') {
        getUserNotifications('likes');
      }
    }
  }, [isLoading]);

  const onSubmit = (item) => {
    console.log('item', item);
    //     POST_LIKE = 1
    // COMMENT_LIKE = 2
    // REPLY_LIKE = 3
    // Comment_On_POST = 4
    // SHARED_POST_COMMENT = 5
    // COMMENT_REPLY = 6
    // STARTED_FOLLOWING = 7
    // FOLLOWING_REQUEST = 8
    // ACCEPTED_FOLLOWER_REQUEST = 9
    // WEEKLY_VIDEO_READY = 10
    // WEEKLY_VIDEO_POSTED = 11

    if (item.type == 11) {
      navigation.navigate('Profile', { screen: 'ProfileHome', params: { notificationType: 11 } });
    } else if (item.type == 1) {
      navigation.push('HomeScreen', {
        screen: 'HScreen',
        params: { screen: 'ViewAllLikedUsers', params: { postId: item?.post?.id } },
      });
    } else if (
      item.type == 4 ||
      item.type == 2 ||
      item.type == 3 ||
      item.type == 4 ||
      item.type == 6 ||
      item.type == 12 ||
      item.type == 14 ||
      item.type == 15 ||
      item.type == 13
    ) {
      fetchPostById(item?.post?.id)
        .then(({ data }) => {
          if (data.message) {
            _Toast('danger', data.message);
          } else {
            requestLoader(true);
            navigation.navigate('CommentScreen', { post: data.data });
          }
        })
        .catch((error) => {
          _Toast('danger', error.response.message);
        });
      // item.post.user = item.reciever;
      // navigation.navigate('CommentScreen', { post: item.post });
    } else if (item.type == 7 || item.type == 9) {
      if (item.sender.id === currentLoggedInUser.id)
        navigation.navigate('Profile', {
          screen: 'ProfileHome',
        });
      else
        navigation.push('HomeScreen', {
          screen: 'HScreen',
          params: {
            screen: 'PublicProfileScreen',
            params: {
              publicProfile: item.sender,
            },
          },
        });
    }
    // else if (item.type == 13) {
    //   navigation.navigate('Profile', { screen: 'ProfileHome', params: { notificationType: 13 } });
    // }
    else if (item.type == 8) {
      navigation.navigate('FollowersRequestScreen');
    }
    setTimeout((elem) => {
      updateNotificationStatus(item.id);
    }, 1000);
  };

  const onSelect = (type) => {
    select(type);
    if (type == 'All Activities') {
      getUserNotifications('all_activities');
    } else if (type == 'Comments') {
      getUserNotifications('comments');
    } else if (type == 'Likes') {
      getUserNotifications('likes');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.notificationItem}>
        {item?.sender?.profile_pic ? (
          <ProfileThumb
            testProp={'notificationUserThumb'}
            profilePic={item?.sender?.profile_pic}
            style={{ width: 45, height: 45, marginRight: 7 }}
          />
        ) : (
          <Thumbnail style={{ width: 45, height: 45, marginRight: 7 }} source={noUserPlaceholder} />
        )}
        <TouchableWithoutFeedback onPress={() => onSubmit(item)}>
          <View style={{ paddingHorizontal: 5, width: '79%', marginTop: 5 }}>
            <Text
              {...testProps('notificationUserNameAndDescription')}
              style={{
                fontSize: 12,
                fontFamily: item.status !== 'read' ? FontFamily.bold : FontFamily.regular,
                color: colors.text,
              }}>
              <Text style={{ fontSize: 12, fontFamily: FontFamily.bold, color: colors.text }}>
                {item?.sender?.username}
              </Text>{' '}
              {item?.description}
            </Text>
            <Text
              {...testProps('notificationTime')}
              style={{
                fontSize: 12,
                color: colors.background == '#fff' ? '#A8A8A8' : '#A8A8A8',
                fontFamily: FontFamily.regular,
              }}>
              {moment(item?.created_at).fromNow()}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        {item.status !== 'read' ? (
          <View {...testProps('notificationReadBadge')}>
            <Badge style={{ width: 12, height: 12, marginTop: 7 }}></Badge>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  };

  return (
    <Container>
      <Statusbar />
      <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }} edges={['top']}>
        <View style={{ overflow: 'hidden', paddingBottom: 5 }}>
          <View
            style={[
              styles.topHeader,
              {
                backgroundColor: colors.card,
                marginBottom: colors.background == '#fff' ? 6 : 0,
              },
            ]}>
            <View></View>
            <Menu>
              <MenuTrigger
                customStyles={{
                  triggerTouchable: {
                    underlayColor: 'none',
                    activeOpacity: 70,
                  },
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    {...testProps('notificationSelectedMenu')}
                    style={{
                      fontSize: RFValue(16),
                      fontFamily: FontFamily.medium,
                      marginRight: 4,
                      color: colors.text,
                    }}>
                    {selected}
                  </Text>
                  <Icon
                    type="AntDesign"
                    name="caretdown"
                    style={{ fontSize: RFValue(8), color: colors.text }}
                  />
                </View>
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  marginTop: RFValue(25),
                  width: RFValue(140),
                  backgroundColor: colors.card,
                  marginLeft: RFValue(-18),
                }}>
                <MenuOption
                  checked
                  onSelect={() => onSelect('All Activities')}
                  style={
                    selected == 'All Activities'
                      ? colors.background == '#fff'
                        ? { backgroundColor: '#F6F6F6' }
                        : { backgroundColor: '#363638' }
                      : { backgroundColor: 'transparent' }
                  }>
                  <Text
                    style={{
                      color: colors.text,
                      paddingLeft: RFValue(15),
                      paddingVertical: 5,
                      fontWeight: '500',
                      fontFamily: FontFamily.regular,
                    }}>
                    All Activities
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => onSelect('Comments')}
                  style={
                    selected == 'Comments'
                      ? colors.background == '#fff'
                        ? { backgroundColor: '#F6F6F6' }
                        : { backgroundColor: '#363638' }
                      : { backgroundColor: 'transparent' }
                  }>
                  <Text
                    style={{
                      color: colors.text,
                      paddingLeft: RFValue(15),
                      paddingVertical: 5,
                      fontWeight: '500',
                      fontFamily: FontFamily.regular,
                    }}>
                    Comments
                  </Text>
                </MenuOption>
                <MenuOption
                  onSelect={() => onSelect('Likes')}
                  style={
                    selected == 'Likes'
                      ? colors.background == '#fff'
                        ? { backgroundColor: '#F6F6F6' }
                        : { backgroundColor: '#363638' }
                      : { backgroundColor: 'transparent' }
                  }>
                  <Text
                    style={{
                      color: colors.text,
                      paddingLeft: RFValue(15),
                      paddingVertical: 5,
                      fontWeight: '500',
                      fontFamily: FontFamily.regular,
                    }}>
                    Likes
                  </Text>
                </MenuOption>
                {/* <MenuOption style={{ marginVertical: RFValue(5) }} onSelect={() => onSelect('Follows')}><Text style={selected == 'Follows' ? { fontFamily: FontFamily.bold, fontSize: 15, color: colors.heading } : { color: colors.text }} >Follows</Text></MenuOption>
                <MenuOption style={{ marginVertical: RFValue(5) }} onSelect={() => onSelect('Weekly')} ><Text style={selected == 'Weekly' ? { fontFamily: FontFamily.bold, fontSize: 15, color: colors.heading } : { color: colors.text }} >Weekly</Text></MenuOption> */}
              </MenuOptions>
            </Menu>
          </View>
        </View>

        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
          {selected == 'All Activities' && (
            <View style={styles.topBar}>
              <Text
                {...testProps('notificationFollowRequestNumber')}
                style={{ fontSize: 12, color: colors.text, fontFamily: FontFamily.medium }}>
                Followers Requests ({requests.length})
              </Text>
              <Text
                {...testProps('notificationFollowRequestViewAllBtn')}
                style={{
                  fontSize: 10,
                  textDecorationLine: 'underline',
                  color: colors.text,
                  fontFamily: FontFamily.regular,
                }}
                onPress={() => navigation.navigate('FollowersRequestScreen')}>
                View All
              </Text>
            </View>
          )}
          {selected == 'All Activities' &&
            (requests.length > 0 ? (
              <View style={styles.followersRequest}>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={requests}
                  horizontal
                  renderItem={({ item, index, separators }) => (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        if (item.follower.id === currentLoggedInUser.id)
                          navigation.navigate('Profile', {
                            screen: 'ProfileHome',
                          });
                        else
                          navigation.push('HomeScreen', {
                            screen: 'HScreen',
                            params: {
                              screen: 'PublicProfileScreen',
                              params: {
                                publicProfile: item.follower,
                              },
                            },
                          });
                      }}>
                      <View
                        style={{
                          textAlign: 'center',
                          marginTop: 20,
                          alignItems: 'center',
                          marginRight: 10,
                        }}>
                        {item.follower.profile_pic ? (
                          <ProfileThumb
                            testProp={'notificationFollowReqUserThumb'}
                            profilePic={item.follower.profile_pic}
                            style={{ height: 45, width: 45 }}
                          />
                        ) : (
                          <Thumbnail style={{ height: 45, width: 45 }} source={noUserPlaceholder} />
                        )}
                        <Text
                          {...testProps('notificationFollowRequestUserName')}
                          style={{ fontSize: 10, marginTop: 5, color: colors.text }}>
                          {item.follower.username < 8
                            ? `${item.follower.username}`
                            : `@${item.follower.username.substring(0, 8)}...`}
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  )}
                />
              </View>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{
                    color: colors.errorText,
                    alignSelf: 'center',
                    marginTop: RFValue(30),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  No Request Found
                </Text>
              </View>
            ))}
          <View style={[styles.notificationSection, { backgroundColor: colors.background }]}>
            <View
              style={{
                zIndex: 5000,
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.text,
                  zIndex: 1000,
                  fontFamily: FontFamily.medium,
                }}>
                Notifications
              </Text>
              {notifications?.length > 0 && (
                <Text
                  {...testProps('notificationMarkAllRead')}
                  style={{
                    fontSize: 10,
                    textDecorationLine: 'underline',
                    color: colors.text,
                    fontFamily: FontFamily.regular,
                  }}
                  onPress={() => readAllNotificationDispatch()}>
                  Mark All Read
                </Text>
              )}
            </View>

            {isLoading && (
              <View
                style={{
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  zIndex: 999,
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.background,
                  opacity: 1,
                }}>
                <ActivityIndicator color={colors.primary} size="small" />
              </View>
            )}
            {notifications?.length == 0 ? (
              <View
                style={{
                  fontSize: 18,
                  flexGrow: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                <View>
                  <Image
                    source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
                    style={{ alignSelf: 'center' }}
                  />
                  <Text
                    {...testProps('notificationNoNotificationFound')}
                    style={{
                      color: colors.errorText,
                      alignSelf: 'center',
                      marginTop: RFValue(10),
                      fontSize: RFValue(12),
                      fontFamily: FontFamily.regular,
                    }}>
                    No Notifications Found.
                  </Text>
                </View>
              </View>
            ) : (
              <FlatList
                refreshing={false}
                onRefresh={() => getUserNotifications(selected)}
                contentContainerStyle={{ paddingBottom: RFValue(20) }}
                data={notifications}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    </Container>
  );
};

function mapStateToProps(state) {
  return {
    requests: state.followFollowing.followersRequest,
    isLoading: state.RequestLoaders.isRequested,
    notifications: state.user.notifications,
    currentLoggedInUser: state.user.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowerRequest: () => dispatch(FollowerRequests()),
    readAllNotificationDispatch: () => dispatch(readAllNotifications()),
    getUserNotifications: (type) => dispatch(fetchUserNotifications(type)),
    updateNotificationStatus: (notificationId) =>
      dispatch(updateNotificationStatus(notificationId)),
    updateNotificationCount: (count) =>
      dispatch({
        type: 'Notification_Count',
        payload: count,
      }),
    requestLoader: (payload) =>
      dispatch({
        type: 'LOADING',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(notification);
