import React, { useCallback, useEffect, useState } from 'react';
import { Button, Input, Text, Thumbnail, View, Icon, Item } from 'native-base';
import { styles } from './styled';
import {
  FlatList,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Pressable,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  AcceptRejectFollowerRequest,
  FollowUser,
  FollowerRequests,
  UnfollowUser,
  SendFollowerRequests,
} from '../../../../../store/actions/follow-following';
import { getTopUsers } from '../../../../../store/actions/user';
import { Topheader, ProfileThumb, UnfollowConfirm } from '../../../../components';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { lightMessageIcon, darkMessageIcon, badgeChecdVerified } from 'assets';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { noUserFound, noUserPlaceholder, darkNoUserFound } from 'assets';
const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';
import { useTheme } from '@react-navigation/native';
import axios from '../../../../../store/utils/axiosCongif';
import { updateSearchKeyword } from '../../../../../store/actions/searh';
import { getLikedUsersOfPost } from '../../../../../store/actions/posts';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';

const ViewAllLikedUserScreen = (props) => {
  const {
    users,
    isLoading,
    getFollowerRequest,
    navigation,
    acceptRejectFollowerRequest,
    updateUsersList,
    followUser,
    getTopUsers,
    UnfollowUser,
    updateSearchKeywordDispatch,
    getLikedUsersOfPost,
    updateRecentSearches,
    recentUsers,
    currentLoggedInUser,
    updateLikedUsers,
    loggedInUser,
    SendFollowerRequest,
  } = props;
  const [rerender, render] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearch] = useState('');
  const postId = props.route.params.postId;
  const [userToUnfollow, setUser] = useState({});
  const [isVisible, showModal] = useState(false);

  handleFocus = () => {
    setIsFocused(true);
  };
  handleBlur = () => {
    setIsFocused(false);
  };
  const clearSearchText = () => {
    setSearch('');
    updateSearchKeywordDispatch('');
    updateRecentSearches([]);
  };
  const searchTag = (text) => {
    setSearch(text.toLowerCase());
    let searchText = text.toLowerCase();
    let tempArray = [];
    users.map((elem) => {
      debugger;
      if (
        elem.name.toLowerCase().includes(searchText) ||
        elem.username.toLowerCase().includes(searchText)
      ) {
        tempArray.push(elem);
      }
    });
    updateSearchKeywordDispatch(searchText);
    updateRecentSearches(tempArray);
  };

  const onSubmit = (email, status) => {
    acceptRejectFollowerRequest(email, status);
  };
  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      getLikedUsersOfPost(postId);
      clearSearchText();
    });
    return () => {
      unsubscribe1();
    };
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
    updateLikedUsers(tempData);
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
    updateLikedUsers(tempData);
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
    updateLikedUsers(tempData);
    UnfollowUser(tempData[userToUnfollow.index]);
    // updateRecentSearch(tempData[userToUnfollow.index]);
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

  return (
    <SafeAreaView style={{ backgroundColor: colors.card, flex: 1 }} edges={['top']}>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <UnfollowConfirm
          isVisible={isVisible}
          user={userToUnfollow.obj}
          isLoading={false}
          hideConfirmation={() => cancelUnfollow()}
          onUnfollow={() => proceedUnfollow()}
        />
        <TouchableHighlight onPress={() => navigation.goBack()} underlayColor="none">
          <View {...testProps('postItemLikesBackIcon')} style={{ paddingLeft: 20 }}>
            <Icon
              type="Entypo"
              name="chevron-thin-left"
              style={{ fontSize: RFValue(17), color: colors.text }}
            />
          </View>
        </TouchableHighlight>
        <Item
          rounded
          style={{
            borderRadius: 5,
            borderWidth: 1,
            marginLeft: '5%',
            width: '78%',
            height: 46,
            borderWidth: 2,
            borderColor: isFocused ? Color.Orange : colors.inputBorder,
            backgroundColor: colors.inputInnerColor,
          }}>
          <Icon
            type="EvilIcons"
            name="search"
            onPress={() => updateSearchKeywordDispatch(searchText)}
            style={{ fontSize: RFValue(18), color: colors.text }}
          />

          <Input
            testProp={'postItemLikesSearchInput'}
            placeholder="Search..."
            value={searchText}
            onChangeText={(text) => searchTag(text)}
            style={{ fontSize: RFValue(12), color: colors.text, paddingRight: 20 }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            autoCapitalize="none"
          />
          <>
            {isFocused && searchText.length !== 0 ? (
              <Icon
                type="EvilIcons"
                name="close"
                onPress={clearSearchText}
                style={{ fontSize: RFValue(18), color: colors.text }}
              />
            ) : (
              <View></View>
            )}
          </>
        </Item>
      </View>
      <View>
        <Text
          {...testProps('postItemLikesTitleText')}
          style={{
            fontFamily: FontFamily.medium,
            fontSize: RFValue(14),
            marginLeft: 22,
            color: colors.text,
            marginVertical: RFValue(12),
          }}>
          Likes
        </Text>
      </View>
      {recentUsers.length <= 0 && searchText && !isLoading ? (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View
            style={{
              fontSize: 18,
              flex: 1,
              justifyContent: 'center',
              backgroundColor: colors.background,
            }}>
            <Image
              {...testProps('postItemLikesNoSearchResultImg')}
              source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
              style={{ alignSelf: 'center' }}
            />
            <Text
              {...testProps('postItemLikesNoSearchResultText')}
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
        <View style={{ flex: 1 }}>
          {users.length <= 0 && !searchText && !isLoading ? (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View
                style={{
                  fontSize: 18,
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: colors.background,
                }}>
                <Image
                  {...testProps('postItemLikesNolikesImg')}
                  source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
                  style={{ alignSelf: 'center' }}
                />
                <Text
                  {...testProps('postItemLikesNolikesText')}
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
            </TouchableWithoutFeedback>
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
                data={
                  recentUsers.length > 0 && searchText
                    ? recentUsers
                    : recentUsers.length == 0 && searchText
                    ? recentUsers
                    : users
                }
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
                      <>
                        {item.profile_pic ? (
                          <ProfileThumb
                            testProp={'postItemLikesThumbImage'}
                            profilePic={item.profile_pic}
                            style={{ height: 45, width: 45 }}
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
                              {...testProps('postItemLikesUserName')}
                              style={{ fontSize: 14, color: colors.text }}>
                              {item.name && item.name !== ' ' ? item.name : item.username}
                            </Text>
                            {console.log(item)}
                            {item.is_account_verified && (
                              <Image
                                {...testProps('userPorfileVerifiedIcon')}
                                source={badgeChecdVerified}
                                style={{
                                  width: RFValue(13),
                                  height: RFValue(13),
                                  marginLeft: 5,
                                  marginRight: 5,
                                  marginTop: 0,
                                }}
                                resizeMode={'contain'}
                              />
                            )}
                          </View>
                          <Text
                            {...testProps('postItemLikesUserUsername')}
                            style={{ fontSize: 10, color: colors.text }}>
                            @{item.username}
                          </Text>
                        </View>
                      </>
                    </Touch>

                    <View style={styles.buttonWrapper}>
                      {loggedInUser.id !== item.id && (
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
                                  {...testProps('postItemLikesUserFollowBtn')}
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
                            <Button
                              style={[styles.outlineButton, { paddingHorizontal: 3 }]}
                              transparent
                              onPress={() => onUnfollow(item, index)}>
                              <Text
                                {...testProps('postItemLikesUserUnfollowBtn')}
                                style={{
                                  color: '#FB6200',
                                  fontSize: 10,
                                  textTransform: 'capitalize',
                                  justifyContent: 'center',
                                }}>
                                UnFollow
                              </Text>
                            </Button>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    requests: state.followFollowing.followersRequest,
    users: state.postsReducer.postLikedUsers,
    isLoading: state.RequestLoaders.isRequested,
    requestStatus: state.followFollowing.followersRequestLoader,
    recentUsers: state.SearchReducer.recentSearches,
    loggedInUser: state.user.user,
    currentLoggedInUser: state.user.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowerRequest: () => dispatch(FollowerRequests()),
    acceptRejectFollowerRequest: (email, status) =>
      dispatch(AcceptRejectFollowerRequest(email, status)),
    getTopUsers: () => dispatch(getTopUsers()),
    followUser: (email) => dispatch(FollowUser(email)),
    UnfollowUser: (email) => dispatch(UnfollowUser(email)),
    SendFollowerRequest: (email) => dispatch(SendFollowerRequests(email)),
    requestEnd: () =>
      dispatch({
        type: 'FollowersRequestsLoader',
        payload: { requested: false, successed: false, error: false },
      }),
    updateLikedUsers: (payload) =>
      dispatch({
        type: 'GET_LIKED_POST_USERS',
        payload: payload,
      }),
    updateSearchKeywordDispatch: (payload) => dispatch(updateSearchKeyword(payload)),
    updateRecentSearches: (payload) =>
      dispatch({
        type: 'Update_Recent_Searches',
        payload: payload,
      }),
    getLikedUsersOfPost: (postId) => dispatch(getLikedUsersOfPost(postId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllLikedUserScreen);
