import { View, Image, FlatList, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useRef, useEffect, useState } from 'react';
import { styles } from './styled';
import FastImage from 'react-native-fast-image';
import { Topheader } from '../../../../components';
import { likePost, unlikePost, _expoloreVideos } from '../../../../../store/actions/posts';
import { connect } from 'react-redux';
import { playIcon, blankImage, darkBlankImage } from 'assets';
import { Color, FontFamily } from 'constants';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';
import { ActivityIndicator } from 'react-native';

const HashtagVideos = (props) => {
  let flatListRef = useRef(null);
  const {
    navigation,
    keyWord,
    exploredVideos,
    updateExploredVideos,
    loggedInUser,
    expoloreVideoDispatch,
    totalPages,
  } = props;
  const { colors } = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(true);
  const [page, setPage] = useState(2);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      expoloreVideoDispatch(keyWord, 1);
    });
    expoloreVideoDispatch(keyWord, 1);

    return () => {
      unsubscribe1();
    };
  }, [keyWord]);

  // const goToPost = (index) => {
  //   if (index > 0) {
  //     let tempData = exploredVideos;
  //     tempData[0] = { ...tempData[0], paused: true };
  //     updateExploredVideos(tempData);
  //   }
  //   navigation.push('TopVideosView', {
  //     origin: route.params?.origin == 'TopVideos' ? 'TopVideos' : 'SearchScreen',
  //     index: index,
  //   });
  // };

  const _loadMore = () => {
    console.log('pagination --- = ', page, totalPages.totalPages);
    if (page < totalPages.totalPages) {
      expoloreVideoDispatch(keyWord, page);
      setPage(page + 1);
    }
    setLoadMore(false);
  };

  const goToPost = (index) => {
    if (index > 0) {
      let tempData = exploredVideos;
      tempData[0] = { ...tempData[0], paused: true };
      updateExploredVideos(tempData);
    }
    navigation.push('TopVideosView', { origin: 'SearchScreen', index: index });
  };
  console.log(exploredVideos.length);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
      <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={keyWord}
            onPressLeft={() => navigation.goBack()}
          />
        </View>
        {/* <View style={[styles.wrapper, { backgroundColor: colors.background }]}> */}
        {isLoading ? (
          <View style={{ marginTop: hp(35) }}>
            <ActivityIndicator color="black" size="small" />
          </View>
        ) : exploredVideos.length >= 1 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            numColumns={3}
            contentContainerStyle={{ paddingBottom: 10 }}
            data={exploredVideos}
            // onEndReached={() => _loadMore()}
            // onEndReachedThreshold={0.9}
            renderItem={({ item, index, separators }) => (
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
                    {...testProps('searchAllVideosThumb')}
                  />
                  <Image
                    {...testProps('searchAllVideosThumbPlayIcon')}
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
              No public videos found against "{keyWord}"
            </Text>
          </View>
        )}
        {/* </View> */}
      </View>
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    topVideos: state.postsReducer.topVideos,
    exploredVideos: state.postsReducer.expoloreVideos,
    keyWord: state.SearchReducer.searchKeyword,
    loggedInUser: state.user.user,
    totalPages: state.postsReducer.exploreVideosExtra,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    expoloreVideoDispatch: (keyWord, page) => dispatch(_expoloreVideos(keyWord, page)),
    updateExploredVideos: (payload) =>
      dispatch({
        type: 'EXPLORE_VIDEOS',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HashtagVideos);
