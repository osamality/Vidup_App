import React, { useEffect, useState, useCallback } from 'react';
import { Text, View, Thumbnail } from 'native-base';
import {
  Image,
  TouchableWithoutFeedback,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styled';
import { Color, FontFamily } from 'constants';
import { connect } from 'react-redux';
import { getAllUsers, getTopUsers } from '../../../../../store/actions/user';
import { getTopVideos, getTopHashtags } from '../../../../../store/actions/posts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { playIcon, blankImage, darkBlankImage, noUserPlaceholder } from 'assets';
import FastImage from 'react-native-fast-image';
import { ProfileThumb } from 'components';
import testProps from 'locatorId';

import { FollowUser } from '../../../../../store/actions/follow-following';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';

import TopHashtags from '../../../../components/topHashtags/TopHashtags';
import { Touch } from '../../../../components/touch';

const TopResults = (props) => {
  const {
    navigation,
    keyWord,
    topVideos,
    tophashtags,
    _getTopVideos,
    _getTopHashtags,
    isLoading,
    updateTopVideosDispatch,
    getTopUsers,
    loggedInUser,
    topUsers,
    currentLoggedInUser,
  } = props;
  const { colors } = useTheme();
  const [topUsersList, setTopUsersList] = useState([]);
  const [videos, setVideos] = useState([]);

  const onRefresh = useCallback(async () => {
    if (keyWord && keyWord.startsWith('#')) {
      _getTopHashtags(keyWord);
    } else if (keyWord || keyWord == '') {
      _getTopVideos(keyWord);
      getTopUsers(keyWord);
    }
  }, [isLoading]);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      _getTopVideos(keyWord);
      getTopUsers(keyWord);
    });
    if (keyWord && keyWord.startsWith('#')) {
      _getTopHashtags(keyWord);
    } else if (keyWord || keyWord == '') {
      _getTopVideos(keyWord);
      getTopUsers(keyWord);
    }

    return () => {
      unsubscribe1();
    };
  }, [keyWord]);

  useEffect(() => {
    setVideos(topVideos);
  }, [topVideos]);

  useEffect(() => {
    setTopUsersList(topUsers);
  }, [topUsers]);

  const goToPost = (index) => {
    if (index > 0) {
      let tempData = topVideos;
      tempData[0] = { ...tempData[0], paused: true };
      updateTopVideosDispatch([...tempData]);
    }
    navigation.push('TopVideosView', { origin: 'TopVideos', index: index });
  };

  return (
    // <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
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
      {keyWord && keyWord.startsWith('#') ? (
        <View style={{ flex: 1 }}>
          {tophashtags.length > 0 && (
            <View style={styles.tophashBar}>
              <Text style={{ color: colors.text }}>Top Results</Text>
            </View>
          )}

          {tophashtags.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
              refreshControl={
                <RefreshControl colors={['#FB6200']} refreshing={isLoading} onRefresh={onRefresh} />
              }
              data={tophashtags}
              renderItem={({ item }) => <TopHashtags {...props} hash={item} />}
            />
          ) : (
            <View
              style={{
                flex: 1,

                fontSize: 18,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'transparent',
                shadowColor: '#000',
                borderTopWidth: 4,
                borderRadius: 3,
              }}>
              <Image
                {...testProps('searchTopTabBlankKeywordImg')}
                source={colors.background == '#fff' ? blankImage : darkBlankImage}
                style={{ alignSelf: 'center' }}
              />
              <Text
                {...testProps('searchTopTabBlankKeywordText')}
                style={{
                  color: Color.LightGrey1,
                  alignSelf: 'center',
                  marginTop: RFValue(10),
                  fontSize: RFValue(12),
                  fontFamily: FontFamily.regular,
                }}>
                No Hashtags found against "{keyWord}"
              </Text>
            </View>
          )}
        </View>
      ) : (
        <>
          <View style={styles.topBar}>
            <Text style={{ fontSize: 12, fontFamily: FontFamily.medium, color: colors.text }}>
              Users
            </Text>
            <Text
              style={{
                fontSize: 10,
                textDecorationLine: 'underline',
                color: colors.text,
                marginTop: RFValue(3),
              }}
              onPress={() => navigation.navigate('ViewAllTopUserScreen')}>
              View All
            </Text>
          </View>

          <View
            style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginHorizontal: 10 }}>
            {topUsersList.length <= 0 ? (
              <View style={{ alignItems: 'center', alignContent: 'center', width: '100%' }}>
                {isLoading && (
                  <ActivityIndicator
                    color={colors.primary}
                    size="small"
                    style={{ alignSelf: 'center' }}
                  />
                )}
                {!isLoading && topUsersList.length <= 0 ? (
                  <View>
                    <Text
                      {...testProps('searchTopTabNovideosText')}
                      style={{
                        color: Color.LightGrey1,
                        alignSelf: 'center',
                        marginTop: RFValue(10),
                        fontSize: RFValue(12),
                        fontFamily: FontFamily.regular,
                      }}>
                      No users found.
                    </Text>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            ) : (
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                // refreshControl={
                //   <RefreshControl
                //     colors={['#FB6200']}
                //     refreshing={isLoading}
                //     onRefresh={onRefresh}
                //   />
                // }
                contentContainerStyle={{ paddingBottom: 10 }}
                data={topUsersList.slice(0, 6)}
                renderItem={({ item }) => (
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
                    }}>
                    <View style={{ alignItems: 'center', marginRight: RFValue(16) }}>
                      {item.profile_pic ? (
                        <ProfileThumb
                          testProp={'searchTopTabUserThumb'}
                          profilePic={item.profile_pic}
                          style={{ height: 45, width: 45, borderRadius: 45 }}
                        />
                      ) : (
                        <Thumbnail
                          style={{ height: 45, width: 45, borderRadius: 45 }}
                          source={noUserPlaceholder}
                        />
                      )}
                      <Text
                        numberOfLines={1}
                        style={{
                          width: RFValue(40),
                          fontSize: 10,
                          marginTop: 5,
                          marginRight: RFValue(5),
                          marginLeft: RFValue(10),
                          color: colors.text,
                        }}>
                        @{item.username}
                      </Text>
                    </View>
                  </Touch>
                )}
              />
            )}
          </View>
          <View style={styles.topBar}>
            <Text
              style={{
                fontSize: 12,
                color: colors.text,
                fontFamily: FontFamily.medium,
                marginTop: RFValue(5),
              }}>
              Videos
            </Text>
            <Text
              style={{
                fontSize: 10,
                textDecorationLine: 'underline',
                color: colors.text,
                marginTop: RFValue(7),
              }}
              onPress={() => navigation.push('Viewallvideos', { origin: 'TopVideos' })}>
              View All
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            {videos.length < 1 ? (
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
                {keyWord ? (
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
                      {...testProps('searchTopTabBlankKeywordImg')}
                      source={colors.background == '#fff' ? blankImage : darkBlankImage}
                      style={{ alignSelf: 'center' }}
                    />
                    <Text
                      {...testProps('searchTopTabBlankKeywordText')}
                      style={{
                        color: Color.LightGrey1,
                        alignSelf: 'center',
                        marginTop: RFValue(10),
                        fontSize: RFValue(12),
                        fontFamily: FontFamily.regular,
                      }}>
                      No top video found against "{keyWord}"
                    </Text>
                  </View>
                ) : (
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
                      {...testProps('searchTopTabBlankImg')}
                      source={colors.background == '#fff' ? blankImage : darkBlankImage}
                      style={{ alignSelf: 'center' }}
                    />
                    <Text
                      {...testProps('searchTopTabBlankText')}
                      style={{
                        color: Color.LightGrey1,
                        alignSelf: 'center',
                        marginTop: RFValue(10),
                        fontSize: RFValue(12),
                        fontFamily: FontFamily.regular,
                      }}>
                      No top videos yet.
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={3}
                refreshControl={
                  <RefreshControl
                    colors={['#FB6200']}
                    refreshing={isLoading}
                    onRefresh={onRefresh}
                  />
                }
                contentContainerStyle={{ paddingBottom: 10 }}
                data={videos.slice(0, 30)}
                renderItem={({ item, index }) => (
                  <Touch onPress={() => goToPost(index)}>
                    <View>
                      <FastImage
                        {...testProps('searchTopTabVideoThumbImg')}
                        style={{
                          width: wp('33.70%'),
                          height: wp('33.22%'),
                          resizeMode: 'stretch',
                          borderWidth: 0.5,
                          borderColor: '#fff',
                          marginLeft: -1,
                        }}
                        source={{
                          uri: item.user_medias.length
                            ? item.user_medias[0]?.thumbnail
                              ? item.user_medias[0]?.thumbnail
                              : 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                            : 'https://i.vimeocdn.com/video/499134794_1280x720.jpg',
                          headers: {
                            Authorization: `jwt ${loggedInUser.token}`,
                          },
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                      />
                      <Image
                        {...testProps('searchTopTabVideosPlayIcon')}
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
            )}
          </View>
        </>
      )}
    </View>
    // </TouchableWithoutFeedback>
  );
};

function mapStateToProps(state) {
  return {
    users: state.user.users,
    loggedInUser: state.user.user,
    currentLoggedInUser: state.user.user,
    followUserLoader: state.followFollowing.followUserRequestLoader,
    isLoading: state.RequestLoaders.isRequested,
    keyWord: state.SearchReducer.searchKeyword,
    topVideos: state.postsReducer.topVideos,
    tophashtags: state.postsReducer.tophashtags,
    topUsers: state.user.topUsers,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllUsers: (uname) => dispatch(getAllUsers(uname)),
    _getTopVideos: (keyWord) => dispatch(getTopVideos(keyWord)),
    _getTopHashtags: (keyWord) => dispatch(getTopHashtags(keyWord)),
    followUser: (email) => dispatch(FollowUser(email)),
    getTopUsers: (keyWord) => dispatch(getTopUsers(keyWord)),
    updateTopVideosDispatch: (payload) =>
      dispatch({
        type: 'Top_Videos',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TopResults);
