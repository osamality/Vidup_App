import React, { useEffect, useCallback, useState } from 'react';
import { Text, View } from 'native-base';
import {
  ActivityIndicator,
  RefreshControl,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from 'react-native';
import { styles } from './styled';
import { Color, FontFamily } from 'constants';
import { playIcon, blankImage, darkBlankImage, videoLock } from 'assets';
import FastImage from 'react-native-fast-image';
import { connect } from 'react-redux';
import { _expoloreVideos } from '../../../../../store/actions/posts';
import { RFValue } from 'react-native-responsive-fontsize';

import { FollowUser } from '../../../../../store/actions/follow-following';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';

const SearchVideos = (props) => {
  const {
    navigation,
    exploredVideos,
    expoloreVideoDispatch,
    updateExploredVideos,
    isLoading,
    loggedInUser,
    keyWord,
    totalPages,
  } = props;

  const { colors } = useTheme();
  const [page, setPage] = useState(2);

  // const onRefresh = useCallback(async () => {
  //   expoloreVideoDispatch(keyWord, 1);
  // }, [isLoading]);
  // useEffect(() => {
  //     const unsubscribe = navigation.addListener('focus', () => {
  //         if(keyWord == '') {
  //             _getTopVideos();
  //         }
  //     });
  //     if (keyWord) {
  //         let tempArray = [];
  //         if(topVideos.length) {
  //             topVideos.forEach(element => {
  //                 if((element.description && element.description.includes(keyWord.toLowerCase())) || ( element.user.username && element.user.username.includes(keyWord.toLowerCase()))) {
  //                     tempArray.push(element);
  //                 }
  //             });
  //             setVideos(tempArray);
  //         }

  //     } else {
  //         setVideos(topVideos);
  //     }
  //     return () => {
  //         unsubscribe();
  //     }

  // }, [keyWord, topVideos]);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      expoloreVideoDispatch(keyWord, 1);
    });
    expoloreVideoDispatch(keyWord, 1);

    return () => {
      unsubscribe1();
    };
  }, []);

  useEffect(() => {
    expoloreVideoDispatch(keyWord, 1);
  }, [keyWord]);

  const goToPost = (index) => {
    if (index > 0) {
      let tempData = exploredVideos;
      tempData[0] = { ...tempData[0], paused: true };
      updateExploredVideos(tempData);
    }
    navigation.push('TopVideosView', { origin: 'SearchScreen', index: index });
  };

  const _loadMore = () => {
    if (page <= totalPages.totalPages) {
      expoloreVideoDispatch(keyWord, page);
      setPage(page + 1);
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      {/* {isLoading && !refreshing && (
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
      {exploredVideos?.length < 1 ? (
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
                {...testProps('searchVideos')}
                source={colors.background == '#fff' ? blankImage : darkBlankImage}
                style={{ alignSelf: 'center' }}
              />
              <Text
                style={{
                  color: Color.LightGrey1,
                  alignSelf: 'center',
                  marginTop: RFValue(10),
                  fontSize: RFValue(12),
                  fontFamily: FontFamily.regular,
                }}>
                No video found against "{keyWord}"
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
                source={colors.background == '#fff' ? blankImage : darkBlankImage}
                style={{ alignSelf: 'center' }}
              />
              <Text
                style={{
                  color: Color.LightGrey1,
                  alignSelf: 'center',
                  marginTop: RFValue(10),
                  fontSize: RFValue(12),
                  fontFamily: FontFamily.regular,
                }}>
                No videos yet.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={3}
          contentContainerStyle={{ paddingBottom: 10 }}
          // refreshControl={
          //   <RefreshControl colors={['#FB6200']} refreshing={isLoading} onRefresh={onRefresh} />
          // }
          data={exploredVideos?.slice(0, 30)}
          onEndReached={() => _loadMore()}
          onEndReachedThreshold={0.5}
          renderItem={({ item, index }) => (
            <Touch onPress={() => goToPost(index)}>
              <View>
                <FastImage
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
                  {...testProps('searchVideosImg')}
                />
                <Image
                  {...testProps('searchVideosPlayIcon')}
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
  );
};

function mapStateToProps(state) {
  return {
    exploredVideos: state.postsReducer.expoloreVideos,
    totalPages: state.postsReducer.expolreVideosExtra,
    followUserLoader: state.followFollowing.followUserRequestLoader,
    isLoading: state.RequestLoaders.isRequested,
    keyWord: state.SearchReducer.searchKeyword,
    loggedInUser: state.user.user,
    topVideos: state.postsReducer.topVideos,
    users: state.user.users,
    totalPages: state.postsReducer.exploreVideosExtra,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    expoloreVideoDispatch: (keyWord, page) => dispatch(_expoloreVideos(keyWord, page)),
    followUser: (email) => dispatch(FollowUser(email)),
    updateExploredVideos: (payload) =>
      dispatch({
        type: 'EXPLORE_VIDEOS',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchVideos);
