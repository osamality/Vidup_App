import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Text, Item, Icon, Input, View, Thumbnail, Button, List, ListItem } from 'native-base';
import { styles } from './styled';
import {
  GetFollowings,
  UnfollowUser,
  OtherUserFollowings,
} from '../../../../../../store/actions/follow-following';
import { connect } from 'react-redux';
import useDebounce from '../../../../../helper/common-functions/debounce';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { TouchableWithoutFeedback as TouchableWithoutFeedback2 } from 'react-native-gesture-handler';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { noUserFound, noUserPlaceholder, darkNoUserFound, badgeChecdVerified } from 'assets';
import { useTheme } from '@react-navigation/native';
import { UnfollowConfirm, ProfileThumb } from 'components';
import testProps from 'locatorId';
import { Touch } from '../../../../../components/touch';

const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';

const Following = (props) => {
  const {
    userfollowings,
    getFollowings,
    navigation,
    loader,
    route,
    UnfollowUser,
    currentLoggedInUser,
  } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [followings, setFollowings] = useState(
    route.params?.user == 'personal' ? userfollowings : [],
  );
  const [isFocused, setIsFocused] = useState(false);
  const [userToUnfollow, setUser] = useState({});
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
    getFollowings(searchTerm);
  };
  useEffect(() => {
    if (route.params?.user == 'personal') {
      if (debouncedSearchTerm) {
        getFollowings(searchTerm);
      } else {
        getFollowings();
      }
    } else {
      if (debouncedSearchTerm) {
        OtherUserFollowings(route.params?.user.email, searchTerm, (response) => {
          setFollowings(response);
        });
      } else {
        OtherUserFollowings(route.params?.user.email, '', (response) => {
          setFollowings(response);
        });
      }
    }
  }, [debouncedSearchTerm, loader]);

  useEffect(() => {
    if (route.params?.user == 'personal') {
      setFollowings(userfollowings);
    }
  }, [userfollowings]);

  const goToProfile = (item) => {
    item.following['followers'] = item.no_of_followers;
    item.following['followings'] = item.no_of_followings;
    if (item.following.id === currentLoggedInUser.id)
      navigation.navigate('Profile', {
        screen: 'ProfileHome',
      });
    else
      navigation.push('HomeScreen', {
        screen: 'HScreen',
        params: {
          screen: 'PublicProfileScreen',
          params: {
            publicProfile: item.following,
          },
        },
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
    UnfollowUser(userToUnfollow);
    showModal(false);
    setUser({});
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <UnfollowConfirm
        user={userToUnfollow}
        isVisible={isVisible}
        isLoading={loader.id == userToUnfollow.email ? true : false}
        hideConfirmation={() => cancelUnfollow()}
        onUnfollow={() => proceedUnfollow()}
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
          {...testProps('profileFollowingSearchInput')}
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
      {followings.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          data={followings}
          renderItem={({ item, index, separators }) => (
            <View style={styles.UserListSection}>
              <Touch style={{ flexDirection: 'row' }} onPress={() => goToProfile(item)}>
                <>
                  {item.following.profile_pic ? (
                    <ProfileThumb
                      testProp={'profileFollowingUserThumb'}
                      profilePic={item.following.profile_pic}
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
                        {...testProps('profileFollowingUserNameText')}
                        style={{ fontSize: 15, color: colors.text }}>
                        {item.following.name}
                      </Text>
                      {item.following.is_account_verified && (
                        <Image
                          {...testProps('profileHeaderDrawerBtn')}
                          source={badgeChecdVerified}
                          style={{ ...styles.verifyIcon }}
                          resizeMode={'contain'}
                        />
                      )}
                    </View>
                    <Text
                      {...testProps('profileFollowingUserUsernameText')}
                      style={{
                        fontSize: 13,
                        fontWeight: '300',
                        marginBottom: 5,
                        color: colors.text,
                      }}>
                      @{item.following.username}
                    </Text>
                    <Text
                      {...testProps('profileFollowingUserBioText')}
                      style={{
                        fontSize: 12,
                        fontWeight: '300',
                        maxWidth: 190,
                        color: colors.text,
                      }}>
                      {item.following.bio}{' '}
                    </Text>
                  </View>
                </>
              </Touch>
              {route.params?.user == 'personal' && (
                <View style={styles.buttonWrapper}>
                  {loader.id == item.following.email ? (
                    <View style={[styles.buttonOutline, { borderWidth: 1 }]}>
                      <ActivityIndicator
                        size={'small'}
                        style={{ marginHorizontal: 20 }}
                        color={colors.text}
                      />
                    </View>
                  ) : (
                    <Button
                      bordered
                      rounded
                      small
                      {...testProps('profileFollowingUserUnfollowBtn')}
                      onPress={() => onUnfollow(item.following)}
                      style={[styles.buttonOutline, { paddingHorizontal: 3 }]}>
                      <Text style={styles.buttonText}>Unfollow</Text>
                    </Button>
                  )}
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ fontSize: 18, flex: 1, justifyContent: 'center' }}>
            {searchTerm && followings.length == 0 ? (
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
    userfollowings: state.followFollowing.followings,
    loader: state.followFollowing.followUserRequestLoader,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getFollowings: (queryParam = null) => dispatch(GetFollowings(queryParam)),
    // OtherUserFollowers: (email) => dispatch(OtherUserFollowers(email)),
    UnfollowUser: (email) => dispatch(UnfollowUser(email)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Following);
