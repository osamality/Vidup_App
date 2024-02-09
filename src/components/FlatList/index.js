import { Text, View, Image, Platform } from 'react-native';
import { Card, CardItem, Thumbnail, Icon } from 'native-base';
import React, { useState, useRef, useEffect } from 'react';
import { styles } from './styled';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ReadMore from '@fawazahmed/react-native-read-more';
import Video from 'react-native-video';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import moment, { RFC_2822 } from 'moment';
import testProps from 'locatorId';
import { Color, FontFamily } from 'constants';
import { muteIcon, unmuteIcon, playIcon, noUserPlaceholder, badgeChecdVerified } from 'assets';
import Slider from '@react-native-community/slider';
// import Slider from 'react-native-smooth-slider';
import IconV from 'react-native-vector-icons/MaterialIcons';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import { replaceMentionValues } from '../../edited-modules/react-native-controlled-mentions';
import TwitterTextView from '../../edited-modules/react-native-twitter-textview';
import { _stampMark } from '../../../store/utils/videoProcessing';
// import ReadMore from 'react-native-read-more-text';

// /(^|\s)(@[a-z\d-_.]+)/gi; to be added in node modules after new npm i

//Redux
import { updateFeedPosts, deletePost, addViewCount } from '../../../store/actions/posts';
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import { ConfirmationModal, ProfileThumb } from 'components';
import { fetchUser } from '../../../store/actions/user';
import { updateSearchKeyword } from '../../../store/actions/searh';
import { Touch } from '../touch';
import { Pressable } from 'react-native';

const PostItem = ({
  item,
  index,
  updateOrientation,
  muteUnmute,
  onSave,
  onUnSave,
  onReport,
  updateHashVideos,
  inFocus,
  isMute,
  playPauseMedia,
  postLike,
  thumbnailPress,
  updateTopVideosDispatch,
  currentIndex,
  calculateHeight,
  unlikePost,
  updatePersonalPosts,
  personalPosts,
  goToComments,
  origin,
  hashVideos,
  loggedInUser,
  deletePost,
  navigation,
  updateFeedPostsDispatch,
  postsData,
  updateSavedVideosDispatch,
  savedVideos,
  topVideos,
  onExport,
  addViewCountDispatch,
  updateExploredVideosDispatch,
  exploredVideos,
  visitingUser,
  updateSearchKeywordDispatch,
  requestLoader,
}) => {
  const { colors } = useTheme();
  const [timer, setTimer] = useState(0);
  const [seekTimer, setSeek] = useState(0);
  const [isVisible, showModal] = useState(false);
  const [pause, setPause] = useState(false);
  let playerRef = useRef(null);
  const [icon, setIcon] = useState();
  const [isAudioToastVisible, setIsAudioToastVisible] = useState(false);
  const [isVideoCountIncreased, setIsVideoCountIncreased] = useState(true);
  const [isFull, setFull] = useState(false);
  const [linesToShow, setLines] = useState(2);
  const [videoLoaded, setVideoLoad] = useState(null);
  const [scaledHeight, setScaledHeight] = useState(350);

  useEffect(() => {
    IconV.getImageSource('stop-circle', 15, 'rgba(52, 52, 52, 1)').then(setIcon);
  }, []);

  const onDeletePost = () => {
    showModal(true);
  };

  const cancelDeletePost = () => {
    showModal(false);
  };

  const proceedDeletePost = () => {
    showModal(false);
    deletePost(item.id);

    if (origin == 'SavedVideos') {
      const filteredItems = savedVideos.filter(function (elem) {
        return elem.post.id !== item.id;
      });
      updateSavedVideosDispatch(filteredItems);
    } else if (origin == 'TopVideos') {
      const filteredItems = topVideos.filter(function (elem) {
        return elem.id !== item.id;
      });

      updateTopVideosDispatch(filteredItems);
    } else if (origin == 'HashVideos') {
      const filteredItems = hashVideos.filter(function (elem) {
        return elem.id !== item.id;
      });
      updateHashVideos(filteredItems);
    } else if (origin == 'Profile' || origin == 'profile') {
      const filteredItems = personalPosts.filter(function (elem) {
        return elem.id !== item.id;
      });
      updatePersonalPosts(filteredItems);
    } else if (origin == 'ExploreVideos') {
      const filteredItems = exploredVideos.filter(function (elem) {
        return elem.id !== item.id;
      });
      updateExploredVideosDispatch(filteredItems);
    } else {
      const filteredItems = postsData.filter(function (elem) {
        return elem.id !== item.id;
      });
      updateFeedPostsDispatch(filteredItems);
    }
  };

  const seekVideo = (value) => {
    setSeek(value);
    playerRef.seek(value);
    setPause(false);
  };

  const onEditPost = (post) => {
    navigation.navigate('EditPostScreen', {
      uri: post.user_medias[0].media_file,
      index: index,
      post: post,
    });
  };

  const showNoAudioToast = () => {
    setIsAudioToastVisible(true);
    setTimeout(() => {
      setIsAudioToastVisible(false);
    }, 1000);
  };

  const _onShare = async (uri) => {
    onExport(false);
    Share.open({
      url: uri,
    })
      .then(() => {})
      .catch(() => {});
  };

  const exportShare = (uri, platformCheck) => {
    onExport(true);
    RNFetchBlob.config({
      fileCache: true,
      // by adding this option, the temp files will have a file extension
      appendExt: 'mp4',
    })
      .fetch('GET', uri, {
        Authorization: `jwt ${loggedInUser.token}`,
      })
      .then((res) => {
        let status = res.info().status;
        //_stampMark(`file://${res.path()}`);
        _stampMark(`file://${res.path()}`, (response) => {
          if (response[0] === 0) {
            _onShare(response[1]);
          } else {
            onExport(false);
          }
        });
      })
      // Something went wrong:
      .catch(() => {
        onExport(false);
        // error handling
      });
  };

  const getUser = (username) => {
    let deepCopy = username.trim();
    fetchUser(deepCopy)
      .then(({ data }) => {
        visitingUser(data.data);
        navigation.navigate('PublicProfileScreen', { publicProfile: data.data });
      })
      .catch(() => {});
  };

  const _enableFullScreen = (item) => {
    updateOrientation('landscape');
    navigation.navigate('FullScreen', { videoUrl: item?.user_medias[0]?.url });
  };
  const getViewsFormat = (count) => {
    if (count > 999 && count < 1000000) {
      return (count / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (count > 1000000) {
      return (count / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
    } else if (count < 9999) {
      return count; // if value < 1000, nothing to do
    }
  };

  const _renderTruncatedFooter = (handlePress) => {
    return (
      <Text
        style={{
          color: colors.background == '#fff' ? Color.DarkGrey : Color.LightGreySeeMore,
          marginTop: 5,
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
          marginTop: 5,
        }}
        onPress={handlePress}>
        see less
      </Text>
    );
  };

  const _conditionalHeader = (userMedias) => {
    if (userMedias?.url != '') {
      return { uri: userMedias?.url };
    } else {
      return {
        uri: userMedias.media_file,
        headers: {
          Authorization: `jwt ${loggedInUser.token}`,
        },
      };
    }
  };
  // var minutes = (item.duration % 3600) / 60;
  // var sec = (minutes % 1) * 60;
  var minutes = item?.user_medias[0]?.duration / 1000 / 60;
  var r = minutes % 1;
  var sec = Math.floor(r * 60);
  if (sec < 10) {
    sec = '0' + sec;
  }
  minutes = Math.floor(minutes);

  const _calculateHeigt = (videoDim) => {
    var result = (videoDim.height / videoDim.width) * width;
    return result;
  };

  const _goToComments = (obj) => {
    requestLoader(true);
    goToComments(obj);
  };

  // const desireHeight = _calculateHeigt(videoDim);

  return (
    <Card
      onLayout={calculateHeight}
      transparent
      style={{
        borderWidth: 2,
        width: wp('100%'),
        marginBottom: RFValue(14),
        marginLeft: 0,
        paddingLeft: 0,
      }}>
      <CardItem cardBody>
        <View
          style={{
            width: wp('100%'),
            // height: scaledHeight,
            aspectRatio: 4 / 4.5,
          }}>
          <Video
            source={_conditionalHeader(item?.user_medias[0])}
            muted={isMute}
            preventsDisplaySleepDuringVideoPlayback={false}
            paused={currentIndex == index && !pause && inFocus ? item.paused : true}
            poster={item?.user_medias[0]?.thumbnail}
            posterResizeMode={'stretch'}
            ref={(ref) => {
              playerRef = ref;
            }}
            onLoadStart={(elem) => {
              addViewCountDispatch(item.id, index);
            }}
            onEnd={() => {
              addViewCountDispatch(item.id, index);
            }}
            // onLoad={() => {
            //   setVideoLoad(currentIndex);
            // }}
            onReadyForDisplay={(response) => {
              // console.log(';;;;', response);
            }}
            onLoad={(response) => {
              setVideoLoad(currentIndex);

              const { width, height } = response.naturalSize;
              var result = (height / width) * width;
              setScaledHeight(isNaN(parseFloat(result)) ? 370 : result);
            }}
            onProgress={(e) => {
              setTimer(parseInt(e.currentTime));
              setSeek(e.currentTime);
            }}
            resizeMode={'cover'}
            repeat={true}
            style={styles.videoPlayer}
            {...testProps('listPostItemVideo')}
          />

          <View style={styles.postOverlay}>
            {item.paused == true ? (
              <Pressable style={{ justifyContent: 'center', flex: 1 }} onPress={playPauseMedia}>
                <Image
                  {...testProps('listPostItemVideoPlayImg')}
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
              <Pressable style={{ justifyContent: 'center', flex: 1 }} onPress={playPauseMedia}>
                <View style={{ margin: wp('90%'), width: wp('78%'), height: hp('27%') }}></View>
              </Pressable>
            )}
            {item.paused == true || currentIndex != index ? (
              <Text
                {...testProps('listPostItemVideoTimerPaused')}
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
                {...testProps('listPostItemVideoTimer')}
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
            {/* <View style={{ position: 'absolute', bottom: RFValue(12), right: RFValue(8) }}>
              <TouchableWithoutFeedback onPress={muteUnmute}>
                <Image source={item.muted ? muteIcon : unmuteIcon} style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }} />
              </TouchableWithoutFeedback>
            </View> */}
          </View>
          {currentIndex == index && (
            <Icon
              onPress={() => _enableFullScreen(item)}
              name="fullscreen"
              type="MaterialIcons"
              style={{
                position: 'absolute',
                top: RFValue(7),
                left: 5,
                fontSize: RFValue(20),
                color: '#fff',
              }}
            />
          )}
          {currentIndex == index && item?.user_medias[0]?.duration != null && (
            <>
              <View
                style={{
                  width: '100%',
                  position: 'absolute',
                  bottom: -15,
                  justifyContent: 'flex-end',
                  // paddingHorizontal: 15,
                  // justifyContent: 'space-between',
                  // flexDirection: 'row',
                  // backgroundColor: 'white',
                }}>
                {/* {item.paused ? (
                  <Icon
                    onPress={playPauseMedia}
                    name="play"
                    type="Foundation"
                    style={{ fontSize: RFValue(20), color: '#fff' }}
                  />
                ) : (
                  <Icon
                    onPress={playPauseMedia}
                    name="pause"
                    type="Foundation"
                    style={{ fontSize: RFValue(20), color: '#fff' }}
                  />
                )} */}

                <Slider
                  {...testProps('listPostItemVideoBottomSlider')}
                  style={{
                    marginLeft: Platform.OS === 'ios' ? -3 : -15,
                    width: Platform.OS === 'ios' ? wp(103) : wp(107),
                    zIndex: 9999999,
                  }}
                  minimumValue={0}
                  value={seekTimer}
                  // step={1}
                  tapToSeek={true}
                  useNativeDriver={true}
                  //onValueChange={value => seekVideo(value)}
                  onSlidingStart={() => setPause(true)}
                  onSlidingComplete={(value) => seekVideo(value)}
                  maximumValue={item?.user_medias[0]?.duration / 1000}
                  minimumTrackTintColor={colors.background !== '#fff' ? '#C0C0C0' : '#606060'}
                  maximumTrackTintColor={colors.background !== '#fff' ? '#E0E0E0' : '#C0C0C0'}
                  thumbTintColor={colors.background !== '#fff' ? '#C0C0C0' : '#E0E0E0'}
                  thumbImage={icon}
                  thumbStyle={{
                    height: 5,
                    width: 5,
                    borderRadius: 100,
                  }}
                />
                <View
                  style={{
                    backgroundColor: colors.card,
                    marginTop: Platform.OS === 'ios' ? -18 : -8,
                    height: 20,
                  }}
                />
              </View>
              <Pressable
                style={{
                  position: 'absolute',
                  right: 18,
                  bottom: 20,
                  zIndex: 9,
                }}
                onPress={item.user_medias[0]?.has_audio ? muteUnmute : showNoAudioToast}>
                {!item.user_medias[0]?.has_audio ? (
                  <Image
                    {...testProps('listPostItemVideoAudioBtnMute')}
                    source={muteIcon}
                    style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }}
                  />
                ) : (
                  <Image
                    {...testProps('listPostItemVideoAudioBtn')}
                    source={isMute ? muteIcon : unmuteIcon}
                    style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }}
                  />
                )}
              </Pressable>
            </>
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
                {...testProps('listPostItemVideoToast')}
                style={{ color: '#fff', fontFamily: FontFamily.medium }}>
                No Video Sound
              </Text>
            </View>
          )}
        </View>
      </CardItem>
      <CardItem
        style={{
          backgroundColor: colors.card,
          borderBottomColor: colors.background !== '#fff' ? colors.inputBorder : Color.LightGrey1,
          borderBottomWidth: 1,
        }}>
        <View style={styles.userView}>
          <Touch onPress={thumbnailPress}>
            {item.user.profile_pic ? (
              <ProfileThumb
                testProp={'listPostItemUserThumbImg'}
                style={{ width: 45, height: 45 }}
                profilePic={item.user.profile_pic}
              />
            ) : (
              <Thumbnail style={{ width: 45, height: 45 }} source={noUserPlaceholder} />
            )}
          </Touch>

          <View style={styles.postDescription}>
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
              <Pressable onPress={thumbnailPress}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.background == '#fff' ? Color.LightGrey3 : colors.text,
                      fontSize: RFValue(10),
                    }}
                    numberOfLines={1}>
                    {item.user.name && item.user.name !== ' '
                      ? `${item.user.first_name} ${item.user.last_name}`
                      : item.user.username}
                  </Text>
                  {item.user.is_account_verified && (
                    <Image
                      {...testProps('profileHeaderDrawerBtn')}
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
                {...testProps('listPostItemUserName')}
                style={{
                  marginTop: Platform.OS == 'ios' ? -13 : -13,
                  fontSize: Platform.OS == 'ios' ? 3 : 20,
                  color: colors.background == '#fff' ? Color.LightGrey3 : colors.text,
                  paddingHorizontal: 4,
                }}>
                {Platform.OS == 'ios' ? <>&#9679;</> : <>&#183;</>}
              </Text>
              <Text
                {...testProps('listPostItemPostedTimeAgo')}
                style={{
                  color: colors.background == '#fff' ? Color.LightGrey3 : colors.text,
                  fontSize: 10,
                }}>
                {moment(item.created_at).fromNow()}
              </Text>
            </View>
            <View {...testProps('listPostItemReadMore')} style={{ overflow: 'hidden', flex: 1 }}>
              {item?.description != null &&
                item?.description != undefined &&
                item?.description != '' && (
                  <ReadMore
                    numberOfLines={2}
                    seeMoreText={'more'}
                    seeLessText={'see less'}
                    style={[
                      styles.description,
                      {
                        color: colors.background == '#fff' ? Color.DarkGrey : colors.text,
                        fontSize: 12,
                        overflow: 'hidden',
                        fontFamily: FontFamily.regular,
                      },
                    ]}
                    seeMoreStyle={{
                      color: colors.background == '#fff' ? Color.DarkGrey : Color.LightGreySeeMore,
                      paddingLeft: RFValue(2),
                      backgroundColor: colors.card,
                    }}
                    seeLessStyle={{
                      color: colors.background == '#fff' ? Color.DarkGrey : Color.LightGreySeeMore,
                    }}>
                    <TwitterTextView
                      numberOfLines={1}
                      onPressHashtag={(e, hashtag) => {
                        updateSearchKeywordDispatch(hashtag.trim());
                        navigation.navigate('SearchScreen', {
                          screen: 'search',
                          params: {
                            screen: 'Videos',
                          },
                        });
                      }}
                      onPressMention={(e, hashtag) => {
                        item?.description &&
                          replaceMentionValues(`${item.description}`, (item) => {
                            if (hashtag.includes(item.username) && loggedInUser.id == item.id) {
                              navigation.navigate('Profile', { screen: 'ProfileHome' });
                            } else if (hashtag.includes(item.username)) {
                              getUser(hashtag.replace('@', ''));
                            }
                          });
                      }}
                      mentionStyle={{ color: Color.Blue, fontSize: 13 }}
                      hashtagStyle={{ color: Color.Blue, fontSize: 13 }}>
                      {item?.description &&
                        replaceMentionValues(
                          `${item.description}`,
                          ({ username }) => `@${username}`,
                        )}
                    </TwitterTextView>
                  </ReadMore>
                )}
            </View>
          </View>
          <Menu>
            <MenuTrigger
              customStyles={{
                triggerTouchable: {
                  underlayColor: 'none',
                  activeOpacity: 70,
                },
              }}>
              <View {...testProps('listPostItemMenuBtn')}>
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
                backgroundColor: colors.background,
                marginLeft: -15,
                paddingVertical: 10,
              }}>
              <MenuOption
                style={{ marginVertical: RFValue(5) }}
                onSelect={() => {
                  item.post_saved ? onUnSave() : onSave();
                }}>
                <Text
                  {...testProps('menuOptionSave')}
                  style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                  {item.post_saved ? 'Unsave' : 'Save'}
                </Text>
              </MenuOption>
              {item.allow_sharing && (
                <MenuOption
                  style={{ marginVertical: RFValue(5) }}
                  onSelect={() =>
                    exportShare(
                      item.user_medias[0]?.media_file,
                      item.user_medias[0]?.vidup_platform,
                    )
                  }>
                  <Text
                    {...testProps('menuOptionShare')}
                    style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                    Share
                  </Text>
                </MenuOption>
              )}
              {loggedInUser.id === item.user.id ? (
                <View>
                  <MenuOption
                    style={{ marginVertical: RFValue(5) }}
                    onSelect={() => onEditPost(item)}>
                    <Text
                      {...testProps('menuOptionEdit')}
                      style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                      Edit
                    </Text>
                  </MenuOption>
                  <MenuOption
                    style={{ marginVertical: RFValue(5) }}
                    onSelect={() => onDeletePost(item)}>
                    <Text
                      {...testProps('menuOptionDelete')}
                      style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                      Delete
                    </Text>
                  </MenuOption>
                </View>
              ) : (
                <></>
              )}
              {loggedInUser.id !== item.user.id ? (
                <MenuOption style={{ marginVertical: RFValue(5) }} onSelect={onReport}>
                  <Text
                    {...testProps('menuOptionReport')}
                    style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                    Report
                  </Text>
                </MenuOption>
              ) : (
                <></>
              )}
            </MenuOptions>
          </Menu>
        </View>
      </CardItem>
      <CardItem style={{ backgroundColor: colors.card }}>
        <View style={styles.rowView}>
          <View style={[styles.nestedRowView, { marginTop: 4 }]}>
            <Pressable
              onPress={() =>
                item.isLiked ? unlikePost(index, item.id) : postLike(index, item.id)
              }>
              <Image
                {...testProps('listPostItemLikeBtn')}
                source={{
                  uri: item.isLiked
                    ? 'heartfiled'
                    : colors.background == '#fff'
                    ? 'heartdim'
                    : 'heartdark',
                }}
                style={{ width: RFValue(16), height: RFValue(16), resizeMode: 'contain' }}
              />
            </Pressable>
            {/* <Icon onPress={() => (item.isLiked ? unlikePost(index, item.id) : postLike(index, item.id))} type="Entypo" name="heart" style={{ color: Color.DarkGrey }} /> */}
            <Touch
              onPress={() =>
                navigation.push('HomeScreen', {
                  screen: 'HScreen',
                  params: { screen: 'ViewAllLikedUsers', params: { postId: item.id } },
                })
              }>
              <Text
                {...testProps('listPostItemNumberLikesBtn')}
                style={{
                  fontFamily: FontFamily.regular,
                  color: colors.background == '#fff' ? Color.DarkGrey : Color.White,
                  fontSize: 11,
                  marginLeft: 5,
                }}>
                {item.likes}
              </Text>
            </Touch>
          </View>

          {item.allow_comments && (
            <Pressable
              style={{ marginTop: 4 }}
              onPress={() =>
                _goToComments({
                  post: item.description,
                  postId: item.id,
                  user: item.user,
                  createdAt: item.created_at,
                })
              }>
              <View style={styles.nestedRowView}>
                <Image
                  {...testProps('listPostItemCommentBtn')}
                  source={{ uri: colors.background == '#fff' ? 'commentdim' : 'commentdark' }}
                  style={{
                    width: RFValue(16),
                    height: RFValue(16),
                    marginRight: 5,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  {...testProps('listPostItemNumberCommentBtn')}
                  style={{
                    color: colors.background == '#fff' ? Color.DarkGrey : Color.White,
                    fontSize: 11,
                  }}>
                  {item.comments}
                </Text>
              </View>
            </Pressable>
          )}
        </View>
        <View style={{ width: '75%' }}>
          <Touch
            onPress={() =>
              navigation.push('HomeScreen', {
                screen: 'HScreen',
                params: { screen: 'ViewAllLikedUsers', params: { postId: item.id } },
              })
            }>
            {!item.user.is_video_view_count && (
              <Text
                {...testProps('listPostItemNumberViews')}
                style={{
                  alignSelf: 'flex-end',
                  color: colors.text,
                  fontSize: 12,
                  fontFamily: FontFamily.regular,
                  paddingRight: 10,
                }}>
                {getViewsFormat(item.view_count)} Views
              </Text>
            )}
          </Touch>
        </View>
      </CardItem>
      <ConfirmationModal
        isVisible={isVisible}
        isLoading={false}
        discriptionText={'Are you sure you want to delete this post ?'}
        actionName="Delete"
        cancellationName="Cancel"
        hideConfirmation={() => cancelDeletePost()}
        onPress={() => proceedDeletePost()}
      />
    </Card>
  );
};

function mapStateToProps(state) {
  return {
    personalPosts: state.postsReducer.personalPosts,
    loggedInUser: state.user.user,
    postsData: state.postsReducer.posts,
    savedVideos: state.postsReducer.savedVideos,
    topVideos: state.postsReducer.topVideos,
    visitedUser: state.user.visitingUser,
    exploredVideos: state.postsReducer.expoloreVideos,
    hashVideos: state.postsReducer.hashVideos,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSearchKeywordDispatch: (payload) => dispatch(updateSearchKeyword(payload)),
    updatePersonalPosts: (payload) =>
      dispatch({
        type: 'Get_Personal_Posts',
        payload: payload,
      }),
    updateTopVideosDispatch: (payload) =>
      dispatch({
        type: 'Top_Videos',
        payload: payload,
      }),
    updateExploredVideosDispatch: (payload) =>
      dispatch({
        type: 'EXPLORE_VIDEOS',
        payload: payload,
      }),
    deletePost: (postId) => dispatch(deletePost(postId)),
    updateFeedPostsDispatch: (payload) => dispatch(updateFeedPosts(payload)),
    updateSavedVideosDispatch: (payload) =>
      dispatch({
        type: 'Saved_Videos',
        payload: payload,
      }),
    addViewCountDispatch: (payload, index) => dispatch(addViewCount(payload, index)),
    visitingUser: (payload) =>
      dispatch({
        type: 'Visiting_User',
        payload: payload,
      }),
    updateOrientation: (payload) =>
      dispatch({
        type: 'UPDATE_ORIENTATION',
        payload: payload,
      }),
    updateHashVideos: (payload) =>
      dispatch({
        type: 'HASH_VIDEOS',
        payload: payload,
      }),
    requestLoader: (payload) =>
      dispatch({
        type: 'LOADING',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostItem);
