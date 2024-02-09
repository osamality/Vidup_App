import { Text, View, FlatList, Image, TouchableHighlight, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'native-base';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { styles } from './styled';
import { Topheader, Postitem, ExportVideoModal } from '../../../../components';
import { likePost, unlikePost, reportPost, savePost } from '../../../../../store/actions/posts';
import { connect } from 'react-redux';
import { playIcon, blankImage, darkBlankImage } from 'assets';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { ModalBtn } from '../../../../components/modalpressabletxt';
import testProps from 'locatorId';
import { Color, FontFamily, itemVisibleThreshold } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { getSavedPosts, UnsavePost, addViewCount } from '../../../../../store/actions/posts';

const SavedViewPostView = (props) => {
  let flatListRef = useRef(null);
  const {
    UnsavePost,
    reportPost,
    navigation,
    savedPosts,
    postViewHeight,
    route,
    muteDispatch,
    isMute,
    updateSavedVideosDispatch,
    unlikePostDispatch,
    likePostDispatch,
    isUnSavedSuccessfully,
    getSavedPosts,
    isLoading,
    currentLoggedInUser,
    updateFeedPostsDispatch,
    addViewCountDispatch,
    isViewCountUpdated,
    isVideoCountReset,
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

  // useEffect(() => {
  //   preVisibileIndex.current = currentVisibleIndex;
  // }, [currentVisibleIndex]);

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

  useEffect(() => {
    if (isUnSavedSuccessfully) {
      getSavedPosts();
    }
  }, [isUnSavedSuccessfully]);

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
        origin={'SavedVideos'}
        onUnSave={() => UnsavePost(item.post.id)}
        onReport={() => openReport(item.post.id)}
        onShare={() => onPostShare(item.post)}
        unlikePost={() => unlikePost(index, item.id)}
        thumbnailPress={() => {
          if (item.post.user.id === currentLoggedInUser.id)
            navigation.navigate('Profile', {
              screen: 'ProfileHome',
            });
          else
            navigation.navigate('HomeScreen', {
              screen: 'HScreen',
              params: {
                screen: 'PublicProfileScreen',
                params: {
                  publicProfile: item.post.user,
                },
              },
            });
        }}
        postLike={() => postLike(index, item.post.id)}
        playPauseMedia={() => playPauseMedia(index)}
        goToComments={() =>
          navigation.push('CommentScreen', {
            nStack: route.params.origin,
            post: item.post,
            origin: 'saved',
          })
        }
        show={index == currentVisibleIndex ? 'show' : 'not'}
        currentIndex={currentVisibleIndex}
        focused={focused ? true : false}
        inFocus={focused}
        item={item.post}
        index={index}
        muteUnmute={() => muteUnmute(index)}
        isMute={isMute}
        updatePlayBack={() => updatePlayBack}
        navigation={navigation}
        onExport={(value) => setExport(value)}
      />
    );
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      setCurentIndex(viewableItems[0].index);
      if (preVisibileIndex.current == 1 && viewableItems[0].index == 0) {
        let tempData = savedPosts;
        tempData[0].post = { ...tempData[0].post, paused: false };
        updateSavedVideosDispatch([...tempData]);
        likePost(!liked);
      }
    }
  }, []);

  const postLike = (index, postId) => {
    let tempData = savedPosts;
    tempData[index].post = {
      ...tempData[index].post,
      isLiked: !tempData[index].post.isLiked,
      likes: tempData[index].post.likes + 1,
    };
    updateSavedVideosDispatch(tempData);
    likePost(index);
    likePostDispatch(postId);
  };

  const unlikePost = (index, postId) => {
    let tempData = savedPosts;
    tempData[index].post = {
      ...tempData[index].post,
      isLiked: !tempData[index].post.isLiked,
      likes: tempData[index].post.likes - 1,
    };
    updateSavedVideosDispatch(tempData);
    likePost(!liked);
    unlikePostDispatch(postId);
  };

  useEffect(() => {
    if (isViewCountUpdated && isViewCountUpdated.isCountUpdated && focused) {
      let tempData = savedPosts;
      let index = tempData.findIndex((elem) => elem.post.id == isViewCountUpdated.postId);
      if (index >= 0) {
        tempData[index].post = {
          ...tempData[index].post,
          view_count: ++tempData[index].post.view_count,
        };
        updateSavedVideosDispatch([...tempData]);
        isVideoCountReset();
      }
    }
  }, [isViewCountUpdated]);

  const playPauseMedia = (index) => {
    let tempData = savedPosts;
    tempData[index].post = { ...tempData[index].post, paused: !tempData[index].post.paused };
    // if (tempData[index].post.paused) {
    //     addViewCountDispatch(tempData[index].post.id, index)
    // }
    updateSavedVideosDispatch(tempData);
    likePost(!liked);
  };

  const muteUnmute = (index) => {
    let mute = isMute;
    muteDispatch(!mute);
    // let tempData = savedPosts;
    // tempData[index].post = { ...tempData[index].post, muted: !tempData[index].post.muted }
    // updateSavedVideosDispatch(tempData)
    likePost(!liked);
  };

  const getItemLayout = (data, index) => ({
    length: hp('51%'),
    offset: hp('51%') * index,
    index,
  });

  const keyExtractor = (item) => `${item.id}`;

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: itemVisibleThreshold,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
      <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        {exporting && <ExportVideoModal />}
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            currentIndex={1}
            origin={'Saved Videos'}
            onPressLeft={() => navigation.goBack()}
          />
        </View>
        <View
          style={{
            marginBottom: 0,
            flex: 1,
            backgroundColor: colors.background == '#fff' ? '#f2f2f7' : colors.background,
          }}>
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
          {savedPosts.length == 0 ? (
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
                {...testProps('savedPostNoVideos')}
                style={{
                  color: Color.LightGrey1,
                  alignSelf: 'center',
                  marginTop: RFValue(10),
                  fontSize: RFValue(12),
                  fontFamily: FontFamily.regular,
                }}>
                You do not have any videos yet.
              </Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 6, paddingBottom: hp('5%') }}
              data={savedPosts}
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
                  {...testProps('savedPostReportContirmText')}
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
                  {...testProps('savedPostReportThanksText')}
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
                      {...testProps('savedPostReportContirmBtn')}
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
                        {...testProps('savedPostReportCancelBtn')}
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
                        {...testProps('savedPostReportOkBtn')}
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
                  testProp={'savedPostReportBtnSpam'}
                  onPress={() => selectReason('Its spam')}
                  text={'Its spam'}
                />
                <ModalBtn
                  testProp={'savedPostReportBtnSexual'}
                  onPress={() => selectReason('Nudity or sexual activity')}
                  text={'Nudity or sexual activity'}
                />
                <ModalBtn
                  testProp={'savedPostReportBtnHateSpeech'}
                  onPress={() => selectReason('Hate speech or symbols')}
                  text={'Hate speach or symbols'}
                />
                <ModalBtn
                  testProp={'savedPostReportBtnIllegal'}
                  onPress={() => selectReason('Sale of illegal or regulated goods')}
                  text={'Sale of illegal or regulated products'}
                />
                <ModalBtn
                  testProp={'savedPostReportBtnBullying'}
                  onPress={() => selectReason('Bullying or harassment')}
                  text={'Bullying or harassment'}
                />
                <ModalBtn
                  testProp={'savedPostReportBtnViolation'}
                  onPress={() => selectReason('Intellectual property violation')}
                  text={'Intellectual property violation'}
                />
                <ModalBtn
                  testProp={'savedPostReportBtnSucide'}
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
    savedPosts: state.postsReducer.savedVideos,
    isMute: state.postsReducer.videoMute,
    isLoading: state.RequestLoaders.isRequested,
    currentLoggedInUser: state.user.user,

    isUnSavedSuccessfully: state.postsReducer.isUnSavedSuccessfully,
    postViewHeight: state.postsReducer.postViewHeight,
    postsData: state.postsReducer.posts,
    savedVideos: state.postsReducer.savedVideos,
    isViewCountUpdated: state.postsReducer.isViewCountUpdated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    likePostDispatch: (postId) => dispatch(likePost(postId)),
    unlikePostDispatch: (postId) => dispatch(unlikePost(postId)),
    UnsavePost: (postId) => dispatch(UnsavePost(postId)),
    reportPost: (postId, reason) => dispatch(reportPost(postId, reason)),
    updateSavedVideosDispatch: (payload) =>
      dispatch({
        type: 'Saved_Videos',
        payload: payload,
      }),
    getSavedPosts: () => dispatch(getSavedPosts()),
    updateFeedPostsDispatch: (payload) => dispatch(updateFeedPosts(payload)),
    updateSavedVideosDispatch: (payload) =>
      dispatch({
        type: 'Saved_Videos',
        payload: payload,
      }),
    addViewCountDispatch: (payload, index) =>
      dispatch(addViewCount(payload, index, 'called from saved')),
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

export default connect(mapStateToProps, mapDispatchToProps)(SavedViewPostView);
