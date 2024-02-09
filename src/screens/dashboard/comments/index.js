import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  View,
  Text,
  Keyboard,
  FlatList,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Item, Thumbnail, Icon, Left, Body, ListItem } from 'native-base';
import styles from './styled';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import EmojiBoard from 'react-native-emoji-board';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

//Redux
import { connect } from 'react-redux';
import {
  commentOnPost,
  getCommentsOnPost,
  likeComment,
  updateReplies,
  updateComments,
  replyOnComment,
  getRepliesOnComment,
  likeReply,
  unlikeComment,
  unlikeReply,
  getSinglePost,
  savePost,
  UnsavePost,
  reportPost,
} from '../../../../store/actions/posts';
import { RFValue } from 'react-native-responsive-fontsize';
import { Topheader, Statusbar } from 'components';
import { Color, FontFamily, LogoMark } from 'constants';
import { useTheme } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { ModalBtn } from '../../../components/modalpressabletxt';
import { Button } from 'native-base';
import testProps from 'locatorId';
import { ConfirmationModal, ExportVideoModal, ProfileThumb, _RenderSuggestions } from 'components';
import {
  deletePost,
  updateFeedPosts,
  deleteComment,
  editComment,
} from '../../../../store/actions/posts';
import DeviceInfo from 'react-native-device-info';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import {
  replaceMentionValues,
  MentionInput,
} from '../../../edited-modules/react-native-controlled-mentions';
import TwitterTextView from '../../../edited-modules/react-native-twitter-textview';
import { RNFFmpeg } from 'react-native-ffmpeg';
import { fetchUser } from '../../../../store/actions/user';
import { updateSearchKeyword } from '../../../../store/actions/searh';

// import ReadMore from '@fawazahmed/react-native-read-more';
import ReadMore from 'react-native-read-more-text';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import IconV from 'react-native-vector-icons/MaterialIcons';
import { muteIcon, unmuteIcon, playIcon, noUserPlaceholder, badgeChecdVerified } from 'assets';
import { _stampMark } from '../../../../store/utils/videoProcessing';
import { Touch } from '../../../components/touch';

const CommentScreen = (props) => {
  function onFocus() {
    if (props.route.params?.postId) {
      props.getCommentsOnPost(props.route.params?.postId, 1);
      props.getSinglePostDispatch(props.route.params.postId);
    } else {
      props.getCommentsOnPost(props.route.params?.post.id, 1);
      props.singlePostDispatch(props.route.params?.post);
    }
  }
  useEffect(() => {
    props.navigation.addListener('focus', onFocus);
    return () => {
      props.navigation.removeListener('focus', onFocus);
    };
  }, []);
  return (
    <>
      <CommentScreens props={props} />
    </>
  );
};

const pattern = /(?<original>(?<trigger>.)\[(?<name>([^[]*))]\((?<id>([\d\w-]*))\))/gi;

const CommentScreens = (props) => {
  const {
    getSinglePostDispatch,
    getCommentsOnPost,
    postCommentDispatch,
    getRepliesOnCommentDispatch,
    updateReplies,
    updateOrientation,
    isMute,
    muteDispatch,
    likeReplyDispatch,
    updateCommentsDispatch,
    unlikeCommentDispatch,
    unlikeReplyDispatch,
    isLoading,
    commentStatus,
    replyOnCommentDispatch,
    comments,
    replies,
    likeCommentDispatch,
    route,
    navigation,
    singlePostDispatch,
    currentLoggedInUser,
    UnsavePost,
    savePost,
    reportPost,
    deletePost,
    updateFeedPostsDispatch,
    updateSavedVideosDispatch,
    postsData,
    savedVideos,
    updateTopVideosDispatch,
    updatePersonalPosts,
    personalPosts,
    topVideos,
    singlePost,
    editComment,
    deleteComment,
    updateSearchKeywordDispatch,
    totalPages,
  } = props.props;

  const { colors } = useTheme();
  let textInput = useRef(null);
  const [show, resetShow] = useState(false);
  const [comment, setComment] = useState('');
  const [commenting, setCommenting] = useState(true);
  const [commentid, setCommentReplyingTo] = useState(0);
  const [commentReRender, renderComment] = useState(false);
  const [replyReRender, renderReply] = useState(false);
  const [postData, setPostData] = useState(singlePost);

  const [post, setSinglePost] = useState(singlePost);

  const [isVisible, setIsVisible] = useState(false);
  const [isCommentDialogVisible, setIsCommentDialogVisible] = useState(false);
  const [reportConfirm, setconfirmReport] = useState('');
  const [reported, setReport] = useState(false);
  const [postIdReport, setPostId] = useState('');
  const [reportReason, setReason] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isCommentEdit, setIsCommentEdit] = useState(false);
  const [currentSelectedCommentId, setCurrentSelectedCommentId] = useState(null);
  const [currentSelectedCommentType, setCurrentSelectedCommentType] = useState('');
  const [exporting, setExport] = useState(false);
  const [isAudioToastVisible, setIsAudioToastVisible] = useState(false);
  const [paused, setPause] = useState(false);
  const [timer, setTimer] = useState(0);
  const [seekTimer, setSeek] = useState(0);
  const [icon, setIcon] = useState();
  const [focused, resetFocus] = useState(true);
  const [videoLoaded, setLoaded] = useState(false);
  let playerRef = useRef(null);
  const [mentions, setMentions] = useState([]);
  const [tagged, setTagged] = useState([]);
  const [previousMentions, setPrevious] = useState([]);
  const [isSuggestionsopened, setIsSuggestionsopened] = useState(false);
  const [page, setPage] = useState(2);
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      resetFocus(true);
      if (props.props.route.params.postId) {
        getSinglePostDispatch(props.props.route.params.postId);
      } else {
        getSinglePostDispatch(props.props.route.params.post.id);
      }

      if (replies.length > 0) {
        _hideAllReply();
      }
    });

    const unsubscribe2 = navigation.addListener('blur', () => {
      let temp = {};
      singlePostDispatch(temp);
      resetFocus(false);
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, []);

  useEffect(() => {
    if (comment === '') {
      setIsSuggestionsopened(false);
    }
  }, [comment]);

  useEffect(() => {
    IconV.getImageSource('stop-circle', 15, 'rgba(52, 52, 52, 1)').then(setIcon);
  }, []);

  useEffect(() => {
    if (commentStatus) {
      getCommentsOnPost(post.id, 1);
      _hideAllReply();
    }
  }, [commentStatus]);

  useEffect(() => {
    if (singlePost) {
      setSinglePost(singlePost);
      setPostData(singlePost);
    }
  }, [singlePost]);

  const openReport = (postId) => {
    setPostId(postId);
    setIsVisible(true);
  };

  const onDeletePost = () => {
    setShowModal(true);
  };

  const cancelDeletePost = () => {
    setShowModal(false);
  };

  const proceedDeletePost = () => {
    setShowModal(false);
    deletePost(post.id);
    const savedFilteredItems = savedVideos.filter(function (elem) {
      return elem.post.id !== post.id;
    });
    updateSavedVideosDispatch(savedFilteredItems);
    const postFilteredItems = postsData.filter(function (elem) {
      return elem.id !== post.id;
    });
    updateFeedPostsDispatch(postFilteredItems);
    const personalFilteredItems = personalPosts.filter(function (elem) {
      return elem.id !== post.id;
    });
    updatePersonalPosts(personalFilteredItems);
    const topFilteredItems = topVideos.filter(function (elem) {
      return elem.id !== post.id;
    });
    updateTopVideosDispatch(topFilteredItems);
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };

  const onDeleteComment = (commentId, type) => {
    setCurrentSelectedCommentId(commentId);
    setCurrentSelectedCommentType(type);
    setIsCommentDialogVisible(true);
  };

  const cancelDeleteComment = () => {
    setIsCommentDialogVisible(false);
  };

  const proceedDeleteComment = () => {
    setIsCommentDialogVisible(false);
    deleteComment(currentSelectedCommentId, currentSelectedCommentType);
  };

  const selectReason = (reason) => {
    setconfirmReport(reason);
    setReason(reason);
  };

  const onPostShare = (post) => {
    navigation.navigate('PostScreen', { uri: post.user_medias[0].media_file, post: post });
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

  const arr_diff = (arr1, arr2) => {
    let res = [];
    res = arr1.filter((el) => {
      return !arr2.find((obj) => {
        return el === obj;
      });
    });
    return res;
  };

  const _addComment = () => {
    var usersTagged = comment.match(pattern);
    let mentionList = [];
    if (usersTagged) {
      usersTagged.forEach((item, index) => {
        mentionList.push(Number(replaceMentionValues(item, ({ id }) => `${id}`)));
      });
    }
    let removed_users = [];
    removed_users = previousMentions.length > 0 ? arr_diff(previousMentions, mentionList) : [];
    removed_users = removed_users.map((elem) => Number(elem));

    if (commenting && commenting === true) {
      if (isCommentEdit) {
        Keyboard.dismiss();
        editComment(
          {
            comment_id: currentSelectedCommentId,
            comment,
            mentioned_user_list: mentionList,
            remove_mentioned_user_list: removed_users,
          },
          'edit-comment',
        );
        setComment('');
        setCommenting(false);
        setIsCommentEdit(false);
      } else {
        Keyboard.dismiss();
        postCommentDispatch(post.id, comment, mentionList);
        setComment('');
        setCommenting(true);
        // setTimeout(()=> { getCommentsOnPost(post.id) }, 2000)
      }
    } else {
      Keyboard.dismiss();
      setCommenting(false);
      if (isCommentEdit) {
        editComment(
          { comment_reply_id: currentSelectedCommentId, comment, mentioned_user_list: mentionList },
          'comment-reply',
        );
        setIsCommentEdit(false);
      } else {
        replyOnCommentDispatch(commentid, comment, mentionList);
      }
      setComment('');
    }
  };

  const _getReplies = (commentId, index) => {
    getRepliesOnCommentDispatch(commentId, index);
  };

  const _likeComment = (comentId, index) => {
    let tempData = comments;
    tempData[index] = {
      ...tempData[index],
      isLiked: !tempData[index].isLiked,
      likes: tempData[index].likes + 1,
    };
    renderComment(!commentReRender);
    updateCommentsDispatch(tempData);
    likeCommentDispatch(comentId);
  };

  const _unlikeComment = (commentId, index) => {
    let tempData = comments;
    tempData[index] = {
      ...tempData[index],
      isLiked: !tempData[index].isLiked,
      likes: tempData[index].likes - 1,
    };
    renderComment(!commentReRender);
    updateCommentsDispatch(tempData);
    unlikeCommentDispatch(commentId);
  };

  const replyLike = (replyId, index) => {
    let tempData = replies[0].repliesData;
    tempData[index] = {
      ...tempData[index],
      isLiked: !tempData[index].isLiked,
      likes: tempData[index].likes + 1,
    };
    renderReply(!replyReRender);
    likeReplyDispatch(replyId);
  };

  const _unlikeReply = (replyId, index) => {
    let tempData = replies[0].repliesData;
    tempData[index] = {
      ...tempData[index],
      isLiked: !tempData[index].isLiked,
      likes: tempData[index].likes - 1,
    };
    renderReply(!replyReRender);
    unlikeReplyDispatch(replyId);
  };

  const emojiSelect = (emoji) => {
    resetShow(!show);
    setComment(comment + emoji.code);
    textInput.focus();
  };

  const replyToComment = (commentId) => {
    textInput.focus();
    setCommentReplyingTo(commentId);
    // getCommentsOnPost(post.id)
    renderReply(!replyReRender);
    setCommenting(false);
  };

  const onEditComment = (item, type) => {
    if (item?.comment || item?.reply) {
      setPrevious([]);
      let usersTagged =
        type == 'comment-reply' ? item?.reply.match(pattern) : item?.comment.match(pattern);
      let mentionedUsers = [];
      if (usersTagged) {
        usersTagged.forEach((item, index) => {
          mentionedUsers.push(Number(replaceMentionValues(item, ({ id }) => `${id}`)));
        });
        setPrevious(mentionedUsers);
      }
    }

    textInput.focus();
    if (type == 'comment-reply') {
      setComment(item.reply);
      setCommenting(false);
    } else {
      setCommenting(true);
      setComment(item.comment);
    }

    setIsCommentEdit(true);
    renderReply(!replyReRender);
    setCurrentSelectedCommentId(item.id);
  };

  const onCommentText = (comment) => {
    setComment(comment);
  };
  const navigateToProfile = (item) => {
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
  };

  const _hideReply = () => {
    let tempData = replies;
    tempData[0] = { ...tempData[0], isInvisible: !tempData[0].isInvisible };
    updateReplies(tempData);
    renderReply(!replyReRender);
  };

  const _hideAllReply = () => {
    let tempData = replies;
    tempData[0] = { ...tempData[0], isInvisible: false };
    updateReplies(tempData);
    renderReply(!replyReRender);
  };

  const onPostSave = () => {
    let tempData = post;
    tempData = { ...tempData, post_saved: true };
    setPostData(tempData);
    savePost(post.id);
  };
  const onUnsavePost = () => {
    let tempData = post;
    tempData = { ...tempData, post_saved: false };
    setPostData(tempData);
    UnsavePost(post.id);
    if (route.params.origin && route.params.origin == 'saved') {
      navigation.goBack();
    }
  };

  const _onShare = async (uri) => {
    setExport(false);
    Share.open({
      url: uri,
    });
  };

  const exportShare = (uri) => {
    setExport(true);
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp4',
    })
      .fetch('GET', uri, {
        Authorization: `jwt ${currentLoggedInUser.token}`,
      })
      .then((res) => {
        let status = res.info().status;
        //_stampMark(`file://${res.path()}`);
        _stampMark(`file://${res.path()}`, (response) => {
          if (response[0] === 0) {
            _onShare(response[1]);
          } else {
            setExport(false);
          }
        });
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        setExport(false);
        // error handling
      });
  };

  const getUser = (username) => {
    let deepCopy = username.trim();
    fetchUser(deepCopy).then(({ data }) => {
      if (data.data.id === currentLoggedInUser.id)
        navigation.navigate('Profile', {
          screen: 'ProfileHome',
        });
      else
        navigation.push('HomeScreen', {
          screen: 'HScreen',
          params: {
            screen: 'PublicProfileScreen',
            params: {
              publicProfile: data.data,
            },
          },
        });
      // navigation.navigate("PublicProfileScreen",  {publicProfile: data.data});
    });
  };

  const showNoAudioToast = () => {
    setIsAudioToastVisible(true);
    setTimeout((elem) => {
      setIsAudioToastVisible(false);
    }, 1000);
  };

  const _renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{
          color: colors.background == '#fff' ? Color.DarkGrey : Color.LightGreySeeMore,
          fontSize: 12,
          marginTop: 0,
        }}
        onPress={handlePress}>
        more
      </Text>
    );
  };

  const _renderRevealedFooter = (handlePress) => {
    return (
      <Text
        style={{
          color: colors.background == '#fff' ? Color.DarkGrey : Color.LightGreySeeMore,
          fontSize: 12,
          marginTop: 0,
        }}
        onPress={handlePress}>
        see less
      </Text>
    );
  };

  const _tagPeople = (user) => {
    let temp = tagged;
    temp.push(user);
    setTagged(temp);
  };

  const renderMentionSuggestions = _RenderSuggestions(
    mentions,
    (returnMentions) => {
      setMentions(returnMentions);
    },
    (returnTagged) => {
      _tagPeople(returnTagged);
    },
    'top',
    setIsSuggestionsopened,
  );

  const seekVideo = (value) => {
    setSeek(value);
    playerRef.seek(value);
    setPause(false);
  };

  const _enableFullScreen = (item) => {
    updateOrientation('landscape');
    navigation.navigate('FullScreen', { videoUrl: item?.user_medias[0]?.url });
    return;
  };

  if (post?.user_medias && post?.user_medias[0]?.duration) {
    var minutes = post.user_medias[0].duration / 1000 / 60;
    var r = minutes % 1;
    var sec = Math.floor(r * 60);
    if (sec < 10) {
      sec = '0' + sec;
    }
    minutes = Math.floor(minutes);
  }

  const _conditionalHeader = (userMedias) => {
    if (userMedias?.url != '') {
      return { uri: userMedias.url };
    } else {
      return {
        uri: userMedias.media_file,
        headers: {
          Authorization: `jwt ${currentLoggedInUser.token}`,
        },
      };
    }
  };

  const _loadMore = () => {
    console.log(page, totalPages);
    if (page <= totalPages.totalPages) {
      getCommentsOnPost(post.id, page);
      setPage(page + 1);
    }
    setLoadMore(false);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.card }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Statusbar />
        {exporting && <ExportVideoModal />}
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
              opacity: 0.9,
            }}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        )}
        {!show && (
          <View style={{ overflow: 'hidden', paddingBottom: 0 }}>
            <Topheader
              origin={'comments'}
              showChatIcon={false}
              onPressLeft={() => navigation.goBack()}
              onPressRight={() => navigation.navigate('ChatHome')}
            />
          </View>
        )}
        <TouchableWithoutFeedback
          onPress={() => {
            resetShow(false);
            isSuggestionsopened ? {} : Keyboard.dismiss();
          }}>
          <View style={{ width: wp('100%'), marginTop: -15, aspectRatio: 4 / 2 }}>
            {focused && post?.user_medias?.length > 0 && (
              <Video
                source={_conditionalHeader(post?.user_medias[0])}
                muted={isMute}
                preventsDisplaySleepDuringVideoPlayback={false}
                paused={paused}
                poster={
                  !post?.user_medias?.length || post?.user_medias[0]?.thumbnail == null
                    ? 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                    : post?.user_medias[0].thumbnail
                }
                posterResizeMode={'contain'}
                ref={(ref) => {
                  playerRef = ref;
                }}
                // onLoadStart={(elem) => {
                //   addViewCountDispatch(post.id, index)
                // }}
                // onEnd={(elem) => {
                //   addViewCountDispatch(post.id, index)
                // }}
                onLoad={(video) => {
                  //updatePlayBack(index, video.duration)
                }}
                onProgress={(e) => {
                  if (!videoLoaded) {
                    setLoaded(true);
                  }
                  setTimer(parseInt(e.currentTime));
                  setSeek(e.currentTime);
                }}
                resizeMode={'contain'}
                repeat={true}
                style={styles.videoPlayer}
                {...testProps('commentVideoPlayer')}
              />
            )}

            <View style={[styles.postOverlay, { zIndex: 10 }]}>
              {paused == true ? (
                <Pressable
                  style={{ justifyContent: 'center', flex: 1 }}
                  onPress={() => setPause(false)}>
                  <Image
                    {...testProps('commentVideoPlayerPlayImg')}
                    source={playIcon}
                    style={{
                      margin: wp('90%'),
                      width: RFValue(50),
                      height: RFValue(50),
                      resizeMode: 'contain',
                    }}
                  />
                </Pressable>
              ) : (
                <Pressable
                  style={{ justifyContent: 'center', flex: 1 }}
                  onPress={() => setPause(true)}>
                  <View style={{ margin: wp('90%'), width: wp('78%'), height: hp('27%') }}></View>
                </Pressable>
              )}
              {paused == true ? (
                <Text
                  {...testProps('commentVideoPlayerTimerPaused')}
                  style={{
                    position: 'absolute',
                    borderRadius: RFValue(8),
                    backgroundColor: 'rgba(52, 52, 52, 0.8)',
                    padding: 7,
                    top: RFValue(8),
                    right: 5,
                    color: 'white',
                  }}>
                  {('0' + Math.floor(minutes)).slice(-2)}:{('0' + Math.floor(sec)).slice(-2)}
                </Text>
              ) : (
                <Text
                  {...testProps('commentVideoPlayerTimer')}
                  style={{
                    position: 'absolute',
                    borderRadius: RFValue(8),
                    backgroundColor: 'rgba(52, 52, 52, 0.8)',
                    padding: 7,
                    top: RFValue(8),
                    right: 5,
                    color: 'white',
                  }}>
                  {('0' + Math.floor(minutes)).slice(-2)}:{timer > 9 ? timer : '0' + timer}
                </Text>
              )}
            </View>
            <Icon
              onPress={() => _enableFullScreen(post)}
              name="fullscreen"
              type="MaterialIcons"
              style={{
                zIndex: 10,
                position: 'absolute',
                top: RFValue(7),
                left: 5,
                fontSize: RFValue(20),
                color: '#fff',
              }}
            />
            {post?.user_medias && (
              <View
                style={{
                  paddingHorizontal: 15,
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  zIndex: 100,
                }}>
                {paused ? (
                  <Icon
                    onPress={() => (isSuggestionsopened ? {} : setPause(false))}
                    name="play"
                    type="Foundation"
                    style={{ fontSize: RFValue(20), color: '#fff' }}
                  />
                ) : (
                  <Icon
                    onPress={() => (isSuggestionsopened ? {} : setPause(true))}
                    name="pause"
                    type="Foundation"
                    style={{ fontSize: RFValue(20), color: '#fff' }}
                  />
                )}
                <Slider
                  {...testProps('commentVideoPlayerBottomSlider')}
                  style={{ width: '80%', marginRight: 18 }}
                  minimumValue={0}
                  value={seekTimer}
                  // step={1}
                  tapToSeek={true}
                  useNativeDriver={true}
                  //onValueChange={value => seekVideo(value)}
                  onSlidingStart={() => setPause(true)}
                  onSlidingComplete={(value) => seekVideo(value)}
                  maximumValue={post?.user_medias[0]?.duration / 1000}
                  minimumTrackTintColor="rgba(52, 52, 52, 1)"
                  maximumTrackTintColor="#d3d3d3"
                  //thumbTintColor='rgba(52, 52, 52, 1)'
                  thumbImage={icon}
                  thumbStyle={{ height: 5, width: 5, borderRadius: 100 }}
                />
                <Pressable
                  onPress={() =>
                    isSuggestionsopened
                      ? {}
                      : post?.user_medias[0]?.has_audio
                      ? muteDispatch(!isMute)
                      : showNoAudioToast()
                  }>
                  {!post?.user_medias[0]?.has_audio ? (
                    <Image
                      {...testProps('commentVideoPlayerAudioBtnMute')}
                      source={muteIcon}
                      style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }}
                    />
                  ) : (
                    <Image
                      {...testProps('commentVideoPlayerAudioBtn')}
                      source={isMute ? muteIcon : unmuteIcon}
                      style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }}
                    />
                  )}
                </Pressable>
              </View>
            )}
            {isAudioToastVisible && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  backgroundColor: '#1C1C1C',
                  flexGrow: 1,
                  width: '100%',
                  height: 50,
                  zIndex: 200,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  alignContent: 'center',
                  flexWrap: 'wrap',
                  opacity: 0.8,
                }}>
                <Text
                  {...testProps('commentVideoPlayerToast')}
                  style={{ color: '#fff', fontFamily: FontFamily.medium }}>
                  No Video Sound
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => {
            resetShow(false);
            isSuggestionsopened ? {} : Keyboard.dismiss();
          }}>
          <View
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor:
                colors.background == '#fff' ? Color.LightGrey2 : Color.darkTheme.borderGrey,
              paddingVertical: 20,
              width: '100%',
            }}>
            <View style={{ paddingLeft: 15 }}>
              {post?.user?.profile_pic ? (
                <Touch onPress={() => (isSuggestionsopened ? {} : navigateToProfile(post?.user))}>
                  <ProfileThumb
                    testProp={'cemmentPostUserThumbImg'}
                    profilePic={post?.user?.profile_pic}
                  />
                </Touch>
              ) : (
                <Pressable
                  onPress={() => (isSuggestionsopened ? {} : navigateToProfile(post?.user))}>
                  <Thumbnail source={noUserPlaceholder} />
                </Pressable>
              )}
            </View>
            <View
              style={{
                marginLeft: 10,
                justifyContent: 'center',
                width: '70%',
                overflow: 'hidden',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'orange',
                  alignContent: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  height: 20,
                }}>
                <Pressable
                  onPress={() => (isSuggestionsopened ? {} : navigateToProfile(post?.user))}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Text
                      {...testProps('cemmentPostUserName')}
                      style={{
                        marginBottom: 2,
                        color: colors.heading,
                        fontSize: RFValue(10),
                        fontFamily: FontFamily.regular,
                      }}>
                      {' '}
                      {post?.user?.name && post?.user?.name !== ' '
                        ? `${post?.user?.first_name} ${post?.user?.last_name}`
                        : post?.user?.username}
                    </Text>
                    {post?.user?.is_account_verified && (
                      <Image
                        {...testProps('')}
                        source={badgeChecdVerified}
                        style={{
                          width: RFValue(12),
                          height: RFValue(12),
                          marginLeft: 5,
                          marginRight: 5,
                          marginTop: 0,
                        }}
                        resizeMode={'contain'}
                      />
                    )}
                  </View>
                </Pressable>
                <Text
                  {...testProps('cemmentPostUserName')}
                  style={{
                    color: colors.heading,
                    fontSize: 20,
                    fontFamily: FontFamily.regular,
                    marginTop: Platform.OS == 'ios' ? -4 : -6,
                    marginHorizontal: 4,
                  }}>
                  &#183;
                </Text>
                <Text
                  {...testProps('cemmentPostName')}
                  style={{
                    marginBottom: 5,
                    color: colors.heading,
                    fontSize: RFValue(10),
                    fontFamily: FontFamily.regular,
                  }}>
                  {moment(post?.created_at).fromNow()}{' '}
                </Text>
              </View>

              {focused && (
                <ReadMore
                  numberOfLines={2}
                  renderTruncatedFooter={_renderTruncatedFooter}
                  renderRevealedFooter={_renderRevealedFooter}>
                  <TwitterTextView
                    onPressMention={(e, hashtag) =>
                      isSuggestionsopened ? {} : getUser(hashtag.replace('@', ''))
                    }
                    onPressHashtag={(e, hashtag) => {
                      updateSearchKeywordDispatch(hashtag.trim());
                      isSuggestionsopened
                        ? {}
                        : navigation.navigate('SearchScreen', {
                            screen: 'search',
                            params: {
                              screen: 'Videos',
                            },
                          });
                    }}
                    style={[
                      styles.description,
                      {
                        textAlign: 'left',
                        color: colors.background == '#fff' ? Color.DarkGrey : colors.text,
                        fontSize: 12,
                        fontFamily: FontFamily.regular,
                      },
                    ]}
                    mentionStyle={{ color: Color.Blue, fontSize: 13 }}
                    hashtagStyle={{ color: Color.Blue, fontSize: 13 }}>
                    {post?.description &&
                      replaceMentionValues(`${post.description}`, ({ username }) => `@${username}`)}
                  </TwitterTextView>
                </ReadMore>
              )}
            </View>
            <View>
              <Menu>
                <MenuTrigger
                  customStyles={{
                    triggerTouchable: {
                      underlayColor: 'none',
                      activeOpacity: 70,
                    },
                  }}>
                  <View style={{ alignItems: 'center' }}>
                    <Icon
                      type="Entypo"
                      name="dots-three-vertical"
                      style={{
                        fontSize: 16,
                        color: colors.text,
                        paddingHorizontal: 10,
                        height: 30,
                        paddingTop: 5,
                      }}
                    />
                  </View>
                </MenuTrigger>
                <MenuOptions
                  optionsContainerStyle={{
                    marginTop: RFValue(25),
                    width: RFValue(130),
                    marginLeft: -15,
                    paddingVertical: 10,
                    backgroundColor: colors.card,
                  }}>
                  <MenuOption
                    style={{ marginVertical: RFValue(5) }}
                    onSelect={() => (postData.post_saved ? onUnsavePost() : onPostSave())}>
                    <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                      {postData.post_saved ? 'Unsave' : 'Save'}
                    </Text>
                  </MenuOption>
                  {post.allow_sharing && (
                    <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => exportShare(post.user_medias[0].media_file)}>
                      <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Share</Text>
                    </MenuOption>
                  )}
                  {currentLoggedInUser.id === post?.user?.id ? (
                    <View>
                      <MenuOption
                        style={{ marginVertical: RFValue(5) }}
                        onSelect={() =>
                          navigation.navigate('EditPostScreen', {
                            uri: post.user_medias[0].media_file,
                            post: post,
                          })
                        }>
                        <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Edit</Text>
                      </MenuOption>
                      <MenuOption
                        style={{ marginVertical: RFValue(5) }}
                        onSelect={() => onDeletePost()}>
                        <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Delete</Text>
                      </MenuOption>
                    </View>
                  ) : (
                    <></>
                  )}
                  {currentLoggedInUser.id !== post?.user?.id ? (
                    <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => openReport(post.id)}>
                      <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Report</Text>
                    </MenuOption>
                  ) : (
                    <></>
                  )}
                </MenuOptions>
              </Menu>
            </View>
          </View>
        </TouchableWithoutFeedback>

        {comments &&
        comments.length > 0 &&
        comments[0].post == (route.params?.postId ? route.params.postId : route.params.post.id) ? (
          <TouchableWithoutFeedback
            onPress={() => {
              resetShow(false);
              isSuggestionsopened ? {} : Keyboard.dismiss();
            }}>
            <FlatList
              style={{ flex: 0.7 }}
              showsVerticalScrollIndicator={false}
              data={comments}
              extraData={commentReRender}
              onEndReached={() => _loadMore()}
              onEndReachedThreshold={0.9}
              x
              keyExtractor={(item) => item.id + ' '}
              windowSize={15}
              initialNumToRender={5}
              onEndReachedThreshold={0.5}
              keyboardShouldPersistTaps={isSuggestionsopened ? 'handled' : 'never'}
              // keyboardDismissMode={'on-drag'}
              renderItem={({ item, index }) => (
                <ListItem style={{ marginTop: 10 }} avatar>
                  <Left style={{ paddingTop: 5 }}>
                    <Touch
                      onPress={() => {
                        isSuggestionsopened ? {} : navigateToProfile(item.user);
                      }}>
                      {item.user.profile_pic ? (
                        <ProfileThumb
                          testProp={'cemmentUserThumbImg'}
                          profilePic={item.user.profile_pic}
                          style={{ width: 40, height: 40 }}
                        />
                      ) : (
                        <Thumbnail style={{ width: 40, height: 40 }} source={noUserPlaceholder} />
                      )}
                    </Touch>
                  </Left>
                  <Body style={{ marginHorizontal: RFValue(7), paddingTop: 5 }}>
                    <Pressable
                      onPress={() => (isSuggestionsopened ? {} : navigateToProfile(item?.user))}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: RFValue(10),
                            color: colors.heading,
                            fontFamily: FontFamily.regular,
                          }}>
                          {item.user.name && item.user.name !== ' '
                            ? `${item.user.first_name} ${item.user.last_name}`
                            : item.user.username}
                        </Text>
                        {item.user.is_account_verified && (
                          <Image
                            {...testProps('')}
                            source={badgeChecdVerified}
                            style={{
                              width: RFValue(12),
                              height: RFValue(12),
                              marginLeft: 5,
                              marginRight: 5,
                              marginTop: 0,
                            }}
                            resizeMode={'contain'}
                          />
                        )}
                      </View>
                    </Pressable>
                    <ReadMore
                      numberOfLines={2}
                      renderTruncatedFooter={_renderTruncatedFooter}
                      renderRevealedFooter={_renderRevealedFooter}>
                      <TwitterTextView
                        onPressMention={(e, hashtag) =>
                          isSuggestionsopened ? {} : getUser(hashtag.replace('@', ''))
                        }
                        onPressHashtag={(e, hashtag) => {
                          updateSearchKeywordDispatch(hashtag.trim());

                          isSuggestionsopened
                            ? {}
                            : navigation.navigate('SearchScreen', {
                                screen: 'search',
                                params: {
                                  screen: 'Videos',
                                },
                              });
                        }}
                        style={[
                          styles.description,
                          {
                            color: colors.background == '#fff' ? Color.DarkGrey : colors.text,
                            fontSize: 12,
                            fontFamily: FontFamily.regular,
                          },
                        ]}
                        mentionStyle={{ color: Color.Blue, fontSize: 13 }}
                        hashtagStyle={{ color: Color.Blue, fontSize: 13 }}>
                        {replaceMentionValues(`${item.comment}`, ({ username }) => `@${username}`)}
                      </TwitterTextView>
                    </ReadMore>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        height: 30,
                      }}>
                      <Text
                        style={{
                          color: colors.heading,
                          fontSize: RFValue(10),
                          fontFamily: FontFamily.regular,
                        }}>
                        {moment(item.created_at).fromNow()}
                      </Text>

                      <Text
                        style={{
                          marginHorizontal: 5,
                          fontSize: 20,
                          marginTop: Platform.OS == 'ios' ? -6 : -6,
                          color: colors.heading,
                        }}>
                        &#183;
                      </Text>

                      <Touch
                        onPress={() =>
                          isSuggestionsopened
                            ? {}
                            : !item.isLiked
                            ? _likeComment(item.id, index)
                            : _unlikeComment(item.id, index)
                        }>
                        <Text
                          style={{
                            color: item.isLiked ? Color.Orange : colors.heading,
                            fontSize: RFValue(10),
                            fontFamily: FontFamily.regular,
                          }}>
                          {item.likes} {item.likes > 1 ? 'Likes' : 'Like'}
                        </Text>
                      </Touch>

                      <Text
                        style={{
                          marginHorizontal: 5,
                          fontSize: 20,
                          marginTop: Platform.OS == 'ios' ? -6 : -6,
                          color: colors.heading,
                        }}>
                        &#183;
                      </Text>

                      <Touch
                        onPress={() => {
                          isSuggestionsopened ? {} : replyToComment(item.id);
                        }}>
                        <Text
                          style={{
                            color: colors.heading,
                            fontSize: RFValue(10),
                            fontFamily: FontFamily.regular,
                          }}>
                          {item.replies} Reply
                        </Text>
                      </Touch>

                      {currentLoggedInUser.id == item.user.id && (
                        <View style={{ flexDirection: 'row', marginTop: 0.5 }}>
                          <Text
                            style={{
                              marginHorizontal: 5,
                              fontSize: 20,
                              marginTop: Platform.OS == 'ios' ? -6 : -6,
                              color: colors.heading,
                            }}>
                            &#183;
                          </Text>

                          <Touch
                            onPress={() => {
                              isSuggestionsopened ? {} : onEditComment(item, 'comment');
                            }}>
                            <Text
                              style={{
                                color: colors.heading,
                                fontSize: RFValue(10),
                                fontFamily: FontFamily.regular,
                              }}>
                              Edit
                            </Text>
                          </Touch>

                          <Text
                            style={{
                              marginHorizontal: 5,
                              fontSize: 20,
                              marginTop: Platform.OS == 'ios' ? -6 : -6,
                              color: colors.heading,
                            }}>
                            &#183;
                          </Text>

                          <Touch
                            onPress={() => {
                              isSuggestionsopened ? {} : onDeleteComment(item.id, 'comment');
                            }}>
                            <Text
                              style={{
                                color: colors.heading,
                                fontSize: RFValue(10),
                                fontFamily: FontFamily.regular,
                              }}>
                              Delete
                            </Text>
                          </Touch>
                        </View>
                      )}
                      {currentLoggedInUser.id == post?.user?.id &&
                        currentLoggedInUser.id !== item.user.id && (
                          <View style={{ flexDirection: 'row', marginTop: 0.5 }}>
                            <Text
                              style={{
                                marginHorizontal: 5,
                                fontSize: 20,
                                marginTop: Platform.OS == 'ios' ? -6 : -6,
                                color: colors.heading,
                              }}>
                              &#183;
                            </Text>
                            <Touch
                              onPress={() =>
                                isSuggestionsopened ? {} : onDeleteComment(item.id, 'comment')
                              }>
                              <Text
                                style={{
                                  color: colors.heading,
                                  fontSize: RFValue(10),
                                  fontFamily: FontFamily.regular,
                                }}>
                                Delete
                              </Text>
                            </Touch>
                          </View>
                        )}
                    </View>
                    <View>
                      {item.replies > 0 && (
                        <Touch
                          onPress={() => {
                            isSuggestionsopened
                              ? {}
                              : !replies[0]?.isInvisible
                              ? _getReplies(item.id, item.id)
                              : _hideReply();
                          }}>
                          <Text style={{ color: colors.heading, fontSize: 12 }}>
                            {replies[0]?.id == item.id
                              ? !replies[0]?.isInvisible
                                ? `View Replies `
                                : `Hide Replies`
                              : `View Replies`}{' '}
                            {item.replies}
                          </Text>
                        </Touch>
                      )}
                      {replies.length > 0 &&
                        replies[0].id == item.id &&
                        replies[0].isInvisible &&
                        replies.map((data) => {
                          if (data.id == item.id) {
                            return data.repliesData.map((prop, key) => {
                              return (
                                <ListItem style={{ marginLeft: 0 }} avatar>
                                  <Left>
                                    <Touch
                                      onPress={() =>
                                        isSuggestionsopened ? {} : navigateToProfile(prop.user)
                                      }>
                                      {prop.user.profile_pic ? (
                                        <ProfileThumb
                                          testProp={'cemmentReplyUserThumbImg'}
                                          profilePic={prop.user.profile_pic}
                                          style={{ height: 30, width: 30 }}
                                        />
                                      ) : (
                                        <Thumbnail
                                          style={{ height: 30, width: 30 }}
                                          source={noUserPlaceholder}
                                        />
                                      )}
                                    </Touch>
                                  </Left>
                                  <Body style={{ borderBottomWidth: 0, marginLeft: RFValue(4) }}>
                                    <Pressable
                                      onPress={() =>
                                        isSuggestionsopened ? {} : navigateToProfile(prop.user)
                                      }>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        }}>
                                        <Text
                                          style={{
                                            fontSize: RFValue(10),
                                            color: colors.heading,
                                            fontFamily: FontFamily.regular,
                                          }}>
                                          {prop.user.name && prop.user.name !== ' '
                                            ? `${prop.user.first_name} ${prop.user.last_name}`
                                            : prop.user.username}
                                        </Text>
                                        {prop.user.is_account_verified && (
                                          <Image
                                            {...testProps('userPorfileVerifiedIcon')}
                                            source={badgeChecdVerified}
                                            style={{
                                              width: RFValue(12),
                                              height: RFValue(12),
                                              marginLeft: 5,
                                              marginRight: 5,
                                              marginTop: 0,
                                            }}
                                            resizeMode={'contain'}
                                          />
                                        )}
                                      </View>
                                    </Pressable>
                                    {!isLoading && (
                                      <ReadMore
                                        numberOfLines={2}
                                        renderTruncatedFooter={_renderTruncatedFooter}
                                        renderRevealedFooter={_renderRevealedFooter}>
                                        <TwitterTextView
                                          onPressMention={(e, hashtag) =>
                                            isSuggestionsopened
                                              ? {}
                                              : getUser(hashtag.replace('@', ''))
                                          }
                                          onPressHashtag={(e, hashtag) => {
                                            updateSearchKeywordDispatch(hashtag.trim());
                                            isSuggestionsopened
                                              ? {}
                                              : navigation.navigate('SearchScreen', {
                                                  screen: 'search',
                                                  params: {
                                                    screen: 'Videos',
                                                  },
                                                });
                                          }}
                                          style={[
                                            styles.description,
                                            {
                                              color:
                                                colors.background == '#fff'
                                                  ? Color.DarkGrey
                                                  : colors.text,
                                              fontSize: 12,
                                              fontFamily: FontFamily.regular,
                                            },
                                          ]}
                                          mentionStyle={{ color: Color.Blue, fontSize: 13 }}
                                          hashtagStyle={{ color: Color.Blue, fontSize: 13 }}>
                                          {replaceMentionValues(
                                            `${prop.reply}`,
                                            ({ username }) => `@${username}`,
                                          )}
                                        </TwitterTextView>
                                      </ReadMore>
                                    )}
                                    {/* <Text note style={{ fontSize: 12, fontFamily: FontFamily.regular, paddingVertical: 5, paddingRight: 15, color: colors.text }}> {`${prop.reply}`} </Text> */}
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignContent: 'center',
                                        flexWrap: 'wrap',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        marginTop: 5,
                                      }}>
                                      <Text
                                        style={{
                                          fontSize: RFValue(10),
                                          color: colors.heading,
                                          fontFamily: FontFamily.regular,
                                        }}>
                                        {moment(prop.created_at).fromNow()}
                                      </Text>
                                      <Text
                                        style={{
                                          marginHorizontal: 3,
                                          fontSize: 20,
                                          marginTop: Platform.OS == 'ios' ? -6 : -6,
                                          color: colors.heading,
                                        }}>
                                        &#183;
                                      </Text>
                                      <Touch
                                        onPress={() =>
                                          isSuggestionsopened
                                            ? {}
                                            : prop.isLiked
                                            ? _unlikeReply(prop.id, key)
                                            : replyLike(prop.id, key)
                                        }>
                                        <Text
                                          key={key}
                                          style={{
                                            fontSize: RFValue(10),
                                            color:
                                              prop.isLiked == true ? Color.Orange : colors.heading,
                                            fontFamily: FontFamily.regular,
                                          }}>
                                          {prop.likes} {prop.likes > 1 ? 'Likes' : 'Like'}
                                        </Text>
                                      </Touch>
                                      <Text
                                        style={{
                                          marginHorizontal: 3,
                                          fontSize: 20,
                                          marginTop: Platform.OS == 'ios' ? -6 : -6,
                                          color: colors.heading,
                                        }}>
                                        &#183;
                                      </Text>

                                      <Touch
                                        onPress={() =>
                                          isSuggestionsopened ? {} : replyToComment(item.id)
                                        }>
                                        <Text
                                          style={{
                                            fontSize: RFValue(10),
                                            color: colors.heading,
                                            fontFamily: FontFamily.regular,
                                          }}>
                                          Reply
                                        </Text>
                                      </Touch>
                                      {currentLoggedInUser.id == prop.user.id && (
                                        <View style={{ flexDirection: 'row', marginTop: 0.5 }}>
                                          <Text
                                            style={{
                                              marginHorizontal: 3,
                                              fontSize: 20,
                                              marginTop: Platform.OS == 'ios' ? -6 : -6,
                                              color: colors.heading,
                                            }}>
                                            &#183;
                                          </Text>
                                          <Touch
                                            onPress={() =>
                                              isSuggestionsopened
                                                ? {}
                                                : onEditComment(prop, 'comment-reply')
                                            }>
                                            <Text
                                              style={{
                                                color: colors.heading,
                                                fontSize: RFValue(10),
                                                fontFamily: FontFamily.regular,
                                              }}>
                                              Edit
                                            </Text>
                                          </Touch>
                                          <Text
                                            style={{
                                              marginHorizontal: 3,
                                              fontSize: 20,
                                              marginTop: Platform.OS == 'ios' ? -6 : -6,
                                              color: colors.heading,
                                            }}>
                                            &#183;
                                          </Text>
                                          <Touch
                                            onPress={() =>
                                              isSuggestionsopened
                                                ? {}
                                                : onDeleteComment(prop.id, 'comment-reply')
                                            }>
                                            <Text
                                              style={{
                                                color: colors.heading,
                                                fontSize: RFValue(10),
                                                fontFamily: FontFamily.regular,
                                              }}>
                                              Delete
                                            </Text>
                                          </Touch>
                                        </View>
                                      )}
                                      {currentLoggedInUser.id == post?.user?.id &&
                                        currentLoggedInUser.id !== prop.user.id && (
                                          <View style={{ flexDirection: 'row', marginTop: 0.5 }}>
                                            <Text
                                              style={{
                                                marginHorizontal: 3,
                                                fontSize: 20,
                                                marginTop: Platform.OS == 'ios' ? -6 : -6,
                                                color: colors.heading,
                                              }}>
                                              &#183;
                                            </Text>
                                            <Touch
                                              onPress={() =>
                                                isSuggestionsopened
                                                  ? {}
                                                  : onDeleteComment(prop.id, 'comment-reply')
                                              }>
                                              <Text
                                                style={{
                                                  color: colors.heading,
                                                  fontSize: RFValue(10),
                                                  fontFamily: FontFamily.regular,
                                                }}>
                                                Delete
                                              </Text>
                                            </Touch>
                                          </View>
                                        )}
                                    </View>
                                  </Body>
                                </ListItem>
                              );
                            });
                          }
                        })}
                    </View>
                  </Body>
                </ListItem>
              )}
            />
          </TouchableWithoutFeedback>
        ) : (
          <TouchableWithoutFeedback
            onPress={() => {
              resetShow(false);
              isSuggestionsopened ? {} : Keyboard.dismiss();
            }}>
            <View style={{ flex: 1 }}>
              {!isLoading && (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon
                    type="Entypo"
                    name="chat"
                    style={{ color: colors.errorText, fontSize: RFValue(50) }}
                  />
                  <Text
                    style={{
                      color: colors.errorText,
                      fontSize: RFValue(15),
                      fontFamily: FontFamily.regular,
                    }}>
                    No Comments Found!
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
        <EmojiBoard
          showBoard={show}
          onClick={(emoji) => emojiSelect(emoji)}
          containerStyle={{ paddingBottom: hp(5) }}
        />
        <KeyboardAvoidingView
          style={{
            paddingLeft: 10,
            alignSelf: 'center',
            // position: 'absolute',
            // bottom: keyboardHeight - 10,
          }}
          behavior={Platform.OS == 'ios' ? 'position' : 'height'}>
          {/* <View
          style={{
            paddingLeft: 10,
            alignSelf: 'center',
            position: 'absolute',
            bottom: keyboardHeight - 10,
          }}> */}
          <Item
            style={{
              backgroundColor: colors.inputInnerColor,
              borderColor: colors.inputBorder,
              marginBottom: Platform.OS == 'android' ? 5 : DeviceInfo.hasNotch() ? 50 : 20,
              marginHorizontal: RFValue(10),
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            rounded>
            <Icon
              onPress={() => {
                Keyboard.dismiss();
                resetShow(!show);
              }}
              type="Feather"
              name="smile"
              style={{ color: colors.text }}
            />

            <MentionInput
              autoCapitalize={'none'}
              autoComplete={'off'}
              autoCorrect={false}
              importantForAutofill={'no'}
              keyboardType={'email-address'}
              value={comment}
              onChange={onCommentText}
              placeholderTextColor={colors.background !== '#fff' && Color.LightGrey3}
              partTypes={[
                {
                  trigger: '@',
                  renderSuggestions: renderMentionSuggestions,
                  textStyle: { fontWeight: 'bold', color: Color.Blue },
                  isBottomMentionSuggestionsRender: false,
                  isInsertSpaceAfterMention: true,
                },
                {
                  trigger: '#',
                  textStyle: { fontWeight: 'bold', color: Color.Blue },
                  isInsertSpaceAfterMention: true,
                },
                {
                  pattern:
                    /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
                  textStyle: { color: Color.Blue },
                },
              ]}
              style={{
                color: colors.primary,
                width: wp('68%'),
                height: 50,
                paddingTop: Platform.OS == 'android' ? 10 : 15,
              }}
              inputRef={(input) => {
                textInput = input;
              }}
              placeholder="Type a comment..."
            />

            <Button transparent disabled={!comment} onPress={() => _addComment()}>
              <Text style={{ color: Color.Orange, marginRight: 20, fontSize: 16, marginTop: 5 }}>
                {isCommentEdit ? 'Update' : 'Send'}
              </Text>
            </Button>
          </Item>
          {/* </View> */}
        </KeyboardAvoidingView>
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
                      {...testProps('commentScreenReportBtnConform')}
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
                        {...testProps('commentScreenReportBtnCancel')}
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
                        {...testProps('commentScreenReportBtnOk')}
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
                  testProp={'commentScreenReportBtnSpam'}
                  onPress={() => selectReason('Its spam')}
                  text={'Its spam'}
                />
                <ModalBtn
                  testProp={'commentScreenReportBtnSexual'}
                  onPress={() => selectReason('Nudity or sexual activity')}
                  text={'Nudity or sexual activity'}
                />
                <ModalBtn
                  testProp={'commentScreenReportBtnHateSpeech'}
                  onPress={() => selectReason('Hate speech or symbols')}
                  text={'Hate speach or symbols'}
                />
                <ModalBtn
                  testProp={'commentScreenReportBtnIllegal'}
                  onPress={() => selectReason('Sale of illegal or regulated goods')}
                  text={'Sale of illegal or regulated products'}
                />
                <ModalBtn
                  testProp={'commentScreenReportBtnBullying'}
                  onPress={() => selectReason('Bullying or harassment')}
                  text={'Bullying or harassment'}
                />
                <ModalBtn
                  testProp={'commentScreenReportBtnViolation'}
                  onPress={() => selectReason('Intellectual property violation')}
                  text={'Intellectual property violation'}
                />
                <ModalBtn
                  testProp={'commentScreenReportBtnSucide'}
                  onPress={() => selectReason('Suicide, self-injury or eating disorders')}
                  text={'Suicide, self-injury or eating disorders'}
                />
              </View>
            )}
          </View>
        </Modal>
        <ConfirmationModal
          isVisible={showModal}
          isLoading={false}
          discriptionText={'Are you sure you want to delete this post?'}
          actionName="Delete"
          cancellationName="Cancel"
          hideConfirmation={() => cancelDeletePost()}
          onPress={() => proceedDeletePost()}
        />

        <ConfirmationModal
          isVisible={isCommentDialogVisible}
          isLoading={false}
          discriptionText={'Are you sure you want to delete this comment?'}
          actionName="Delete"
          cancellationName="Cancel"
          hideConfirmation={() => cancelDeleteComment()}
          onPress={() => proceedDeleteComment()}
        />
      </View>
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    comments: state.postsReducer.comments,
    totalPages: state.postsReducer.commentsExtra,

    commentStatus: state.postsReducer.commented,
    isLoading: state.RequestLoaders.isRequested,
    replies: state.postsReducer.replies,
    currentLoggedInUser: state.user.user,
    postsData: state.postsReducer.posts,
    savedVideos: state.postsReducer.savedVideos,
    topVideos: state.postsReducer.topVideos,
    personalPosts: state.postsReducer.personalPosts,
    singlePost: state.postsReducer.singlePost,
    isMute: state.postsReducer.videoMute,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSearchKeywordDispatch: (payload) => dispatch(updateSearchKeyword(payload)),
    postCommentDispatch: (postId, comment, mentionList) =>
      dispatch(commentOnPost(postId, comment, mentionList)),
    getCommentsOnPost: (postId, page) => dispatch(getCommentsOnPost(postId, page)),
    replyOnCommentDispatch: (commentId, reply, mentionList) =>
      dispatch(replyOnComment(commentId, reply, mentionList)),
    getRepliesOnCommentDispatch: (commentId, index) =>
      dispatch(getRepliesOnComment(commentId, index)),
    likeCommentDispatch: (commentId) => dispatch(likeComment(commentId)),
    unlikeCommentDispatch: (commentId) => dispatch(unlikeComment(commentId)),
    likeReplyDispatch: (replyId) => dispatch(likeReply(replyId)),
    unlikeReplyDispatch: (replyId) => dispatch(unlikeReply(replyId)),
    updateRepliesDispatch: (payload) => dispatch(updateReplies(payload)),
    updateCommentsDispatch: (payload) => dispatch(updateComments(payload)),
    getSinglePostDispatch: (id) => dispatch(getSinglePost(id)),
    singlePostDispatch: (payload) =>
      dispatch({
        type: 'Single_Post',
        payload: payload,
      }),
    updateReplies: (payload) =>
      dispatch({
        type: 'Get_Replies_On_Comment',
        payload: payload,
      }),
    savePost: (postId) => dispatch(savePost(postId)),
    UnsavePost: (postId) => dispatch(UnsavePost(postId)),
    reportPost: (postId, reason) => dispatch(reportPost(postId, reason)),
    deletePost: (postId) => dispatch(deletePost(postId)),
    editComment: (comment, type) => dispatch(editComment(comment, type)),
    deleteComment: (commentId, type) => dispatch(deleteComment(commentId, type)),
    updateFeedPostsDispatch: (payload) => dispatch(updateFeedPosts(payload)),
    updateSavedVideosDispatch: (payload) =>
      dispatch({
        type: 'Saved_Videos',
        payload: payload,
      }),
    updateTopVideosDispatch: (payload) =>
      dispatch({
        type: 'Top_Videos',
        payload: payload,
      }),
    updatePersonalPosts: (payload) =>
      dispatch({
        type: 'Get_Personal_Posts',
        payload: payload,
      }),
    updateOrientation: (payload) =>
      dispatch({
        type: 'UPDATE_ORIENTATION',
        payload: payload,
      }),
    muteDispatch: (value) =>
      dispatch({
        type: 'IS_MEDIA_MUTE',
        payload: value,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentScreen);
