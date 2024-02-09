import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container, Text, Thumbnail, View, Icon, Spinner } from 'native-base';
import { styles } from './styled';
import { FlatList, Image, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AcceptRejectFollowerRequest,
  FollowUser,
  FollowerRequests,
  UnfollowUser,
  SendFollowerRequests,
} from '../../../../../store/actions/follow-following';
import { getAllUsers } from '../../../../../store/actions/user';
import { Topheader, Statusbar, ProfileThumb, UnfollowConfirm } from '../../../../components';
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
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';

const ViewAllUserScreen = (props) => {
  const {
    users,
    isLoading,
    getFollowerRequest,
    navigation,
    acceptRejectFollowerRequest,
    updateUsersList,
    followUser,
    getAllUsers,
    UnfollowUser,
    updateRecentSearches,
    recentUsers,
    SendFollowerRequest,
    currentLoggedInUser,
    totalPages,
  } = props;
  const [rerender, render] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useTheme();
  const [userToUnfollow, setUser] = useState({});
  const [isVisible, showModal] = useState(false);
  const [page, setPage] = useState(2);
  const [loadMore, setLoadMore] = useState(true);

  const onSubmit = (email, status) => {
    acceptRejectFollowerRequest(email, status);
  };

  useEffect(() => {
    getAllUsers(null, 1);
  }, []);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      getAllUsers(null, 1);
    });
    return () => {
      unsubscribe1();
    };
  }, []);

  console.log('pagination --- = userss', users);
  const _loadMore = () => {
    console.log('pagination --- = ', page, totalPages.totalPages);
    if (page < totalPages.totalPages) {
      getAllUsers(null, page);
      setPage(page + 1);
    }
    setLoadMore(false);
  };

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
      followers: tempData[index].followers + 1,
    };
    updateUsersList(tempData);
    followUser(tempData[index]);
    // updateRecentSearch(tempData[index]);
    render(!rerender);
  };

  const onUnfollowUser = (email, index) => {
    let tempData = users;
    tempData[userToUnfollow.index] = {
      ...tempData[userToUnfollow.index],
      // follow_back: !tempData[userToUnfollow.index].follow_back,
      follow_back: false,
      request_sent: false,
      followers: tempData[userToUnfollow.index].follow_back
        ? tempData[userToUnfollow.index].followers - 1
        : tempData[userToUnfollow.index].followers,
    };
    updateUsersList(tempData);
    UnfollowUser(tempData[userToUnfollow.index]);
    // updateRecentSearch(tempData[userToUnfollow.index]);
    render(!rerender);
  };
  const navigateToProfile = (user) => {
    if (user.id === currentLoggedInUser.id)
      navigation.navigate('Profile', {
        screen: 'ProfileHome',
      });
    else
      navigation.push('HomeScreen', {
        screen: 'HScreen',
        params: {
          screen: 'PublicProfileScreen',
          params: {
            publicProfile: user,
          },
        },
      });
    updateRecentSearch(user);
  };
  const updateRecentSearch = (user) => {
    let tempData = [];
    tempData = recentUsers && recentUsers.length ? recentUsers : [];
    for (var i = 0; i < tempData.length; i++) {
      if (tempData[i].id === user.id) {
        // modify whatever property you need
        tempData[i] = { ...user };
        return;
      }
    }
    tempData.push(user);
    updateRecentSearches(tempData);
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
  };

  const keyExtractor = (item) => `${item.id}    `;

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }} edges={['top']}>
      <UnfollowConfirm
        isVisible={isVisible}
        user={userToUnfollow.obj}
        isLoading={false}
        hideConfirmation={() => cancelUnfollow()}
        onUnfollow={() => proceedUnfollow()}
      />
      <View style={{ overflow: 'hidden' }}>
        <Topheader
          currentIndex={colors.background == '#fff' ? currentIndex : 1}
          onPressLeft={() => navigation.goBack()}
          origin={'All Users'}
          showChatIcon={false}
        />
      </View>

      {users.length <= 0 && !isLoading ? (
        <View
          style={{
            fontSize: 18,
            flex: 1,
            justifyContent: 'center',
            backgroundColor: colors.background,
          }}>
          <Image
            {...testProps('searchAllUserNoUserImg')}
            source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
            style={{ alignSelf: 'center' }}
          />
          <Text
            {...testProps('searchAllUserNoUserText')}
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
          {isLoading && (
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
          )}
          <FlatList
            showsVerticalScrollIndicator={false}
            data={users}
            keyExtractor={keyExtractor}
            //extraData={rerender}
            onViewableItemsChanged={_onViewableItemsChanged}
            onEndReached={_loadMore}
            onEndReachedThreshold={0.9}
            // refreshing={isLoading}
            windowSize={25}
            viewabilityConfig={_viewabilityConfig}
            onEndReachedThreshold={0.9}
            contentContainerStyle={{
              marginTop: 16,
              paddingHorizontal: wp('5%'),
              paddingBottom: hp('3%'),
            }}
            ListFooterComponent={
              <View style={{ backgroundColor: 'transparent', padding: 15 }}>
                <ActivityIndicator style={{ marginBottom: 10 }} size="small" color="#D3D3D3" />
              </View>
            }
            renderItem={({ item, index, separators }) => (
              <View style={styles.notificationItem}>
                <Touch onPress={() => navigateToProfile(item)} style={{ flexDirection: 'row' }}>
                  {item.profile_pic ? (
                    <ProfileThumb
                      testProp={'searchAllUsersThumb'}
                      profilePic={item.profile_pic}
                      style={{ height: 45, width: 45, borderRadius: 45 }}
                    />
                  ) : (
                    <Thumbnail style={{ width: 45, height: 45 }} source={noUserPlaceholder} />
                  )}
                  <View style={{ maxWidth: 300, marginTop: 7, marginLeft: 15, flexGrow: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        {...testProps('searchAllUsersUserName')}
                        style={{ fontSize: 12, fontFamily: FontFamily.medium, color: colors.text }}>
                        {item.name && item.name !== ' ' ? item.name : item.username}
                      </Text>
                      {item.is_account_verified && (
                        <Image
                          {...testProps('userPorfileVerifiedIcon')}
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
                      {...testProps('searchAllUsersUserUsername')}
                      style={{ fontSize: 12, fontFamily: FontFamily.regular, color: colors.text }}>
                      @{item.id} {item.username}
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
                            {...testProps('searchAllUsersUserFollowBtn')}
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
                            {...testProps('searchAllUsersUserUnfollowBtn')}
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
    currentLoggedInUser: state.user.user,
    requests: state.followFollowing.followersRequest,
    users: state.user.users,
    totalPages: state.user.searchUsersExtra,
    isLoading: state.RequestLoaders.isRequested,
    requestStatus: state.followFollowing.followersRequestLoader,
    recentUsers: state.SearchReducer.recentSearches,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowerRequest: () => dispatch(FollowerRequests()),
    acceptRejectFollowerRequest: (email, status) =>
      dispatch(AcceptRejectFollowerRequest(email, status)),
    getAllUsers: (qParam, pageNo) => dispatch(getAllUsers(qParam, pageNo)),
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
    updateRecentSearches: (payload) =>
      dispatch({
        type: 'Update_Recent_Searches',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllUserScreen);
