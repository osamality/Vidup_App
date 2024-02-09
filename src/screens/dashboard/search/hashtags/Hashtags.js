import React, { useEffect, useState, useCallback } from 'react';
import { Text, View } from 'native-base';
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
import { getAllUsers } from '../../../../../store/actions/user';
import {
  _expoloreVideos,
  _hashVideos,
  getHashTags,
  getTopHashtags,
} from '../../../../../store/actions/posts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { playIcon, blankImage, darkBlankImage, videoLock } from 'assets';
import FastImage from 'react-native-fast-image';
import testProps from 'locatorId';
import LinearGradient from 'react-native-linear-gradient';
import { FollowUser } from '../../../../../store/actions/follow-following';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import TopHashtags from '../../../../components/topHashtags/TopHashtags';
import { Touch } from '../../../../components/touch';

const Hashtags = (props) => {
  const {
    navigation,
    keyWord,
    exploredVideos,
    expoloreVideoDispatch,
    updateExploredVideos,
    _getHashTags,
    _getTopHashtags,
    tophashtags,
    hashVideos,
    updateHashVideos,
    hashVideosDispatch,
    isLoading,
    loggedInUser,
    hashtags,
  } = props;
  const { colors } = useTheme();
  const [videos, setVideos] = useState([]);
  const [selectedHashtag, setSelectedHashtag] = useState(null);
  const onRefresh = useCallback(async () => {
    // expoloreVideoDispatch(keyWord);
  }, [isLoading]);
  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      if (keyWord || keyWord.startsWith('#')) {
        _getTopHashtags(keyWord);
      } else if (selectedHashtag) {
        // hashVideosDispatch(selectedHashtag);
      } else {
        // expoloreVideoDispatch(keyWord);
        // hashVideosDispatch(keyWord);
      }
      _getHashTags();
    });
    if (keyWord || keyWord.startsWith('#')) {
      _getTopHashtags(keyWord);
    } else if (selectedHashtag) {
      // hashVideosDispatch(selectedHashtag);
    } else {
      // expoloreVideoDispatch(keyWord);
      // hashVideosDispatch(keyWord);
    }

    return () => {
      unsubscribe1();
    };
  }, [selectedHashtag, keyWord]);

  useEffect(() => {
    hashtags?.some(
      (i) =>
        i.keyword.toString().replace(/\s/g, '').toLowerCase() ==
        props.route.params?.hashtag.toString().replace(/\s/g, '').toLowerCase(),
    )
      ? setSelectedHashtag(props.route.params?.hashtag.toString().replace(/\s/g, '').toLowerCase())
      : setSelectedHashtag('');
  }, [props.route.params]);

  // useEffect(() => {
  //   hashVideosDispatch(keyWord);
  // }, [keyWord]);

  useEffect(() => {
    if (exploredVideos) {
      setVideos(exploredVideos);
    }
  }, [exploredVideos]);

  const _styles = {
    childTab: {},
    view: {
      alignItems: 'center',
      marginRight: RFValue(16),
      padding: 10,
      justifyContent: 'center',
      borderRadius: 5,
    },
  };

  // const goToPost = (index) => {
  //   let tempData = !!keyWord || !!selectedHashtag ? hashVideos : exploredVideos;
  //   tempData[0] = { ...tempData[0], paused: true };

  //   !!keyWord || !!selectedHashtag ? updateHashVideos(tempData) : updateExploredVideos(tempData);

  //   navigation.push('TopVideosView', {
  //     origin: !!keyWord || !!selectedHashtag ? 'Hash' : 'SearchScreen',
  //     index: index,
  //   });
  // };

  return (
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
      {keyWord || keyWord.startsWith('#') ? (
        <View style={{ flex: 1 }}>
          {tophashtags?.length > 0 && (
            <View style={styles.tophashBar}>
              <Text style={{ color: colors.text }}>Top Results</Text>
            </View>
          )}

          {tophashtags?.length > 0 ? (
            <FlatList
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
              data={tophashtags}
              refreshControl={
                <RefreshControl colors={['#FB6200']} refreshing={isLoading} onRefresh={onRefresh} />
              }
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
          <View style={{ flex: 1 }}>
            {hashtags.length > 0 && (
              <View style={styles.tophashBar}>
                <Text style={{ color: colors.text }}>Top Results</Text>
              </View>
            )}
            {hashtags.length > 0 ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10 }}
                data={hashtags}
                refreshControl={
                  <RefreshControl
                    colors={['#FB6200']}
                    refreshing={isLoading}
                    onRefresh={onRefresh}
                  />
                }
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
                  No Hashtags available right now
                </Text>
              </View>
            )}
          </View>
          {/* <View
            style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginHorizontal: 10 }}>
            {hashtags?.length > 0 ? (
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ paddingBottom: 10 }}
                data={hashtags}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      if (item.keyword === selectedHashtag) {
                        setSelectedHashtag(null);
                      } else {
                        setSelectedHashtag(item.keyword);
                      }
                    }}>
                    <LinearGradient
                      colors={
                        item.keyword === selectedHashtag
                          ? ['#FB6200', '#EF0059']
                          : ['transparent', 'transparent']
                      }
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={{
                        ..._styles.view,
                        backgroundColor:
                          item.keyword === selectedHashtag ? '["#FB6200", "#EF0059"]' : colors.grey,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 12,

                          color: item.keyword === selectedHashtag ? '#fff' : colors.text,
                          fontWeight: 'bold',
                        }}>
                        {item.keyword}
                      </Text>
                    </LinearGradient>
                  </TouchableWithoutFeedback>
                )}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  padding: 10,
                  justifyContent: 'center',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text>No Hashtags available right now</Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            {hashVideos?.length < 1 ? (
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
                      No hashtag video found against "{keyWord}"
                    </Text>
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
                    data={exploredVideos}
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
                          {item.privacy_status === 'private' && (
                            <Image
                              source={videoLock}
                              style={{
                                width: RFValue(20),
                                height: RFValue(20),
                                position: 'absolute',
                                resizeMode: 'contain',
                                bottom: RFValue(10),
                                right: RFValue(8),
                              }}
                            />
                          )}
                        </View>
                      </Touch>
                    )}
                  />
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
                data={!!keyWord || !!selectedHashtag ? hashVideos : exploredVideos}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableWithoutFeedback onPress={() => goToPost(index)}>
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
                        {item.privacy_status === 'private' && (
                          <Image
                            source={videoLock}
                            style={{
                              width: RFValue(20),
                              height: RFValue(20),
                              position: 'absolute',
                              resizeMode: 'contain',
                              bottom: RFValue(10),
                              right: RFValue(8),
                            }}
                          />
                        )}
                      </View>
                    </TouchableWithoutFeedback>
                  );
                }}
              />
            )}
          </View> */}
        </>
      )}
    </View>
  );
};

function mapStateToProps(state) {
  return {
    users: state.user.users,
    loggedInUser: state.user.user,
    followUserLoader: state.followFollowing.followUserRequestLoader,
    isLoading: state.RequestLoaders.isRequested,
    keyWord: state.SearchReducer.searchKeyword,
    exploredVideos: state.postsReducer.expoloreVideos,
    tophashtags: state.postsReducer.tophashtags,
    hashtags: state.postsReducer.hashtags,
    hashVideos: state.postsReducer.hashVideos,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllUsers: (uname) => dispatch(getAllUsers(uname)),
    _getHashTags: () => dispatch(getHashTags()),
    _getTopHashtags: (keyWord) => dispatch(getTopHashtags(keyWord)),
    followUser: (email) => dispatch(FollowUser(email)),
    hashVideosDispatch: (keyWord) => dispatch(_hashVideos(keyWord)),
    expoloreVideoDispatch: (keyWord) => dispatch(_expoloreVideos(keyWord)),
    updateHashVideos: (payload) =>
      dispatch({
        type: 'HASH_VIDEOS',
        payload: payload,
      }),
    updateExploredVideos: (payload) =>
      dispatch({
        type: 'EXPLORE_VIDEOS',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Hashtags);
