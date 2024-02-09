import React, { useEffect, useState } from 'react';
import { Container, Text, View, Thumbnail, Icon } from 'native-base';
import {
  TouchableHighlight,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styled';
import { Color, FontFamily } from 'constants';
import { getAllUsers } from '../../../../../store/actions/user';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { playIcon, blankImage, darkBlankImage, videoLock, lockDark, lockLight } from 'assets';

//Redux
import { getPersonalPosts, getOtherUserProfile } from '../../../../../store/actions/posts';
import { connect } from 'react-redux';

const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';
import { FollowUser } from '../../../../../store/actions/follow-following';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';

const PublicProfileHome = (props) => {
  const { navigation, route, updatePersonalPosts, personalPosts } = props;
  const [visitedUserPosts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      setLoading(true);
      getOtherUserProfile(route.params.userVisited.id, (response) => {
        if (response) {
          setPosts(response);
          setLoading(false);
        }
      });
      //getPersonalPostsDispatch();
    });
    return () => {
      unsubscribe1();
    };
  }, []);

  const goToPost = (item, index) => {
    var tempData = visitedUserPosts;
    if (index > 0) {
      tempData[0] = { ...tempData[0], paused: true };
      updatePersonalPosts(tempData);
    }
    navigation.push('PersonalPostView', {
      posts: tempData,
      post: item,
      index: index,
      origin: 'PublicProfile',
    });
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
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
      <View style={{ flex: 1 }}>
        {route.params.userVisited.is_private && !route.params.userVisited.follow_back ? (
          <View
            style={{
              backgroundColor: '#fafafa',
              flex: 1,
              borderTopWidth: colors.background == '#fff' ? 5 : 0,
              borderColor: 'transparent',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.23,
              shadowRadius: 4.62,
              elevation: 4,
            }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
              <View
                style={{
                  fontSize: 18,
                  justifyContent: 'center',
                  borderColor: 'transparent',
                  shadowColor: '#000',
                  borderTopWidth: 4,
                  borderRadius: 3,
                  flex: 1,
                }}>
                <Image
                  {...testProps('publicProfileNoVideosImg')}
                  source={colors.background == '#fff' ? lockLight : lockDark}
                  style={{ alignSelf: 'center', tintColor: Color.LightGrey1 }}
                />
                <Text
                  {...testProps('publicProfileNoVideoText')}
                  style={{
                    color: Color.LightGrey1,
                    alignSelf: 'center',
                    marginTop: RFValue(10),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  This account is private
                </Text>
                <Text
                  {...testProps('publicProfileNoVideoText')}
                  style={{
                    color: Color.LightGrey1,
                    alignSelf: 'center',
                    marginTop: RFValue(1),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  Follow this account to see their videos.
                </Text>
              </View>
            </SafeAreaView>
          </View>
        ) : !isLoading && visitedUserPosts.length < 1 ? (
          <View
            style={{
              backgroundColor: '#fafafa',
              flex: 1,
              borderTopWidth: colors.background == '#fff' ? 5 : 0,
              borderColor: 'transparent',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.23,
              shadowRadius: 4.62,
              elevation: 4,
            }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
              <View
                style={{
                  fontSize: 18,
                  justifyContent: 'center',
                  borderColor: 'transparent',
                  shadowColor: '#000',
                  borderTopWidth: 4,
                  borderRadius: 3,
                  flex: 1,
                }}>
                <Image
                  {...testProps('publicProfileNoVideosImg')}
                  source={colors.background == '#fff' ? blankImage : darkBlankImage}
                  style={{ alignSelf: 'center' }}
                />
                <Text
                  {...testProps('publicProfileNoVideoText')}
                  style={{
                    color: Color.LightGrey1,
                    alignSelf: 'center',
                    marginTop: RFValue(10),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  {route.params.userVisited.name && route.params.userVisited.name !== ' '
                    ? route.params.userVisited.name
                    : route.params.userVisited.username}{' '}
                  has not shared any videos yet.
                </Text>
              </View>
            </SafeAreaView>
          </View>
        ) : (
          <View>
            {!isLoading ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={3}
                contentContainerStyle={{ paddingBottom: 10 }}
                data={visitedUserPosts}
                renderItem={({ item, index, separators }) => (
                  <Touch onPress={() => goToPost(item, index)}>
                    <View>
                      <FastImage
                        {...testProps('publicProfileVideoThumbImg')}
                        style={{
                          width: wp('33.70%'),
                          height: wp('33.22%'),
                          resizeMode: 'stretch',
                          borderWidth: 0.5,
                          borderColor: '#fff',
                          marginLeft: -1,
                        }}
                        defaultSource={{
                          uri:
                            !item.user_medias.length || item.user_medias[0]?.thumbnail == null
                              ? 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                              : item.user_medias[0]?.thumbnail,
                        }}
                        source={{
                          uri:
                            !item.user_medias.length || item.user_medias[0]?.thumbnail == null
                              ? 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                              : item.user_medias[0]?.thumbnail,
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                      />
                      <Image
                        {...testProps('publicProfileVideoPlayIcon')}
                        source={playIcon}
                        style={{
                          width: RFValue(23),
                          height: RFValue(23),
                          position: 'absolute',
                          top: RFValue(8),
                          right: RFValue(8),
                        }}
                      />
                    </View>
                  </Touch>
                )}
              />
            ) : (
              <View></View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    users: state.user.users,
    followUserLoader: state.followFollowing.followUserRequestLoader,
    personalPosts: state.postsReducer.personalPosts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllUsers: (uname) => dispatch(getAllUsers(uname)),
    followUser: (email) => dispatch(FollowUser(email)),
    getPersonalPostsDispatch: (page) => dispatch(getPersonalPosts(page)),
    updatePersonalPosts: (payload) =>
      dispatch({
        type: 'Get_Personal_Posts',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicProfileHome);
