import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Text, Thumbnail, View, Icon, Spinner } from 'native-base';
import { styles } from './styled';
import {
  FlatList,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AcceptRejectFollowerRequest,
  FollowUser,
  FollowerRequests,
  UnfollowUser,
  SendFollowerRequests,
} from '../../../../../store/actions/follow-following';
import { getAllTopUsers } from '../../../../../store/actions/user';
import { Topheader, ProfileThumb, UnfollowConfirm } from '../../../../components';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightMessageIcon, darkMessageIcon, badgeChecdVerified } from 'assets';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { noUserFound, noUserPlaceholder, darkNoUserFound } from 'assets';
const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';
import { useTheme } from '@react-navigation/native';
import axios from '../../../../../store/utils/axiosCongif';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';

const ViewAllTopUserScreen = (props) => {
  const {
    users,
    isLoading,
    requestStatus,
    navigation,
    acceptRejectFollowerRequest,
    unfollowStatus,
    updateUsersList,
    followUser,
    getTopUsers,
    UnfollowUser,
    SendFollowerRequest,
    currentLoggedInUser,
  } = props;
  const [rerender, render] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useTheme();
  const [userToUnfollow, setUser] = useState({});
  const [isVisible, showModal] = useState(false);

  const onSubmit = (email, status) => {
    acceptRejectFollowerRequest(email, status);
  };
  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      getTopUsers();
    });
    return () => {
      unsubscribe1();
    };
  }, []);

  // useEffect(() => {
  //   getTopUsers();
  // }, [requestStatus, unfollowStatus]);

  useEffect(() => {
    getTopUsers();
  }, []);

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: 100,
  };

  const onFollowPress = (email, index) => {
    let tempData = users;
    if (!tempData[index].is_private) {
      onFollow(email, index);
    } else {
      onFollowRequest(email, index);
    }
  };

  const onFollowRequest = (email, index) => {
    let tempData = users;
    tempData[index] = {
      ...tempData[index],
      request_sent: !tempData[index].request_sent,
    };
    updateUsersList(tempData);
    SendFollowerRequest(tempData[index]);
    render(!rerender);
  };

  const onFollow = (email, index) => {
    let tempData = users;
    tempData[index] = {
      ...tempData[index],
      follow_back: !tempData[index].follow_back,
      // followers: tempData[index].followers + 1,
    };
    updateUsersList(tempData);
    followUser(tempData[index]);
    render(!rerender);
  };

  const onUnfollowUser = (email, index) => {
    let tempData = users;
    tempData[userToUnfollow.index] = {
      ...tempData[userToUnfollow.index],
      // follow_back: !tempData[userToUnfollow.index].follow_back,
      follow_back: false,
      request_sent: false,
      // followers: tempData[userToUnfollow.index].follow_back
      //   ? tempData[userToUnfollow.index].followers - 1
      //   : tempData[userToUnfollow.index].followers,
    };
    updateUsersList(tempData);
    UnfollowUser(tempData[userToUnfollow.index]);
    render(!rerender);
  };

  const onUnfollow = (item, index) => {
    let user = {};
    user.obj = item;
    user.index = index;
    showModal(true);
    setUser(user);
  };

  const cancelUnfollow = () => {
    showModal(false);
    setUser({});
  };

  const proceedUnfollow = () => {
    onUnfollowUser();
    showModal(false);
    setUser({});
    render(!rerender);
  };

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }} edges={['top']}>
      <View style={{ overflow: 'hidden' }}>
        <Topheader
          currentIndex={colors.background == '#fff' ? currentIndex : users.length > 0 ? 1 : 0}
          onPressLeft={() => navigation.goBack()}
          origin={'Top Users'}
          showChatIcon={false}
        />
      </View>
      <UnfollowConfirm
        isVisible={isVisible}
        user={userToUnfollow.obj}
        isLoading={false}
        hideConfirmation={() => cancelUnfollow()}
        onUnfollow={() => proceedUnfollow()}
      />

      {users.length <= 0 && !isLoading ? (
        <View
          style={{
            fontSize: 18,
            flex: 1,
            justifyContent: 'center',
            backgroundColor: colors.background,
          }}>
          <Image
            {...testProps('searchAllTopUserNoUserImg')}
            source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
            style={{ alignSelf: 'center' }}
          />
          <Text
            {...testProps('searchAllTopUserNoUserImg')}
            style={{
              color: colors.errorText,
              alignSelf: 'center',
              marginTop: RFValue(10),
              fontSize: RFValue(12),
              fontFamily: FontFamily.regular,
            }}>
            No User Found.
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* {isLoading && (
            <View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                zIndex: 999,
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                backgroundColor: colors.background,
                opacity: 0.8,
              }}>
              <ActivityIndicator color={colors.primary} size="small" />
            </View>
          )} */}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={users}
            keyExtractor={(item) => item.id + ' '}
            extraData={rerender}
            onViewableItemsChanged={_onViewableItemsChanged}
            viewabilityConfig={_viewabilityConfig}
            contentContainerStyle={{
              marginTop: 16,
              paddingHorizontal: wp('5%'),
              paddingBottom: hp('3%'),
            }}
            renderItem={({ item, index, separators }) => (
              <View style={styles.notificationItem}>
                <Touch
                  onPress={() => {
                    if (item.id === currentLoggedInUser.id)
                      navigation.navigate('Profile', {
                        screen: 'ProfileHome',
                      });
                    else
                      navigation.push('HomeScreen', {
                        screen: 'HScreen',
                        params: {
                          screen: 'PublicProfileScreen',
                          params: {
                            publicProfile: item,
                          },
                        },
                      });
                  }}
                  style={{ flexDirection: 'row' }}>
                  {item.profile_pic ? (
                    <ProfileThumb
                      testProp={'searchAllTopUsersThumb'}
                      profilePic={item.profile_pic}
                      style={{ height: 45, width: 45, borderRadius: 45 }}
                    />
                  ) : (
                    <Thumbnail style={{ height: 45, width: 45 }} source={noUserPlaceholder} />
                  )}
                  <View style={{ maxWidth: 300, marginLeft: 15, flexGrow: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        {...testProps('searchAllTopUsersUserName')}
                        style={{ fontSize: 14, color: colors.text }}>
                        {item.name && item.name !== ' ' ? item.name : item.username}
                      </Text>
                      {item.is_account_verified && (
                        <Image
                          {...testProps('profileHeaderDrawerBtn')}
                          source={badgeChecdVerified}
                          style={{
                            width: RFValue(12),
                            height: RFValue(12),
                            marginLeft: 3,
                            marginTop: 0,
                          }}
                          resizeMode={'contain'}
                        />
                      )}
                    </View>
                    <Text
                      {...testProps('searchAllTopUsersUserUsername')}
                      style={{ fontSize: 10, color: colors.text }}>
                      @{item.username}
                    </Text>
                  </View>
                </Touch>

                <View style={styles.buttonWrapper}>
                  <View>
                    {item.request_sent ? (
                      <View>
                        <Button
                          onPress={() => onUnfollow(item, index)}
                          style={[styles.outlineButton, { paddingHorizontal: 3 }]}
                          transparent>
                          <Text
                            {...testProps('publicProfileUnfollowBtn')}
                            style={{ color: '#FB6200', fontSize: 10, textTransform: 'capitalize' }}>
                            Request Sent
                          </Text>
                        </Button>
                      </View>
                    ) : !item.follow_back ? (
                      <LinearGradient
                        colors={['#FB6200', '#EF0059']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.gradientButton}>
                        <Button
                          style={[styles.outlineButton, { borderWidth: 0 }]}
                          transparent
                          onPress={() => {
                            !item.follow_back ? onFollowPress(item.email, index) : null;
                          }}>
                          <Text
                            {...testProps('searchAllTopUsersUserFollowBtn')}
                            style={{ color: '#fff', fontSize: 10, textTransform: 'capitalize' }}>
                            Follow
                          </Text>
                        </Button>
                      </LinearGradient>
                    ) : (
                      <View>
                        <Button
                          style={[styles.outlineButton, { paddingHorizontal: 3 }]}
                          transparent
                          onPress={() => onUnfollow(item, index)}>
                          <Text
                            {...testProps('searchAllTopUsersUserUnfollowBtn')}
                            style={{ color: '#FB6200', fontSize: 10, textTransform: 'capitalize' }}>
                            UnFollow
                          </Text>
                        </Button>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    requests: state.followFollowing.followersRequest,
    users: state.user.topUsers,
    currentLoggedInUser: state.user.user,
    isLoading: state.RequestLoaders.isRequested,
    requestStatus: state.followFollowing.followersRequestLoader,
    unfollowStatus: state.followFollowing.followUserRequestLoader,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowerRequest: () => dispatch(FollowerRequests()),
    acceptRejectFollowerRequest: (email, status) =>
      dispatch(AcceptRejectFollowerRequest(email, status)),
    getTopUsers: () => dispatch(getAllTopUsers()),
    followUser: (email) => dispatch(FollowUser(email)),
    UnfollowUser: (email) => dispatch(UnfollowUser(email)),
    SendFollowerRequest: (email) => dispatch(SendFollowerRequests(email)),
    requestEnd: () =>
      dispatch({
        type: 'FollowersRequestsLoader',
        payload: { requested: false, successed: false, error: false },
      }),
    updateUsersList: (payload) =>
      dispatch({
        type: 'Users',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllTopUserScreen);
