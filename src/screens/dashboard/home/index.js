import {
  Text,
  View,
  Image,
  FlatList,
  useWindowDimensions,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'native-base';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { styles } from './styled';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useScrollToTop } from '@react-navigation/native';
import testProps from 'locatorId';
//firebase
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
// import notifee from '@notifee/react-native';

//Redux
import { connect } from 'react-redux';
import {
  sharePost,
  getResharedPosts,
  getFeedPosts,
  addViewCount,
  likePost,
  unlikePost,
  UnsavePost,
  updateFeedPosts,
  reportPost,
  savePost,
} from '../../../../store/actions/posts';
import { Topheader, Statusbar, Postitem, ExportVideoModal } from '../../../components';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import { Color, FontFamily, itemVisibleThreshold } from 'constants';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import { ModalBtn } from '../../../components/modalpressabletxt';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { acceptTerms, getUserById } from '../../../../store/actions/user';
import Orientation from 'react-native-orientation-locker';
import { TermsModal } from '../../../components/termsModal';

const HomeScreen = (props) => {
  const { colors } = useTheme();
  const window = useWindowDimensions();
  let listRef = useRef(null);

  useScrollToTop(listRef);
  let playerRef = useRef(null);

  const {
    isLoading,
    unlikePostDispatch,
    likePostDispatch,
    postsData,
    getPostHeight,
    loggedInUser,
    savePost,
    currentLoggedInUser,
    reportPost,
    isMute,
    muteDispatch,
    UnsavePost,
    totalPages,
    updateFeedPostsDispatch,
    getFeedPosts,
    acceptTerms,
    addViewCountDispatch,
    sharePost,
    userAcceptTermsStatus,
    userAcceptTermsShowVideos,
    navigation,
    isViewCountUpdated,
    isVideoCountReset,
    notificationCount,
    updateNotificationCount,
    mediaUploadStatusDispatch,
  } = props;

  const [likedPost, likePost] = useState(false);
  const [focused, resetFocus] = useState(true);
  const [loadMore, setLoadMore] = useState(true);
  const [currentVisibleIndex, setCurentIndex] = useState(1);
  const [timer, setTimer] = useState(0);
  const [paused, playPause] = useState({ post: null, paused: false });
  const [isVisible, setIsVisible] = useState(false);
  const [reportConfirm, setconfirmReport] = useState('');
  const [reported, setReport] = useState(false);
  const [postIdReport, setPostId] = useState('');
  const [reportReason, setReason] = useState('');
  const [LoaderOpacity, setOpacity] = useState(0);
  const [posts, setPost] = useState([]);
  const [exporting, setExport] = useState(false);
  const [page, setPage] = useState(1);
  const notificationUpdatedCount = useRef(notificationCount);
  const [isVisibleTerms, setIsVisibleTerms] = useState(false);
  const [showVideos, setShowVideos] = useState(false);

  useEffect(() => {
    notificationUpdatedCount.current = notificationCount;
  }, [notificationCount]);

  useEffect(() => {
    setPost(postsData);
  }, [postsData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetFocus(false);
    });

    const unsubscribe1 = navigation.addListener('focus', () => {
      Orientation.lockToPortrait();
      getFeedPosts(1);
      resetFocus(true);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      getFeedPosts(1);
      if (remoteMessage) {
        let arr = ['2', '3', '4', '6', '12', '14', '15'];
        if (arr.includes(remoteMessage.data.notfication_type)) {
          navigation.push('CommentScreen', { postId: Number(remoteMessage.data.post_id) });
        } else if (remoteMessage.data.notfication_type == '1') {
          navigation.push('HomeScreen', {
            screen: 'HScreen',
            params: {
              screen: 'ViewAllLikedUsers',
              params: { postId: Number(remoteMessage.data.post_id) },
            },
          });
        } else if (remoteMessage.data.notfication_type == '7') {
          getUserById(Number(remoteMessage.data.follower_id))
            .then(({ data }) => {
              navigation.navigate('PublicProfileScreen', { publicProfile: data.data });
            })
            .catch((error) => {});
          navigation.navigate('PublicProfileScreen', { publicProfile: item.sender });
          // navigation.navigate('FavouriteScreen')
        } else if (remoteMessage.data.notfication_type == '11') {
          navigation.navigate('Profile', {
            screen: 'ProfileHome',
            params: { notificationType: 11 },
          });
        }
        // else if (remoteMessage.data.notfication_type == '13') {
        //   navigation.navigate('Profile', {
        //     screen: 'ProfileHome',
        //     params: { notificationType: 13 },
        //   });
        // }
        else if (remoteMessage.data.notfication_type == '8') {
          navigation.navigate('FollowersRequestScreen');
        } else if (
          remoteMessage.data.notfication_type == '13' ||
          remoteMessage.data.notfication_type == '16'
        ) {
          mediaUploadStatusDispatch({
            isRequested: false,
            isSuccess: false,
            isError: false,
            created_at: new Date(),
          });
          navigation.navigate('HomeScreen');
        }
        updateNotificationCount(notificationUpdatedCount.current + 1);
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        getFeedPosts(1);
        if (remoteMessage) {
          let arr = ['2', '3', '4', '6', '12', '14', '15'];
          if (arr.includes(remoteMessage.data.notfication_type)) {
            navigation.push('CommentScreen', { postId: remoteMessage.data.post_id });
          } else if (remoteMessage.data.notfication_type == '1') {
            navigation.push('HomeScreen', {
              screen: 'HScreen',
              params: {
                screen: 'ViewAllLikedUsers',
                params: { postId: Number(remoteMessage.data.post_id) },
              },
            });
          } else if (remoteMessage.data.notfication_type == '7') {
            getUserById(Number(remoteMessage.data.follower_id))
              .then(({ data }) => {
                navigation.navigate('PublicProfileScreen', { publicProfile: data.data });
              })
              .catch((error) => {});
            // navigation.navigate('FavouriteScreen')
          } else if (remoteMessage.data.notfication_type == '11') {
            navigation.navigate('Profile', {
              screen: 'ProfileHome',
              params: { notificationType: 11 },
            });
          }
          //  else if (remoteMessage.data.notfication_type == '13') {
          //   navigation.navigate('Profile', {
          //     screen: 'ProfileHome',
          //     params: { notificationType: 13 },
          //   });
          // }
          else if (remoteMessage.data.notfication_type == '8') {
            navigation.navigate('FollowersRequestScreen');
          } else if (
            remoteMessage.data.notfication_type == '13' ||
            remoteMessage.data.notfication_type == '16'
          ) {
            mediaUploadStatusDispatch({
              isRequested: false,
              isSuccess: false,
              isError: false,
              created_at: new Date(),
            });
            navigation.navigate('HomeScreen');
          }
          updateNotificationCount(notificationUpdatedCount.current + 1);
        }
      });

    const inAppNotiListener = messaging().onMessage(async (remoteMessage) => {
      console.log('inAppNotiListener ::::', remoteMessage);
      showMessage({
        onPress: () => {
          if (remoteMessage) {
            let arr = ['2', '3', '4', '6', '12', '14', '15'];
            if (arr.includes(remoteMessage.data.notfication_type)) {
              navigation.push('CommentScreen', { postId: Number(remoteMessage.data.post_id) });
            } else if (remoteMessage.data.notfication_type == '1') {
              navigation.push('HomeScreen', {
                screen: 'HScreen',
                params: {
                  screen: 'ViewAllLikedUsers',
                  params: { postId: Number(remoteMessage.data.post_id) },
                },
              });
            } else if (remoteMessage.data.notfication_type == '7') {
              getUserById(Number(remoteMessage.data.follower_id))
                .then(({ data }) => {
                  navigation.navigate('PublicProfileScreen', { publicProfile: data.data });
                })
                .catch((error) => {});
              navigation.navigate('PublicProfileScreen', { publicProfile: item.sender });
              // navigation.navigate('FavouriteScreen')
            } else if (remoteMessage.data.notfication_type == '11') {
              navigation.navigate('Profile', {
                screen: 'ProfileHome',
                params: { notificationType: 11 },
              });
            }
            // else if (remoteMessage.data.notfication_type == '13') {
            //   navigation.navigate('Profile', {
            //     screen: 'ProfileHome',
            //     params: { notificationType: 13 },
            //   });
            // }
            else if (remoteMessage.data.notfication_type == '8') {
              navigation.navigate('FollowersRequestScreen');
            } else if (remoteMessage.data.notfication_type == '13') {
              navigation.navigate('HomeScreen');
            }
            // updateNotificationCount(notificationUpdatedCount.current + 1);
          }
        },
        authToken: loggedInUser.token,
        message: remoteMessage.data.username,
        icon: remoteMessage.data.profile_pic ? remoteMessage.data.profile_pic : 'noProfilePic',
        description: remoteMessage.notification.body,
        type: 'success',
        duration: 5500,
        autoHide: true,
        titleStyle: { fontSize: 10, fontFamily: FontFamily.regular, color: Color.LightGrey3 },
        textStyle: {
          marginTop: -5,
          fontSize: 12,
          fontFamily: FontFamily.regular,
          color: colors.background == '#fff' ? '#1C1C1C' : '#B9B9B9',
        },
        style: {
          alignItems: 'center',
          backgroundColor: colors.background == '#fff' ? '#fff' : '#1C1C1C',
          paddingTop: 23,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,

          elevation: 6,
          paddingTop: 20,
        },
      });
      // showMessage({
      //     message: remoteMessage.notification.body,
      //     type: "success",
      //     autoHide: false,
      //     style: { alignItems: 'center', paddingTop: 40 }
      // });
      updateNotificationCount(notificationUpdatedCount.current + 1);
    });

    return () => {
      unsubscribe();
      unsubscribe1();
      inAppNotiListener();
    };
  }, []);

  useEffect(() => {
    if (!userAcceptTermsStatus) {
      setIsVisibleTerms(true);
    }
  }, [userAcceptTermsStatus]);

  const onBackClick = () => {
    setIsVisibleTerms(false);
  };

  const onAcceptTerms = () => {
    acceptTerms();
    setIsVisibleTerms(false);
  };

  useEffect(() => {
    if (isViewCountUpdated && isViewCountUpdated.isCountUpdated) {
      let tempData = postsData;
      let index = tempData.findIndex((elem) => elem.id == isViewCountUpdated.postId);
      if (index >= 0) {
        tempData[index].post = { ...tempData[index], view_count: ++tempData[index].view_count };
        updateFeedPostsDispatch([...tempData]);
        isVideoCountReset();
      }
      // tempData[isViewCountUpdated.postIndex] = { ...tempData[isViewCountUpdated.postIndex], view_count: ++tempData[isViewCountUpdated.postIndex].view_count }
      // updateFeedPostsDispatch([...tempData])
      // isVideoCountReset()
    }
  }, [isViewCountUpdated]);

  const onPostShare = (post) => {
    navigation.navigate('PostScreen', { uri: post.user_medias[0].media_file, post: post });
  };

  const postLike = (index, postId, type) => {
    let tempData = postsData;
    if (type == 'shared') {
      tempData[index].post = {
        ...tempData[index].post,
        isLiked: !tempData[index].post.isLiked,
        likes: tempData[index].post.likes + 1,
      };
      updateFeedPostsDispatch(tempData);
    } else {
      tempData[index] = {
        ...tempData[index],
        isLiked: !tempData[index].isLiked,
        likes: tempData[index].likes + 1,
      };
      updateFeedPostsDispatch(tempData);
    }
    likePostDispatch(postId);
    likePost(!likedPost);
  };

  const onPostSave = (index, postId, type) => {
    let tempData = postsData;
    if (type == 'shared') {
      tempData[index].post = {
        ...tempData[index].post,
        post_saved: !tempData[index].post.post_saved,
      };
      updateFeedPostsDispatch([...tempData]);
      likePost(!likedPost);
    } else {
      tempData[index] = { ...tempData[index], post_saved: !tempData[index].post_saved };
      updateFeedPostsDispatch([...tempData]);
      likePost(!likedPost);
    }
    savePost(postId);
  };

  const onUnsavePost = (index, postId, type) => {
    let tempData = postsData;
    if (type == 'shared') {
      tempData[index].post = {
        ...tempData[index].post,
        post_saved: !tempData[index].post.post_saved,
      };
      updateFeedPostsDispatch(tempData);
    } else {
      tempData[index] = { ...tempData[index], post_saved: !tempData[index].post_saved };
      updateFeedPostsDispatch(tempData);
    }
    UnsavePost(postId);
  };

  const updatePlayBack = (index, value, type) => {
    let tempData = postsData;
    if (type == 'onLoad') {
      playerRef.seek(postsData[index].currentTime);
      // tempData[index] = { ...tempData[index], duration: value }
      // updateFeedPostsDispatch(tempData)
      likePost(!likedPost);
    }
    if (type == 'onLoadShared') {
      playerRef.seek(postsData[index].post.currentTime);
      // tempData[index].post = { ...tempData[index].post, duration: value }
      // updateFeedPostsDispatch(tempData)
      likePost(!likedPost);
    }
    if (type == 'onProgress') {
      let tempData = postsData;
      tempData[index] = { ...tempData[index], currentTime: value };
      updateFeedPostsDispatch(tempData);
    }
  };

  const unlikePost = (index, postId, type) => {
    let tempData = postsData;
    if (type == 'shared') {
      tempData[index].post = {
        ...tempData[index].post,
        isLiked: !tempData[index].post.isLiked,
        likes: tempData[index].post.likes - 1,
      };
      updateFeedPostsDispatch(tempData);
    } else {
      tempData[index] = {
        ...tempData[index],
        isLiked: !tempData[index].isLiked,
        likes: tempData[index].likes - 1,
      };
      updateFeedPostsDispatch(tempData);
    }
    unlikePostDispatch(postId);
    likePost(!likedPost);
  };

  const playPauseMedia = (index, postId, type) => {
    let tempData = postsData;
    if (type == 'shared') {
      tempData[index].post = { ...tempData[index].post, paused: !tempData[index].post.paused };
      updateFeedPostsDispatch([...tempData]);
      likePost(!likedPost);
    } else {
      tempData[index] = { ...tempData[index], paused: !tempData[index].paused };
      updateFeedPostsDispatch([...tempData]);
      likePost(!likedPost);
    }
  };

  const muteUnmute = (index, type) => {
    let mute = isMute;
    muteDispatch(!mute);
    likePost(!likedPost);
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    if (viewableItems.length > 0) {
      setCurentIndex(viewableItems[0].index);
    }
  }, []);

  const navigateToProfile = (item) => {
    navigation.push('PublicProfileScreen', { publicProfile: item });
  };

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

  const onBuffer = ({ isBuffering }) => {
    setOpacity(isBuffering ? 1 : 0);
  };

  const _viewabilityConfig = {
    itemVisiblePercentThreshold: itemVisibleThreshold,
  };

  const renderItem = ({ item, index }) => {
    return (
      <Postitem
        origin={'Home'}
        calculateHeight={
          index == '0'
            ? (e) => {
                getPostHeight(e.nativeEvent.layout.height + 25);
              }
            : null
        }
        onSave={() => onPostSave(index, item.id)}
        onUnSave={() => onUnsavePost(index, item.id)}
        onReport={() => openReport(item.id)}
        onShare={() => onPostShare(item)}
        unlikePost={() => unlikePost(index, item.id)}
        // thumbnailPress={() => navigation.goBack()}
        postLike={() => postLike(index, item.id)}
        playPauseMedia={() => playPauseMedia(index)}
        thumbnailPress={() => navigateToProfile(item.user)}
        goToComments={() => navigation.push('CommentScreen', { post: item })}
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

  const onLayout = (e) => {
    getPostHeight(e.nativeEvent.layout.height + 25);
  };

  const _loadMore = () => {
    if (page < totalPages.totalPages) {
      getFeedPosts(page + 1);
      setPage(page + 1);
    }
    setLoadMore(false);
  };

  //currentIndex={colors.background == '#fff' ? currentVisibleIndex : 1 }

  const keyExtractor = (item) => `${item.created_at}`;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
      <View
        style={[
          styles.MainContainer,
          { backgroundColor: colors.background == '#fff' ? '#f2f2f7' : colors.background },
        ]}>
        <Statusbar />
        <View {...testProps('homeTitle')} style={{ overflow: 'hidden' }}>
          <Topheader
            currentIndex={1}
            origin={'home'}
            showChatIcon={false}
            onPressRight={() => navigation.navigate('ChatHome')}
          />
        </View>
        {userAcceptTermsShowVideos ? (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.background == '#fff' ? '#f2f2f7' : colors.background,
            }}>
            {exporting && <ExportVideoModal />}
            <FlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ marginTop: 6, paddingBottom: hp('6%') }}
              ref={listRef}
              data={postsData}
              refreshing={isLoading}
              onRefresh={() => getFeedPosts(1)}
              extraData={likedPost}
              keyExtractor={keyExtractor}
              windowSize={15}
              initialNumToRender={2}
              onEndReached={() => _loadMore()}
              onEndReachedThreshold={0.9}
              maxToRenderPerBatch={1}
              removeClippedSubviews={false}
              onViewableItemsChanged={_onViewableItemsChanged}
              viewabilityConfig={_viewabilityConfig}
              ListFooterComponent={
                <View>
                  {page > 1 && isLoading && (
                    <ActivityIndicator style={{ marginBottom: 10 }} size="small" color="#D3D3D3" />
                  )}
                </View>
              }
              renderItem={renderItem}
            />
          </View>
        ) : (
          <></>
        )}
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
                  {...testProps('homeReportText')}
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
                  {...testProps('homeReportText')}
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
                      {...testProps('homeReportBtnConform')}
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
                        {...testProps('homeReportBtnCancel')}
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
                        {...testProps('homeReportBtnOk')}
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
                  testProp={'homeReportBtnSpam'}
                  onPress={() => selectReason('Its spam')}
                  text={'Its spam'}
                />
                <ModalBtn
                  testProp={'homeReportBtnSexual'}
                  onPress={() => selectReason('Nudity or sexual activity')}
                  text={'Nudity or sexual activity'}
                />
                <ModalBtn
                  testProp={'homeReportBtnHateSpeech'}
                  onPress={() => selectReason('Hate speech or symbols')}
                  text={'Hate speach or symbols'}
                />
                <ModalBtn
                  testProp={'homeReportBtnIllegal'}
                  onPress={() => selectReason('Sale of illegal or regulated goods')}
                  text={'Sale of illegal or regulated products'}
                />
                <ModalBtn
                  testProp={'homeReportBtnBullying'}
                  onPress={() => selectReason('Bullying or harassment')}
                  text={'Bullying or harassment'}
                />
                <ModalBtn
                  testProp={'homeReportBtnViolation'}
                  onPress={() => selectReason('Intellectual property violation')}
                  text={'Intellectual property violation'}
                />
                <ModalBtn
                  testProp={'homeReportBtnSucide'}
                  onPress={() => selectReason('Suicide, self-injury or eating disorders')}
                  text={'Suicide, self-injury or eating disorders'}
                />
              </View>
            )}
          </View>
        </Modal>
      </View>

      <TermsModal
        isVisible={isVisibleTerms}
        onBackClick={onBackClick}
        onAcceptTerms={onAcceptTerms}
      />
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    isLoading: state.RequestLoaders.isRequested,
    postsData: state.postsReducer.posts,
    totalPages: state.postsReducer.homeFeedExtra,
    isMute: state.postsReducer.videoMute,
    currentLoggedInUser: state.user.user,
    loggedInUser: state.user.user,
    isViewCountUpdated: state.postsReducer.isViewCountUpdated,
    notificationCount: state.user.totalNotifications,
    userAcceptTermsStatus: state.user.userAcceptTerms,
    userAcceptTermsShowVideos: state.user.userAcceptTermsShowVideos,
    mediaUploadStatus: state.postsReducer.mediaUpload,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFeedPosts: (page) => dispatch(getFeedPosts(page)),
    likePostDispatch: (postId) => dispatch(likePost(postId)),
    unlikePostDispatch: (postId) => dispatch(unlikePost(postId)),
    updateFeedPostsDispatch: (payload) => dispatch(updateFeedPosts(payload)),
    addViewCountDispatch: (payload, index) => dispatch(addViewCount(payload, index)),
    savePost: (postId) => dispatch(savePost(postId)),
    acceptTerms: () => dispatch(acceptTerms()),
    reportPost: (postId, reason) => dispatch(reportPost(postId, reason)),
    sharePost: (post) => dispatch(sharePost(post)),
    // getResharedPosts: () => dispatch(getResharedPosts()),
    UnsavePost: (postId) => dispatch(UnsavePost(postId)),
    getPostHeight: (payload) =>
      dispatch({
        type: 'GET_POST_HEIGHT',
        payload: payload,
      }),
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
    updateNotificationCount: (count) =>
      dispatch({
        type: 'Notification_Count',
        payload: count,
      }),
    mediaUploadStatusDispatch: (payload) =>
      dispatch({
        type: 'Media_Upload_Status',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
