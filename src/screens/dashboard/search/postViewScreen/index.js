import { View, Text, FlatList, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'native-base';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { styles } from './styled';
import { Topheader, Postitem, ExportVideoModal } from '../../../../components';
import {
  likePost,
  unlikePost,
  reportPost,
  savePost,
  UnsavePost,
  addViewCount,
} from '../../../../../store/actions/posts';
import { playIcon, blankImage, darkBlankImage } from 'assets';

import { connect } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native';
import { ModalBtn } from '../../../../components/modalpressabletxt';
import testProps from 'locatorId';
import { Color, FontFamily, itemVisibleThreshold } from 'constants';

const PostViewTopVideos = (props) => {
  let flatListRef = useRef(null);
  const {
    savePost,
    reportPost,
    navigation,
    postViewHeight,
    topVideos,
    isMute,
    muteDispatch,
    route,
    updateTopVideosDispatch,
    unlikePostDispatch,
    likePostDispatch,
    UnsavePost,
    isLoading,
    addViewCountDispatch,
    isVideoCountReset,
    exploredVideos,
    isViewCountUpdated,
    hashVideos,
    currentLoggedInUser,
  } = props;

  const [focused, resetFocus] = useState(true);
  const [liked, likePost] = useState(false);
  const [currentVisibleIndex, setCurentIndex] = useState(route.params?.index);
  const { colors } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [reportConfirm, setconfirmReport] = useState('');
  const [reported, setReport] = useState(false);
  const [postIdReport, setPostId] = useState('');
  const [reportReason, setReason] = useState('');
  const [loadMore, setLoadMore] = useState(true);
  const preVisibileIndex = useRef();
  const [exporting, setExport] = useState(false);
  const [videosData, setData] = useState(
    route.params?.origin == 'TopVideos'
      ? topVideos
      : route.params?.origin == 'Hash'
      ? hashVideos
      : exploredVideos || [],
  );

  useEffect(() => {
    preVisibileIndex.current = currentVisibleIndex;
  }, [currentVisibleIndex]);

  useEffect(() => {
    if (route.params?.origin == 'SearchScreen') {
      setData(exploredVideos);
    }
  }, [exploredVideos]);

  useEffect(() => {
    if (route.params?.origin != 'SearchScreen') {
      if (route.params?.origin == 'Hash') {
        setData(hashVideos);
      } else {
        setData(topVideos);
      }
    }
  }, [topVideos, hashVideos]);

  useEffect(() => {
    flatListRef.scrollToIndex({
      animated: false,
      index: route.params.index == 0 ? 0 : route.params.index,
    });
    const unsubscribe = navigation.addListener('focus', () => {
      resetFocus(true);
    });
    const unsubscribe1 = navigation.addListener('blur', () => {
      resetFocus(false);
    });
    return () => {
      unsubscribe1();
      unsubscribe();
    };
  }, []);

  const openReport = (postId) => {
    setPostId(postId);
    setIsVisible(true);
  };

  const selectReason = (reason) => {
    setconfirmReport(reason);
    setReason(reason);
  };

  const cancelReport = () => {
    setIsVisible(false);
    setconfirmReport('');
    setReason('');
  };

  const proceedReport = () => {
    setconfirmReport('If we find this video violates the guidelines we will remove it.');
    setReport(true);
  };

  const finishReport = () => {
    reportPost(postIdReport, reportReason);
    setIsVisible(false);
    setconfirmReport('');
    setReason('');
    setReport(false);
  };

  const _hideModal = () => {
    setIsVisible(false);
    setconfirmReport('');
    setReport(false);
  };

  const onPostShare = (post) => {
    navigation.navigate('PostScreen', { uri: post.user_medias[0].media_file, post: post });
  };

  const renderItem = ({ item, index }) => {
    return (
      <Postitem
        // origin={route.params?.origin == 'SearchScreen' ? 'ExploreVideos' : 'TopVideos'}
        origin={
          route.params?.origin == 'SearchScreen'
            ? 'ExploreVideos'
            : route.params?.origin == 'Hash'
            ? 'HashVideos'
            : 'TopVideos'
        }
        onSave={() => onPostSave(index, item.id)}
        onUnSave={() => onUnsavePost(index, item.id)}
        onReport={() => openReport(item.id)}
        onShare={() => onPostShare(item)}
        unlikePost={() => unlikePost(index, item.id)}
        thumbnailPress={() => {
          if (item.user.id === currentLoggedInUser.id)
            navigation.navigate('Profile', {
              screen: 'ProfileHome',
            });
          else
            navigation.push('HomeScreen', {
              screen: 'HScreen',
              params: {
                screen: 'PublicProfileScreen',
                params: {
                  publicProfile: item.user,
                },
              },
            });
        }}
        postLike={() => postLike(index, item.id)}
        playPauseMedia={() => playPauseMedia(index)}
        currentIndex={currentVisibleIndex}
        goToComments={() =>
          navigation.push('CommentScreen', { nStack: route.params.origin, post: item })
        }
        show={index == currentVisibleIndex ? 'show' : 'not'}
        focused={focused ? true : false}
        inFocus={focused}
        item={item}
        index={index}
        muteUnmute={() => muteUnmute(index)}
        isMute={isMute}
        navigation={navigation}
        onExport={(value) => setExport(value)}
        //updatePlayBack={() => updatePlayBack}
      />
    );
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      setCurentIndex(viewableItems[0].index);
      if (preVisibileIndex.current == 1 && viewableItems[0].index == 0) {
        let tempData = videosData;
        tempData[0] = { ...tempData[0], paused: false };
        updateTopVideosDispatch(tempData);
        likePost(!liked);
      }
    }
  }, []);

  const onPostSave = (index, postId) => {
    let tempData = videosData;
    tempData[index] = { ...tempData[index], post_saved: !tempData[index].post_saved };
    updateTopVideosDispatch(tempData);
    savePost(postId);
  };

  const onUnsavePost = (index, postId) => {
    let tempData = videosData;
    tempData[index] = { ...tempData[index], post_saved: !tempData[index].post_saved };
    updateTopVideosDispatch(tempData);
    UnsavePost(postId);
  };

  const postLike = (index, postId) => {
    let tempData = videosData;
    tempData[index] = {
      ...tempData[index],
      isLiked: !tempData[index].isLiked,
      likes: tempData[index].likes + 1,
    };
    updateTopVideosDispatch(tempData);
    likePost(!liked);
    likePostDispatch(postId);
  };

  const unlikePost = (index, postId) => {
    let tempData = videosData;
    tempData[index] = {
      ...tempData[index],
      isLiked: !tempData[index].isLiked,
      likes: tempData[index].likes - 1,
    };
    updateTopVideosDispatch(tempData);
    likePost(!liked);
    unlikePostDispatch(postId);
  };
  useEffect(() => {
    if (isViewCountUpdated && isViewCountUpdated.isCountUpdated) {
      let tempData = videosData;
      let index = tempData.findIndex((elem) => elem.id == isViewCountUpdated.postId);
      if (index >= 0) {
        tempData[index].post = { ...tempData[index], view_count: ++tempData[index].view_count };
        updateTopVideosDispatch([...tempData]);
        isVideoCountReset();
      }
      // tempData[isViewCountUpdated.postIndex] = { ...tempData[isViewCountUpdated.postIndex], view_count: ++tempData[isViewCountUpdated.postIndex].view_count }
      // updateTopVideosDispatch([...tempData])
      // isVideoCountReset()
    }
  }, [isViewCountUpdated]);

  const playPauseMedia = (index) => {
    let tempData = videosData;
    tempData[index] = { ...tempData[index], paused: !tempData[index].paused };
    // if (tempData[index].paused) {
    //     addViewCountDispatch(tempData[index].id, index)
    // }
    updateTopVideosDispatch(tempData);
    likePost(!liked);
  };

  const muteUnmute = (index) => {
    let mute = isMute;
    muteDispatch(!mute);
    // let tempData = topVideos;
    // tempData[index] = { ...tempData[index], muted: !tempData[index].muted }
    // updateTopVideosDispatch(tempData)
    likePost(!liked);
  };

  const keyExtractor = (item) => `${item.id}`;
  // itemVisibleThreshold
  const _viewabilityConfig = {
    itemVisiblePercentThreshold: itemVisibleThreshold,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
      <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            currentIndex={videosData.length > 0 ? 1 : 0}
            origin={
              route.params?.origin == 'Hash'
                ? 'Videos'
                : route.params?.origin == 'TopVideos'
                ? 'Top Videos'
                : 'Videos'
            }
            onPressLeft={() => navigation.goBack()}
          />
        </View>
        <View
          style={{
            marginBottom: 0,
            flex: 1,
            backgroundColor:
              videosData.length > 0
                ? colors.background == '#fff'
                  ? '#f2f2f7'
                  : colors.background
                : colors.backgrounds,
          }}>
          {/* {
                        isLoading && 
                        <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 999, flexDirection: 'column', alignContent: 'center', justifyContent: 'center', backgroundColor: colors.background, opacity: 0.8 }}>
                            <ActivityIndicator color={colors.primary} size="small" />
                        </View>
                    } */}
          {exporting && <ExportVideoModal />}
          {videosData.length > 0 ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 6, paddingBottom: hp('5%') }}
              data={videosData}
              ref={(ref) => {
                flatListRef = ref;
              }}
              extraData={liked}
              getItemLayout={(data, index) => {
                return {
                  length: postViewHeight,
                  offset: postViewHeight * index,
                  index,
                };
              }}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              onViewableItemsChanged={_onViewableItemsChanged}
              viewabilityConfig={_viewabilityConfig}
              windowSize={2}
              initialNumToRender={2}
              onEndReachedThreshold={1}
              maxToRenderPerBatch={1}
              removeClippedSubviews={false}
              onEndReached={() => setLoadMore(false)}
              ListFooterComponent={
                <View>
                  {loadMore && !isLoading && (
                    <ActivityIndicator style={{ marginBottom: 10 }} size="small" color="#D3D3D3" />
                  )}
                </View>
              }
            />
          ) : (
            <View
              style={{
                fontSize: 18,
                justifyContent: 'center',
                backgroundColor: colors.background,
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
                No video found
              </Text>
            </View>
          )}
        </View>
      </View>
      <View>
        <Modal
          testID={'modal'}
          isVisible={isVisible}
          onBackdropPress={() => _hideModal()}
          swipeDirection={['up', 'left', 'right', 'down']}
          style={styles.view}>
          <View style={{ backgroundColor: colors.card, borderRadius: RFValue(10) }}>
            <View
              style={{
                width: '100%',
                paddingVertical: RFValue(10),
                borderBottomWidth: 1,
                borderBottomColor: colors.background == '#fff' ? '#F2F2F7' : Color.LightGrey3,
              }}>
              <View
                style={{
                  borderWidth: 3,
                  borderRadius: 50,
                  borderColor: Color.LightGrey1,
                  width: 60,
                  alignSelf: 'center',
                  marginTop: 10,
                }}></View>
              {!reported && (
                <Text
                  {...testProps('searchPostViewReportText')}
                  style={{
                    color: colors.text,
                    alignSelf: 'center',
                    fontSize: RFValue(15),
                    fontFamily: FontFamily.medium,
                    paddingTop: RFValue(15),
                  }}>
                  {reportConfirm != '' ? 'You are about to report this post!' : 'Report'}
                </Text>
              )}
              {reported && (
                <Text
                  {...testProps('searchPostViewReportText')}
                  style={{
                    color: colors.text,
                    alignSelf: 'center',
                    fontSize: RFValue(15),
                    fontFamily: FontFamily.medium,
                    paddingTop: RFValue(15),
                  }}>
                  Thank you for reporting!
                </Text>
              )}
            </View>
            {reportConfirm != '' && !reported ? (
              <View
                style={{
                  width: '100%',
                  padding: RFValue(5),
                  paddingHorizontal: RFValue(20),
                  paddingBottom: RFValue(20),
                }}>
                <Text
                  style={{
                    color: colors.text,
                    alignSelf: 'center',
                    fontFamily: FontFamily.normal,
                    paddingTop: RFValue(15),
                  }}>{`Reason: ${reportConfirm}`}</Text>
                <View
                  style={{
                    marginBottom: RFValue(35),
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'center',
                  }}>
                  {/* <TouchableHighlight onPress={() => setIsVisible(false)} underlayColor="none" style={{ marginTop: RFValue(20) }}> */}
                  <Button
                    onPress={() => proceedReport()}
                    style={[
                      styles.outlineButton,
                      {
                        maxWidth: 100,
                        minWidth: 100,
                        marginTop: RFValue(20),
                        marginRight: RFValue(10),
                      },
                    ]}
                    transparent>
                    <Text
                      {...testProps('searchPostViewReportBtnConform')}
                      style={{
                        width: '100%',
                        color: '#FB6200',
                        textAlign: 'center',
                        alignSelf: 'center',
                        fontFamily: FontFamily.regular,
                        fontWeight: '400',
                        fontSize: 12,
                        textTransform: 'capitalize',
                      }}>
                      Report
                    </Text>
                  </Button>
                  <TouchableHighlight
                    onPress={() => cancelReport()}
                    underlayColor="none"
                    style={{ marginTop: RFValue(20) }}>
                    <LinearGradient
                      colors={['#FB6200', '#EF0059']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={[styles.loginButton, { maxWidth: 100, minWidth: 100 }]}>
                      <Text
                        {...testProps('searchPostViewReportBtnCancel')}
                        style={{
                          color: '#fff',
                          height: 37,
                          fontFamily: FontFamily.regular,
                          fontWeight: '400',
                          fontSize: 12,
                          textTransform: 'capitalize',
                        }}>
                        Cancel
                      </Text>
                    </LinearGradient>
                  </TouchableHighlight>
                </View>
              </View>
            ) : reported ? (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  padding: RFValue(5),
                  paddingHorizontal: RFValue(20),
                  paddingBottom: RFValue(20),
                }}>
                <Text
                  style={{
                    color: colors.text,
                    alignSelf: 'center',
                    fontFamily: FontFamily.normal,
                    paddingTop: RFValue(15),
                  }}>
                  {reportConfirm}
                </Text>
                <View
                  style={{
                    marginBottom: RFValue(35),
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'center',
                  }}>
                  <TouchableHighlight
                    onPress={() => finishReport()}
                    underlayColor="none"
                    style={{ alignSelf: 'center', marginTop: RFValue(20) }}>
                    <LinearGradient
                      colors={['#FB6200', '#EF0059']}
                      start={{ x: 1, y: 1 }}
                      end={{ x: 0, y: 0 }}
                      style={[styles.loginButton, { padding: 15, paddingHorizontal: 40 }]}>
                      <Text
                        {...testProps('searchPostViewReportBtnOk')}
                        style={{
                          color: '#fff',
                          height: 37,
                          textTransform: 'capitalize',
                          fontSize: 12,
                        }}>
                        Ok
                      </Text>
                    </LinearGradient>
                  </TouchableHighlight>
                </View>
              </View>
            ) : (
              <View
                style={{
                  width: '100%',
                  padding: RFValue(5),
                  paddingHorizontal: RFValue(20),
                  paddingBottom: RFValue(20),
                }}>
                <Text
                  style={{
                    color: colors.text,
                    alignSelf: 'flex-start',
                    fontSize: RFValue(15),
                    fontFamily: FontFamily.medium,
                    paddingTop: RFValue(15),
                  }}>
                  Why are you reporting this post?{' '}
                </Text>
                <ModalBtn
                  testProp={'searcPosthReportBtnSpam'}
                  onPress={() => selectReason('Its spam')}
                  text={'Its spam'}
                />
                <ModalBtn
                  testProp={'searcPostReportBtnSexual'}
                  onPress={() => selectReason('Nudity or sexual activity')}
                  text={'Nudity or sexual activity'}
                />
                <ModalBtn
                  testProp={'searcPostReportBtnHateSpeech'}
                  onPress={() => selectReason('Hate speech or symbols')}
                  text={'Hate speach or symbols'}
                />
                <ModalBtn
                  testProp={'searcPostReportBtnIllegal'}
                  onPress={() => selectReason('Sale of illegal or regulated goods')}
                  text={'Sale of illegal or regulated products'}
                />
                <ModalBtn
                  testProp={'searcPostReportBtnBullying'}
                  onPress={() => selectReason('Bullying or harassment')}
                  text={'Bullying or harassment'}
                />
                <ModalBtn
                  testProp={'searcPostReportBtnViolation'}
                  onPress={() => selectReason('Intellectual property violation')}
                  text={'Intellectual property violation'}
                />
                <ModalBtn
                  testProp={'searcPosteReportBtnSucide'}
                  onPress={() => selectReason('Suicide, self-injury or eating disorders')}
                  text={'Suicide, self-injury or eating disorders'}
                />
              </View>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    currentLoggedInUser: state.user.user,
    savedPosts: state.postsReducer.savedPosts,
    topVideos: state.postsReducer.topVideos,
    isLoading: state.RequestLoaders.isRequested,
    isMute: state.postsReducer.videoMute,
    postViewHeight: state.postsReducer.postViewHeight,
    isViewCountUpdated: state.postsReducer.isViewCountUpdated,
    exploredVideos: state.postsReducer.expoloreVideos,
    hashVideos: state.postsReducer.hashVideos,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    likePostDispatch: (postId) => dispatch(likePost(postId)),
    unlikePostDispatch: (postId) => dispatch(unlikePost(postId)),
    savePost: (postId) => dispatch(savePost(postId)),
    reportPost: (postId, reason) => dispatch(reportPost(postId, reason)),
    updateTopVideosDispatch: (payload) =>
      dispatch({
        type: 'Top_Videos',
        payload: payload,
      }),
    UnsavePost: (postId) => dispatch(UnsavePost(postId)),
    addViewCountDispatch: (payload, index) => dispatch(addViewCount(payload, index)),
    isVideoCountReset: () =>
      dispatch({
        type: 'IS_VIEW_COUNT_UPDATED_RESET',
        payload: {
          postId: null,
          postIndex: null,
          isCountUpdated: false,
        },
      }),
    muteDispatch: (value) =>
      dispatch({
        type: 'IS_MEDIA_MUTE',
        payload: value,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostViewTopVideos);
