import {
  Text,
  View,
  Image,
  FlatList,
  StatusBar,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'native-base';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { styles } from './styled';

import testProps from 'locatorId';
import { Color, FontFamily, itemVisibleThreshold } from 'constants';
import { Topheader, Postitem, ExportVideoModal } from '../../../../components';
import {
  likePost,
  unlikePost,
  reportPost,
  savePost,
  UnsavePost,
  addViewCount,
} from '../../../../../store/actions/posts';
import { connect } from 'react-redux';
import { commentIcon, muteIcon, unmuteIcon, playIcon } from 'assets';
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
import { blankImage, darkBlankImage } from 'assets';

const PostView = (props) => {
  let flatListRef = useRef(null);
  const {
    savePost,
    reportPost,
    navigation,
    postViewHeight,
    isMute,
    muteDispatch,
    route,
    personalPosts,
    updatePersonalPosts,
    unlikePostDispatch,
    likePostDispatch,
    isLoading,
    UnsavePost,
    addViewCountDispatch,
    isVideoCountReset,
    isViewCountUpdated,
  } = props;

  const [postItem, setPost] = useState(route.params.post);
  const [focused, resetFocus] = useState(true);
  const [liked, likePost] = useState(false);
  const [likes, updateLikes] = useState(route.params.post.likes);
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
  const [visitedPosts, setPosts] = useState(route.params?.posts);
  const [newPosts, setNewPosts] = useState(personalPosts);

  useEffect(() => {
    preVisibileIndex.current = currentVisibleIndex;
  }, [currentVisibleIndex]);

  useEffect(() => {
    if (route.params?.origin == 'Profile') {
      setPosts(personalPosts);
      setNewPosts(personalPosts);
    }
  }, [personalPosts, visitedPosts]);

  useEffect(() => {
    if (visitedPosts.length > 0) {
      flatListRef.scrollToIndex({
        animated: false,
        index: route.params.index == 0 ? 0 : route.params.index,
      });
    }
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
    navigation.navigate('PostScreen', {
      uri: post.user_medias[0].media_file,
      post: post,
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <Postitem
        origin={'Profile'}
        onSave={() => onPostSave(index, item.id)}
        onUnSave={() => onUnsavePost(index, item.id)}
        onReport={() => openReport(item.id)}
        onShare={() => onPostShare(item)}
        unlikePost={() => unlikePost(index, item.id)}
        thumbnailPress={() => navigation.goBack()}
        postLike={() => postLike(index, item.id)}
        playPauseMedia={() => playPauseMedia(index)}
        goToComments={() =>
          navigation.push('CommentScreen', {
            nStack: route.params.origin,
            post: item,
          })
        }
        show={index == currentVisibleIndex ? 'show' : 'not'}
        currentIndex={currentVisibleIndex}
        focused={focused ? true : false}
        inFocus={focused}
        item={item}
        index={index}
        muteUnmute={() => muteUnmute(index)}
        isMute={isMute}
        navigation={navigation}
        onExport={(value) => setExport(value)}
        // updatePlayBack={() => updatePlayBack}
      />
    );
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      setCurentIndex(viewableItems[0].index);
      if (preVisibileIndex.current == 1 && viewableItems[0].index == 0) {
        let tempData = newPosts;
        tempData[0] = { ...tempData[0], paused: false };
        setPosts(tempData);
        likePost(!liked);
      }
    }
  }, []);

  const onPostSave = (index, postId) => {
    let tempData = visitedPosts;
    tempData[index] = {
      ...tempData[index],
      post_saved: !tempData[index].post_saved,
    };
    setPosts(tempData);
    savePost(postId);
  };
  const onUnsavePost = (index, postId) => {
    let tempData = visitedPosts;
    tempData[index] = {
      ...tempData[index],
      post_saved: !tempData[index].post_saved,
    };
    setPosts(tempData);
    UnsavePost(postId);
  };
  const postLike = (index, postId) => {
    let tempData = visitedPosts;
    tempData[index] = {
      ...tempData[index],
      isLiked: !tempData[index].isLiked,
      likes: tempData[index].likes + 1,
    };
    setPosts(tempData);
    likePost(index);
    likePostDispatch(postId);
  };

  const unlikePost = (index, postId) => {
    let tempData = visitedPosts;
    tempData[index] = {
      ...tempData[index],
      isLiked: !tempData[index].isLiked,
      likes: tempData[index].likes - 1,
    };
    setPosts(tempData);
    likePost(!liked);
    unlikePostDispatch(postId);
  };
  // useEffect(() => {
  //     if (isViewCountUpdated && isViewCountUpdated.isCountUpdated && focused) {
  //         let tempData = visitedPosts;
  //         tempData[isViewCountUpdated.postIndex] = { ...tempData[isViewCountUpdated.postIndex], view_count: ++tempData[isViewCountUpdated.postIndex].view_count }
  //         setPosts([...tempData])
  //     }
  // }, [isViewCountUpdated])

  const playPauseMedia = (index) => {
    let tempData = visitedPosts;
    tempData[index] = { ...tempData[index], paused: !tempData[index].paused };
    // if (tempData[index].paused) {
    //     addViewCountDispatch(tempData[index].id, index)
    // }
    setPosts(tempData);
    likePost(!liked);
  };

  const muteUnmute = (index) => {
    let mute = isMute;
    muteDispatch(!mute);
    // let tempData = personalPosts;
    // tempData[index] = { ...tempData[index], muted: !tempData[index].muted }
    // updatePersonalPosts(tempData)
    likePost(!liked);
  };

  const keyExtractor = (item) => `${item.id}`;

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: itemVisibleThreshold,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
      <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader currentIndex={1} origin={'Posts'} onPressLeft={() => navigation.goBack()} />
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
          {exporting && <ExportVideoModal />}
          {visitedPosts.length <= 0 ? (
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
                {...testProps('profilePostViewNoVideos')}
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
              contentContainerStyle={{ paddingBottom: hp('5%') }}
              data={visitedPosts}
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
                  {...testProps('profilePostViewReportText')}
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
                  {...testProps('profilePostViewReportText')}
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
                      {...testProps('profilePostViewReportBtnConform')}
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
                        {...testProps('profilePostViewReportBtnCancel')}
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
                        {...testProps('profilePostViewReportBtnOk')}
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
                  testProp={'profilePostViewReportBtnSpam'}
                  onPress={() => selectReason('Its spam')}
                  text={'Its spam'}
                />
                <ModalBtn
                  testProp={'profilePostViewReportBtnSexual'}
                  onPress={() => selectReason('Nudity or sexual activity')}
                  text={'Nudity or sexual activity'}
                />
                <ModalBtn
                  testProp={'profilePostViewReportBtnHateSpeech'}
                  onPress={() => selectReason('Hate speech or symbols')}
                  text={'Hate speach or symbols'}
                />
                <ModalBtn
                  testProp={'profilePostViewReportBtnIllegal'}
                  onPress={() => selectReason('Sale of illegal or regulated goods')}
                  text={'Sale of illegal or regulated products'}
                />
                <ModalBtn
                  testProp={'profilePostViewReportBtnBullying'}
                  onPress={() => selectReason('Bullying or harassment')}
                  text={'Bullying or harassment'}
                />
                <ModalBtn
                  testProp={'profilePostViewReportBtnViolation'}
                  onPress={() => selectReason('Intellectual property violation')}
                  text={'Intellectual property violation'}
                />
                <ModalBtn
                  testProp={'profilePostViewReportBtnSucide'}
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
    personalPosts: state.postsReducer.personalPosts,
    savedPosts: state.postsReducer.savedPosts,
    isMute: state.postsReducer.videoMute,
    topVideos: state.postsReducer.topVideos,
    isLoading: state.RequestLoaders.isRequested,
    postViewHeight: state.postsReducer.postViewHeight,
    isViewCountUpdated: state.postsReducer.isViewCountUpdated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    likePostDispatch: (postId) => dispatch(likePost(postId)),
    savePost: (postId) => dispatch(savePost(postId)),
    reportPost: (postId, reason) => dispatch(reportPost(postId, reason)),
    unlikePostDispatch: (postId) => dispatch(unlikePost(postId)),
    updatePersonalPosts: (payload) =>
      dispatch({
        type: 'Get_Personal_Posts',
        payload: payload,
      }),
    UnsavePost: (postId) => dispatch(UnsavePost(postId)),
    addViewCountDispatch: (payload, index) =>
      dispatch(addViewCount(payload, index, 'called from profile post view screen')),
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

export default connect(mapStateToProps, mapDispatchToProps)(PostView);
