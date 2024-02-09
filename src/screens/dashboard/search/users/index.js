import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Thumbnail, Button } from 'native-base';
import { FlatList, RefreshControl, ActivityIndicator, Image, Keyboard } from 'react-native';
import { styles } from './styled';
import { UnfollowConfirm } from 'components';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { getAllUsers } from '../../../../../store/actions/user';
import {
  FollowUser,
  UnfollowUser,
  SendFollowerRequests,
} from '../../../../../store/actions/follow-following';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { FontFamily } from 'constants';
import { useTheme } from '@react-navigation/native';
import { noUserFound, noUserPlaceholder, darkNoUserFound, badgeChecdVerified } from 'assets';
import { ProfileThumb } from 'components';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';

const UserScreen = (props) => {
  const {
    users,
    getAllUsers,
    isLoading,
    keyWord,
    followUserLoader,
    updateRecentSearches,
    recentUsers,
    navigation,
    followUser,
    updateUsersList,
    UnfollowUser,
    currentLoggedInUser,
    SendFollowerRequest,
    route,
    usersExtra,
  } = props;
  const [rerender, render] = useState(false);
  const { colors } = useTheme();
  const [userToUnfollow, setUser] = useState({});
  const [isVisible, showModal] = useState(false);
  const [page, setPage] = useState(1);

  const onRefresh = useCallback(async () => {
    if (keyWord) {
      getAllUsers(keyWord, 1);
    } else {
      getAllUsers(null, 1);
    }
  }, [isLoading]);

  const _loadMore = () => {
    if (page < totalPages.totalPages) {
      getAllUsers(page + 1);
      setPage(page + 1);
    }
  };

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      if (keyWord) {
        getAllUsers(keyWord, 1);
      } else {
        getAllUsers(null, 1);
      }
    });

    return () => {
      unsubscribe1();
    };
  }, []);

  useEffect(() => {
    if (keyWord) {
      getAllUsers(keyWord, 1);
    } else {
      getAllUsers(null, 1);
    }
  }, [keyWord]);

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
    render(!rerender);
  };

  const onUnfollowUser = () => {
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
    // navigation.push("PublicProfileScreen", { publicProfile: user })
    let tempData = [];
    tempData = recentUsers && recentUsers.length ? recentUsers : [];
    for (var i = 0; i < tempData.length; i++) {
      if (tempData[i].id === user.id) {
        // modify whatever property you need
        tempData[i] = { ...user };
        return;
      }
    }
    tempData.unshift(user);
    updateRecentSearches(tempData);
    render(!rerender);
  };

  const clearRecentSearch = () => {
    let clear = [];
    updateRecentSearches(clear);
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

  const _renderItem = ({ item, index }) => (
    <View style={styles.notificationItem}>
      <Touch
        onPress={() => {
          navigateToProfile(item);
        }}
        style={{ flexDirection: 'row' }}>
        <>
          {item.profile_pic ? (
            <ProfileThumb
              testProp={'searchUserScreenUsersThumb'}
              profilePic={item.profile_pic}
              style={{ height: 45, width: 45, borderRadius: 45 }}
            />
          ) : (
            <Thumbnail style={{ width: 45, height: 45 }} source={noUserPlaceholder} />
          )}
          <View
            style={{
              maxWidth: wp(43),
              marginTop: 7,
              marginLeft: 15,
              flexGrow: 1,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                {...testProps('searchUserScreenUserName')}
                style={{
                  fontSize: 12,
                  fontFamily: FontFamily.medium,
                  color: colors.text,
                }}
                numberOfLines={1}>
                {item.name && item.name !== ' ' ? item.name : item.username}
              </Text>
              {item.is_account_verified && (
                <Image
                  {...testProps('profileHeaderDrawerBtn')}
                  source={badgeChecdVerified}
                  style={{ ...styles.verifyIcon }}
                  resizeMode={'contain'}
                />
              )}
            </View>
            <Text
              {...testProps('searchUserScreenUserUsername')}
              style={{
                fontSize: 10,
                fontFamily: FontFamily.regular,
                color: colors.text,
              }}
              numberOfLines={1}>
              @{item.username}
            </Text>
          </View>
        </>
      </Touch>
      <View style={styles.buttonWrapper}>
        {followUserLoader.id == item.email ? (
          <ActivityIndicator style={{ marginRight: 25 }} size={'small'} color="black" />
        ) : (
          <View>
            {item.request_sent ? (
              <View>
                <Button
                  onPress={() => onUnfollow(item, index)}
                  style={[styles.outlineButton, { paddingHorizontal: 3 }]}
                  transparent>
                  <Text
                    {...testProps('publicProfileUnfollowBtn')}
                    style={{
                      color: '#FB6200',
                      fontSize: 10,
                      textTransform: 'capitalize',
                    }}>
                    Request Sent
                  </Text>
                </Button>
              </View>
            ) : currentLoggedInUser.id !== item.id ? (
              !item.follow_back ? (
                <LinearGradient
                  colors={['#FB6200', '#EF0059']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.gradientButton}>
                  <Button
                    {...testProps('searchUserScreenUserFollowBtn')}
                    style={[styles.outlineButton, { borderWidth: 0 }]}
                    transparent
                    onPress={() => {
                      !item.follow_back ? onFollowPress(item.email, index) : null;
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 10,
                        textTransform: 'capitalize',
                      }}>
                      Follow
                    </Text>
                  </Button>
                </LinearGradient>
              ) : (
                <View>
                  <Button
                    {...testProps('searchUserScreenUserUnfollowBtn')}
                    style={[styles.outlineButton, { paddingHorizontal: 3 }]}
                    transparent
                    onPress={() => onUnfollow(item, index)}>
                    <Text
                      style={{
                        color: '#FB6200',
                        fontSize: 10,
                        textTransform: 'capitalize',
                      }}>
                      UnFollow
                    </Text>
                  </Button>
                </View>
              )
            ) : null}
          </View>
        )}
      </View>
    </View>
  );

  const _renderRecentUsers = ({ item }) => (
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
      style={{ alignItems: 'center', marginRight: 10 }}>
      {item.profile_pic ? (
        <ProfileThumb
          testProp={'searchUserScreenRecentUserThumb'}
          profilePic={item.profile_pic}
          style={{ height: 45, width: 45, borderRadius: 45, marginRight: 10 }}
        />
      ) : (
        <Thumbnail
          style={{ height: 45, width: 45, borderRadius: 45, marginRight: 10 }}
          source={noUserPlaceholder}
        />
      )}
      <Text
        {...testProps('searchUserScreenRecentUserName')}
        numberOfLines={1}
        style={{
          width: RFValue(40),
          fontSize: 10,
          marginTop: 5,
          marginRight: 10,
          color: colors.text,
        }}>
        @{item.username}
      </Text>
    </Touch>
  );

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <UnfollowConfirm
        isVisible={isVisible}
        user={userToUnfollow.obj}
        isLoading={false}
        hideConfirmation={() => cancelUnfollow()}
        onUnfollow={() => proceedUnfollow()}
      />
      {!keyWord ? (
        <View>
          <View style={styles.topBar}>
            <Text style={{ fontSize: 12, fontFamily: FontFamily.medium, color: colors.text }}>
              Recent Searches
            </Text>
            <Text
              style={{ fontSize: 10, textDecorationLine: 'underline', color: colors.text }}
              onPress={() => clearRecentSearch()}>
              Clear Recent
            </Text>
          </View>
          <View style={{ justifyContent: 'center' }}>
            {recentUsers && recentUsers.length > 0 ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                data={recentUsers}
                horizontal
                keyExtractor={(item) => item.id + ' '}
                renderItem={_renderRecentUsers}
              />
            ) : (
              <Text
                style={{
                  color: colors.errorText,
                  alignSelf: 'center',
                  marginTop: RFValue(10),
                  fontSize: RFValue(12),
                  fontFamily: FontFamily.regular,
                }}>
                No Recent Search!
              </Text>
            )}
          </View>
        </View>
      ) : (
        <View></View>
      )}
      <View style={styles.notificationSection}>
        {!keyWord ? (
          <View style={styles.topBar}>
            <Text
              {...testProps('searchUserScreenNoUserImg')}
              style={{ fontSize: 12, fontFamily: FontFamily.medium, color: colors.text }}>
              Recommended
            </Text>
            <Text
              {...testProps('searchUserScreenNoUserText')}
              style={{ fontSize: 10, textDecorationLine: 'underline', color: colors.text }}
              onPress={() => navigation.navigate('ViewAllUserScreen')}>
              View All
            </Text>
          </View>
        ) : (
          <View></View>
        )}

        {users.length <= 0 && !isLoading ? (
          <View style={{ fontSize: 18, flex: 1, justifyContent: 'center' }}>
            {keyWord && users.length == 0 ? (
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{ height: hp(60), justifyContent: 'center' }}>
                  <Image
                    {...testProps('searchUserScreenCouldNotFindUserImg')}
                    source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
                    style={{ alignSelf: 'center' }}
                  />
                  <Text
                    {...testProps('searchUserScreenCouldNotFindUserText')}
                    style={{
                      color: colors.errorText,
                      alignSelf: 'center',
                      marginTop: RFValue(10),
                      fontSize: RFValue(12),
                      fontFamily: FontFamily.regular,
                    }}>
                    Sorry! We couldn’t find anyone with that name.
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ) : (
              <View>
                <Image
                  {...testProps('searchUserScreenNoUserFoundImg')}
                  source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
                  style={{ alignSelf: 'center' }}
                />
                <Text
                  {...testProps('searchUserScreenNoUserFoundText')}
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
            )}
          </View>
        ) : (
          <View style={{ flex: 1, marginTop: 20 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={users}
              extraData={rerender}
              refreshControl={
                <RefreshControl colors={['#FB6200']} refreshing={isLoading} onRefresh={onRefresh} />
              }
              keyExtractor={(item) => item.id + ' '}
              contentContainerStyle={{ paddingBottom: hp('3%') }}
              renderItem={_renderItem}
            />
          </View>
        )}
      </View>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    users: state.user.users,
    usersExtra: state.user.searchUsersExtra,
    followUserLoader: state.followFollowing.followUserRequestLoader,
    isLoading: state.RequestLoaders.isRequested,
    keyWord: state.SearchReducer.searchKeyword,
    recentUsers: state.SearchReducer.recentSearches,
    currentLoggedInUser: state.user.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllUsers: (uname, pageNo) => dispatch(getAllUsers(uname, pageNo)),
    followUser: (email) => dispatch(FollowUser(email)),
    UnfollowUser: (email) => dispatch(UnfollowUser(email)),
    SendFollowerRequest: (email) => dispatch(SendFollowerRequests(email)),
    updateRecentSearches: (payload) =>
      dispatch({
        type: 'Update_Recent_Searches',
        payload: payload,
      }),
    updateUsersList: (payload) =>
      dispatch({
        type: 'Users',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
