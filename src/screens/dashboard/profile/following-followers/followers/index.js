import React, { useState, useEffect } from 'react';
import { Text, Item, Icon, Input, View, Thumbnail, Button } from 'native-base';
import { styles } from './styled';
import LinearGradient from 'react-native-linear-gradient';
import {
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import useDebounce from '../../../../../helper/common-functions/debounce';
import {
  GetFollowers,
  FollowUser,
  RemoveFollower,
  OtherUserFollowers,
} from '../../../../../../store/actions/follow-following';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { TouchableWithoutFeedback as TouchableWithoutFeedback2 } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { noUserFound, noUserPlaceholder, darkNoUserFound, badgeChecdVerified } from 'assets';
import { Color, FontFamily } from 'constants';
import { useTheme } from '@react-navigation/native';
import { UnfollowConfirm, ProfileThumb } from 'components';
import testProps from 'locatorId';
import { Touch } from '../../../../../components/touch';

const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';

const Followers = (props) => {
  const {
    userfollowers,
    currentLoggedInUser,
    loader,
    RemoveFollower,
    navigation,
    getFollowers,
    route,
  } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isFocused, setIsFocused] = useState(false);
  const [followers, setFollowers] = useState(route.params?.user == 'personal' ? userfollowers : []);
  const [userToRemove, setUser] = useState({});
  const [isVisible, showModal] = useState(false);
  const { colors } = useTheme();

  handleFocus = () => {
    setIsFocused(true);
  };

  handleBlur = () => {
    setIsFocused(false);
  };

  const clearSearchText = () => {
    setSearchTerm('');
    getFollowers(searchTerm);
  };

  useEffect(() => {
    if (route.params?.user == 'personal') {
      if (debouncedSearchTerm) {
        getFollowers(searchTerm);
      } else {
        getFollowers();
      }
    } else {
      if (debouncedSearchTerm) {
        OtherUserFollowers(route.params?.user.email, searchTerm, (response) => {
          setFollowers(response);
        });
      } else {
        OtherUserFollowers(route.params?.user.email, '', (response) => {
          setFollowers(response);
        });
      }
    }
  }, [debouncedSearchTerm, loader]);

  useEffect(() => {
    if (route.params?.user == 'personal') {
      setFollowers(userfollowers);
    }
  }, [userfollowers]);

  const goToProfile = (item) => {
    item.follower['followers'] = item.no_of_followers;
    item.follower['followings'] = item.no_of_followings;
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

    // navigation.push("PublicProfileScreen", { publicProfile: user })
  };

  const onRemoveFollower = (user) => {
    showModal(true);
    setUser(user);
  };

  const cancelRemove = () => {
    showModal(false);
    setUser({});
  };

  const proceedRemove = () => {
    RemoveFollower(userToRemove);
    showModal(false);
    setUser({});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <UnfollowConfirm
        user={userToRemove}
        type={'remove'}
        isVisible={isVisible}
        isLoading={loader.id == userToRemove.email ? true : false}
        hideConfirmation={() => cancelRemove()}
        onUnfollow={() => proceedRemove()}
      />
      <Item
        rounded
        style={{
          borderRadius: 5,
          marginTop: 10,
          paddingLeft: 0,
          alignSelf: 'center',
          height: 46,
          width: '89%',
          borderColor: isFocused ? Color.Orange : colors.inputBorder,
          backgroundColor: colors.inputInnerColor,
        }}>
        <Icon type="EvilIcons" name="search" style={{ fontSize: 24, color: colors.text }} />
        <Input
          {...testProps('profileFollowersSearchInput')}
          placeholder={'Search...'}
          onChangeText={(e) => setSearchTerm(e)}
          value={searchTerm}
          style={{ marginLeft: -10, fontSize: 14, color: colors.text }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <>
          {isFocused && searchTerm.length !== 0 ? (
            <Icon
              type="EvilIcons"
              name="close"
              onPress={clearSearchText}
              style={{ fontSize: 18, color: colors.text }}
            />
          ) : (
            <View></View>
          )}
        </>
      </Item>
      {followers.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          data={followers}
          renderItem={({ item, index, separators }) => (
            <View style={styles.UserListSection}>
              <Touch style={{ flexDirection: 'row' }} onPress={() => goToProfile(item)}>
                <>
                  {item.follower.profile_pic ? (
                    <ProfileThumb
                      testProp={'profileFollowersUserThumb'}
                      profilePic={item.follower.profile_pic}
                      style={styles.thumbnail}
                    />
                  ) : (
                    <Thumbnail source={noUserPlaceholder} style={styles.thumbnail} />
                  )}
                  <View style={styles.userInformation}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        {...testProps('profileFollowersUserNameText')}
                        style={{ fontSize: 15, color: colors.text }}>
                        {item.follower.name}
                      </Text>
                      {item.follower.is_account_verified && (
                        <Image
                          {...testProps('profileHeaderDrawerBtn')}
                          source={badgeChecdVerified}
                          style={{ ...styles.verifyIcon }}
                          resizeMode={'contain'}
                        />
                      )}
                    </View>
                    <Text
                      {...testProps('profileFollowersUserUsernameText')}
                      style={{
                        fontSize: 13,
                        fontWeight: '300',
                        marginBottom: 5,
                        color: colors.text,
                      }}>
                      @{item.follower.username}
                    </Text>
                    <Text
                      {...testProps('profileFollowersUserBioText')}
                      style={{
                        fontSize: 12,
                        fontWeight: '300',
                        maxWidth: 190,
                        color: colors.text,
                      }}>
                      {item.follower.bio}
                    </Text>
                  </View>
                </>
              </Touch>
              {route.params?.user == 'personal' && (
                <View style={styles.buttonWrapper}>
                  {loader.id == item.follower.email ? (
                    <LinearGradient
                      colors={['#FB6200', '#EF0059']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={styles.gradientButton}>
                      <ActivityIndicator size={'small'} color="#fff" />
                    </LinearGradient>
                  ) : (
                    <TouchableOpacity onPress={() => onRemoveFollower(item.follower)}>
                      <LinearGradient
                        colors={['#FB6200', '#EF0059']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.gradientButton}>
                        <Text
                          {...testProps('profileFollowersUserUnfollowBtn')}
                          style={{ fontSize: 10, color: '#fff' }}>
                          Remove
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ fontSize: 18, flex: 1, justifyContent: 'center' }}>
            {searchTerm && followers.length == 0 ? (
              <View>
                <Image
                  source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
                  style={{ alignSelf: 'center' }}
                />
                <Text
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
            ) : (
              <View>
                <Image
                  source={colors.background == '#fff' ? noUserFound : darkNoUserFound}
                  style={{ alignSelf: 'center' }}
                />
                <Text
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
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

function mapStateToProps(state) {
  return {
    currentLoggedInUser: state.user.user,
    userfollowers: state.followFollowing.followers,
    loader: state.followFollowing.followersRequestLoader,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFollowers: (queryParam = null) => dispatch(GetFollowers(queryParam)),
    followUser: (email) => dispatch(FollowUser(email)),
    RemoveFollower: (email) => dispatch(RemoveFollower(email)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
