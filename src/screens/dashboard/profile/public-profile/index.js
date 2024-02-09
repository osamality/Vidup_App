import React, { useEffect, useState } from 'react';
import { Text, Icon, Thumbnail, View, Button } from 'native-base';
import { styles } from './styled';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, Image } from 'react-native';
import {
  GetFollowings,
  GetFollowers,
  FollowUser,
  SendFollowerRequests,
  OtherUserFollowers,
  UnfollowUser,
} from '../../../../../store/actions/follow-following';
import { getUserPosts } from '../../../../../store/actions/posts';
import ProfileHome from '../public-home';
import WeeklyScreen from '../weekly';
import { SafeAreaView } from 'react-native-safe-area-context';
import { noUserPlaceholder, badgeChecdVerified } from 'assets';
import { connect } from 'react-redux';
import MyCustomTabs from '../custom-tabs';
import { useTheme } from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();
import { ProfileThumb, UnfollowConfirm } from 'components';
import testProps from 'locatorId';

import PublicAbout from '../public-about';
import { RFValue } from 'react-native-responsive-fontsize';

const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';

const PublicProfileScreen = (props) => {
  const {
    navigation,
    loader,
    getFollowings,
    route,
    getFollowers,
    followUser,
    updateRecentSearches,
    recentUsers,
    UnfollowUser,
    totalFollowings,
    OtherUserFollowers,
    totalFollowers,
    SendFollowerRequest,
    getUserPostsDispatch,
    visitingUser,
    currentLoggedInUser,
  } = props;

  const [user, updateUser] = useState(route.params.publicProfile);
  const { colors } = useTheme();
  const [userToUnfollow, setUser] = useState({});
  const [isVisible, showModal] = useState(false);
  const [unfollowed, setUnfollowed] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // if (route.params?.publicProfile) {
      //     updateUser(route.params.publicProfile)
      // }
      // visitingUser(route.params.publicProfile)
      // getUserPostsDispatch(route.params.publicProfile.id)
      // getFollowings();
      // getFollowers();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //     if (loader.successed && !loader.requested && loader.id == user.email) {
  //         let temp = user;
  //         temp = { ...temp, follow_back : false }
  //         updateUser(temp)
  //         setUnfollowed(true)
  //     }
  // }, [loader])

  const onFollowPress = (email) => {
    if (!user.is_private) {
      onFollow(email);
    } else {
      onFollowRequest(email);
    }
  };

  const onFollowRequest = (email) => {
    let temp = user;
    temp = { ...temp, request_sent: !temp.follow_back };
    updateUser(temp);
    SendFollowerRequest(temp);
    let arr = recentUsers;
    arr.find((o, i) => {
      if (o.id === temp.id) {
        arr[i] = temp;
        updateRecentSearches(arr);
        return true;
      }
    });
  };
  const onFollow = (email) => {
    let temp = user;
    temp = { ...temp, follow_back: !temp.follow_back, followers: temp.followers + 1 };
    updateUser(temp);
    followUser(temp);
    let arr = recentUsers;
    arr.find((o, i) => {
      if (o.id === temp.id) {
        arr[i] = temp;
        updateRecentSearches(arr);
        return true;
      }
    });
  };

  const onUnfollow = (user) => {
    showModal(true);
    setUser(user);
  };

  const cancelUnfollow = () => {
    showModal(false);
    setUser({});
  };

  const proceedUnfollow = () => {
    let temp = user;
    // temp = { ...temp, follow_back: !temp.follow_back };
    temp = {
      ...temp,
      follow_back: false,
      request_sent: false,
      followers: temp.follow_back ? temp.followers - 1 : temp.followers,
    };
    updateUser(temp);
    let arr = recentUsers;
    arr.find((o, i) => {
      if (o.id === temp.id) {
        arr[i] = temp;
        updateRecentSearches(arr);
        return true;
      }
    });
    console.log('.....', temp);
    UnfollowUser(userToUnfollow);
    showModal(false);
    setUser({});
  };

  return (
    // <View style={styles.container}>
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
      <UnfollowConfirm
        {...testProps('publicProfileUnfollowConfirmBtn')}
        user={userToUnfollow}
        isVisible={isVisible}
        isLoading={loader.id == userToUnfollow.email ? true : false}
        hideConfirmation={() => cancelUnfollow()}
        onUnfollow={() => proceedUnfollow()}
      />
      <View style={styles.topBar}>
        <TouchableOpacity
          {...testProps('publicProfileUnfollowCancelBtn')}
          onPress={() => navigation.goBack()}>
          <Icon
            type="Entypo"
            name="chevron-thin-left"
            style={{ fontSize: RFValue(17), color: colors.text }}
          />
          {/* <Image source={colors.background == '#fff' ? lightBackArrowIcon : darkBackArrowIcon} style={{ width: 20, height: 20, marginTop: 10 }} resizeMode={'contain'} /> */}
        </TouchableOpacity>

        <View></View>
      </View>
      <View style={styles.thumbnailSection}>
        {user.profile_pic ? (
          <ProfileThumb
            testProp={'publicProfileThumbImage'}
            profilePic={user.profile_pic}
            style={{ height: 82, width: 82, borderRadius: 82 }}
          />
        ) : (
          <Thumbnail
            style={{ height: 82, width: 82, borderRadius: 82 }}
            source={noUserPlaceholder}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            {...testProps('publicProfileUserName')}
            style={{ fontSize: 16, fontWeight: '500', marginTop: 10, color: colors.text }}>
            {user.name}
          </Text>
          {user.is_account_verified && (
            <Image
              {...testProps('profileHeaderDrawerBtn')}
              source={badgeChecdVerified}
              style={{ ...styles.verifyIcon }}
              resizeMode={'contain'}
            />
          )}
        </View>
        <Text
          {...testProps('publicProfileUserUsername')}
          style={{ fontSize: 12, fontWeight: 'normal', marginTop: 5, color: colors.text }}>
          @{user.username}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
          }}>
          <Text
            {...testProps('publicProfileFollowingBtn')}
            style={{ fontSize: 12, fontWeight: 'normal', color: colors.text }}
            onPress={() =>
              user.is_private && !user.follow_back
                ? {}
                : navigation.push('FollowingFollowersScreen', {
                    user: route.params?.publicProfile,
                    nStack: 'HScreen',
                    type: '1',
                  })
            }>
            {user.followings} Followings
          </Text>
          <Text
            {...testProps('publicProfileFollowersBtn')}
            style={{ fontSize: 12, fontWeight: 'normal', marginLeft: 20, color: colors.text }}
            onPress={() =>
              user.is_private && !user.follow_back
                ? {}
                : navigation.push('FollowingFollowersScreen', {
                    user: route.params?.publicProfile,
                    nStack: 'HScreen',
                    type: '0',
                  })
            }>
            {user.followers} Followers
          </Text>
        </View>
        <View style={styles.buttonWrapper}>
          {currentLoggedInUser.id !== user.id ? (
            <View>
              {user.request_sent ? (
                <View>
                  <Button
                    onPress={() => onUnfollow(route.params.publicProfile)}
                    style={[styles.outlineButton, { paddingHorizontal: 3 }]}
                    transparent>
                    <Text
                      {...testProps('publicProfileUnfollowBtn')}
                      style={{ color: '#FB6200', fontSize: 10, textTransform: 'capitalize' }}>
                      Request Sent
                    </Text>
                  </Button>
                </View>
              ) : !user.follow_back ? (
                <LinearGradient
                  colors={['#FB6200', '#EF0059']}
                  start={{ x: 1, y: 1 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.gradientButton}>
                  <Button
                    style={[styles.outlineButton, { borderWidth: 0 }]}
                    transparent
                    onPress={() => {
                      !user.follow_back ? onFollowPress(user.email) : null;
                    }}>
                    <Text
                      {...testProps('publicProfileFollowBtn')}
                      style={{ color: '#fff', fontSize: 10, textTransform: 'capitalize' }}>
                      Follow
                    </Text>
                  </Button>
                </LinearGradient>
              ) : (
                <View>
                  <Button
                    onPress={() => onUnfollow(route.params.publicProfile)}
                    style={[styles.outlineButton, { paddingHorizontal: 3 }]}
                    transparent>
                    <Text
                      {...testProps('publicProfileUnfollowBtn')}
                      style={{ color: '#FB6200', fontSize: 10, textTransform: 'capitalize' }}>
                      Following
                    </Text>
                  </Button>
                </View>
              )}
            </View>
          ) : (
            <View></View>
          )}
        </View>
      </View>

      {user.is_private && !user.follow_back ? (
        <Tab.Navigator tabBar={(props) => <MyCustomTabs {...props} />}>
          <Tab.Screen name="Videos" component={ProfileHome} initialParams={{ userVisited: user }} />
          <Tab.Screen name="About" component={PublicAbout} initialParams={{ userVisited: user }} />
        </Tab.Navigator>
      ) : (
        <Tab.Navigator tabBar={(props) => <MyCustomTabs {...props} />}>
          <Tab.Screen name="Videos" component={ProfileHome} initialParams={{ userVisited: user }} />
          {/* <Tab.Screen name="Weekly" component={WeeklyScreen} /> */}
          <Tab.Screen name="About" component={PublicAbout} initialParams={{ userVisited: user }} />
        </Tab.Navigator>
      )}
    </SafeAreaView>
    // </View>
  );
};

function mapStateToProps(state) {
  return {
    totalFollowings: state.followFollowing.followings,
    totalFollowers: state.followFollowing.followers,
    recentUsers: state.SearchReducer.recentSearches,
    currentLoggedInUser: state.user.user,
    loader: state.followFollowing.followUserRequestLoader,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowings: () => dispatch(GetFollowings()),
    getFollowers: () => dispatch(GetFollowers()),
    followUser: (user) => dispatch(FollowUser(user)),
    OtherUserFollowers: (email) => dispatch(OtherUserFollowers(email)),
    getUserPostsDispatch: (userId) => dispatch(getUserPosts(userId)),
    UnfollowUser: (email) => dispatch(UnfollowUser(email)),
    SendFollowerRequest: (email) => dispatch(SendFollowerRequests(email)),
    updateRecentSearches: (payload) =>
      dispatch({
        type: 'Update_Recent_Searches',
        payload: payload,
      }),
    visitingUser: (payload) =>
      dispatch({
        type: 'Visiting_User',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfileScreen);
