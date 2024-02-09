import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Text, View, Thumbnail, Icon } from 'native-base';
import {
  TouchableHighlight,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { styles } from './styled';
import { Link } from 'components';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import {
  getWeeklyVideos,
  updateWeeklyVideoStatus,
  generateWeeklyVideo,
} from '../../../../../store/actions/user';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import FastImage from 'react-native-fast-image';

import RNFetchBlob from 'rn-fetch-blob';
// const uri = "https://facebook.github.io/react-native/docs/assets/favicon.png";
import { FollowUser } from '../../../../../store/actions/follow-following';
import { RFValue } from 'react-native-responsive-fontsize';
import { Color, FontFamily } from 'constants';
import { useTheme } from '@react-navigation/native';
import axios from '../../../../../store/utils/axiosCongif';
import { createThumbnail } from 'react-native-create-thumbnail';
// import { getVideoDurationInSeconds } from 'get-video-duration';
import moment from 'moment';
import { playIcon, blankImage, darkBlankImage } from 'assets';
import { ConfirmationModal, ExportVideoModal } from 'components';
import testProps from 'locatorId';
import { color } from 'react-native-reanimated';
import { _Toast, _RenderWeeklyVideos } from '../../../../components';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
const _generateThumbnails = (videoDuration, uri) => {
  return new Promise((resolve, reject) => {
    const _promises = [];
    const timeStamps = createTimeStamp(videoDuration);
    for (let i = 0; i < timeStamps.length; i++) {
      _promises.push(
        createThumbnail({
          url: uri,
          timeStamp: timeStamps[i],
        }),
      );
    }
    Promise.all(_promises)
      .then((responses) => {
        resolve(responses);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createTimeStamp = (videoduration) => {
  if (videoduration > 0) {
    const tempArr = [];
    for (let i = 0; i < 10; i++) {
      tempArr.push(getRandomInt(videoduration));
    }
    tempArr.sort(function (a, b) {
      return a - b;
    });
    return tempArr;
  }
};

const WeeklyScreen = (props) => {
  const {
    getWeeklyVideos,
    isLoading,
    weeklyVideo,
    navigation,
    loggedInUser,
    updateWeeklyVideosDispath,
    updateWeeklyVideoStatus,
    generateWeeklyVideoLoader,
    generatingWeeklyLoader,
    generateWeeklyVideo,
    weeklyLoaderReset,
  } = props;
  const { colors } = useTheme();
  const [isVisible, showModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(0);
  const [generateModal, setGenModal] = useState(false);
  const [genWeeklyLoader, setWeeklyLoader] = useState(false);
  const [exporting, setExport] = useState(false);

  const uri = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      getWeeklyVideos();
      // weeklyLoaderReset();
    });

    return () => {
      unsubscribe1;
    };
  }, []);

  const onsubmit = (postId) => {
    const filteredItems = weeklyVideo.weeklyVideos.filter((elem) => elem.id !== postId);
    const tempObj = {
      ...weeklyVideo,
      weekly_video_creation: true,
      weeklyVideos: filteredItems,
    };
    updateWeeklyVideosDispath({ weeklyVideo: tempObj });
    updateWeeklyVideoStatus('post', postId);
  };

  const _exportAndShare = (weeklyVideo) => {
    setExport(true);
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp4',
    })
      .fetch('GET', weeklyVideo.media_file, {
        Authorization: `jwt ${loggedInUser.token}`,
      })
      .then((res) => {
        setExport(false);
        navigation.navigate('CanvasView', {
          vidupPlatform: true,
          uri: `file://${res.path()}`,
          type: 'video',
          weeklyVideo: weeklyVideo.id,
        });
      })
      .catch((errorMessage, statusCode) => {
        setExport(false);
        // error handling
      });
  };

  const openDialog = (postId) => {
    setSelectedPostId(postId);
    showModal(true);
  };

  const proceedDiscardPost = () => {
    const filteredItems = weeklyVideo.weeklyVideos.filter((elem) => elem.id !== selectedPostId);
    const tempObj = {
      ...weeklyVideo,
      weekly_video_creation: true,
      weeklyVideos: filteredItems,
    };
    updateWeeklyVideosDispath({ weeklyVideo: tempObj });
    updateWeeklyVideoStatus('discard', selectedPostId);
    showModal(false);
  };

  const onGenerate = () => {
    setGenModal(false);
    generateWeeklyVideo();
    setWeeklyLoader(true);
  };
  useEffect(() => {
    generateWeeklyVideoLoader == true ? {} : getWeeklyVideos();
    generatingWeeklyLoader == true ? {} : getWeeklyVideos();
  }, [generateWeeklyVideoLoader, generatingWeeklyLoader]);

  const renderWeeklyVideos = ({ item }) => {
    return (
      <View style={{ paddingHorizontal: wp('5%') }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                backgroundColor: Color.Orange,
                width: 10,
                height: 10,
                borderRadius: 100,
                marginRight: 5,
              }}></View>
            <Text
              style={{
                fontSize: RFValue(12),
                fontFamily: FontFamily.regular,
                color: colors.text,
              }}>
              {moment(item.created_at).format('MMM DD, YYYY')}{' '}
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontFamily: FontFamily.bold,
                  color: colors.text,
                }}>
                {moment(item.created_at).format('h:mm a')}
              </Text>
            </Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            {/* <Icon type="SimpleLineIcons" name='lock' style={{ fontSize: 16, marginRight: 10 }} /> */}
            <Menu>
              <MenuTrigger
                customStyles={{
                  triggerText: {
                    color: 'white',
                  },
                  triggerWrapper: {
                    backgroundColor: 'transparent',
                  },
                  triggerTouchable: {
                    underlayColor: 'transparent',
                    activeOpacity: 70,
                  },
                }}>
                <Icon
                  type="Entypo"
                  name="dots-three-vertical"
                  style={{ fontSize: 16, color: colors.text }}
                />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  marginTop: RFValue(25),
                  width: RFValue(130),
                  marginRight: RFValue(10),
                  marginLeft: -10,
                  paddingVertical: 10,
                  backgroundColor: colors.card,
                }}>
                <MenuOption
                  style={{ marginVertical: RFValue(5) }}
                  onSelect={() => onsubmit(item.id)}>
                  <Text
                    style={{
                      color: colors.text,
                      paddingLeft: RFValue(15),
                    }}>
                    Share
                  </Text>
                </MenuOption>
                <MenuOption
                  style={{ marginVertical: RFValue(5) }}
                  onSelect={() => _exportAndShare(item)}>
                  <Text
                    style={{
                      color: colors.text,
                      paddingLeft: RFValue(15),
                    }}>
                    Edit
                  </Text>
                </MenuOption>
                <MenuOption
                  style={{ marginVertical: RFValue(5) }}
                  onSelect={() => openDialog(item.id)}>
                  <Text
                    style={{
                      color: colors.text,
                      paddingLeft: RFValue(15),
                    }}>
                    Delete
                  </Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              backgroundColor: Color.Orange,
              width: 2,
              marginTop: -8,
              marginLeft: 3.5,
              height: wp('26%'),
              marginRight: 5,
            }}></View>
          <View
            style={{
              marginVertical: 10,
              marginLeft: 10,
              height: wp('18%'),
            }}>
            <TouchableHighlight
              onPress={() =>
                navigation.navigate('weeklyVideoViewScreen', {
                  uri: item.media_file,
                  videoData: item,
                  thumbnails: item.thumbnails_list,
                })
              }
              underlayColor="none">
              <View
                style={{
                  overflow: 'hidden',
                  width: wp('82%'),
                  marginLeft: 10,
                  flexDirection: 'row',
                }}>
                {item?.thumbnails_list.map((thumbs) => {
                  return (
                    <FastImage
                      {...testProps('profileWeeklyThumb')}
                      style={{ width: 50, height: 60 }}
                      resizeMode={FastImage.resizeMode.stretch}
                      source={{
                        uri: thumbs,
                        priority: FastImage.priority.high,
                        headers: {
                          Authorization: `jwt ${loggedInUser.token}`,
                        },
                      }}
                    />
                  );
                })}
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        height: '100%',
        borderTopWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.23,
        shadowRadius: 4.62,
        elevation: 4,
      }}>
      {exporting && <ExportVideoModal />}
      <ConfirmationModal
        isVisible={generateModal}
        isLoading={false}
        discriptionText={
          'Are you sure you want to generate a 30 seconds video from last 7 days recordings?'
        }
        actionName="Yes"
        title="Generate Weekly Video"
        cancellationName="Cancel"
        hideConfirmation={() => setGenModal(false)}
        onPress={() => onGenerate()}
      />

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
            opacity: 1,
          }}>
          <ActivityIndicator color={colors.primary} size="small" />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 20,
          alignContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: RFValue(12),
            marginTop: 5,
            fontFamily: FontFamily.bold,
            color: colors.text,
          }}>
          Weekly
        </Text>
        {weeklyVideo.weeklyVideos.length > 0 && (
          <TouchableHighlight
            onPress={() => {
              generatingWeeklyLoader
                ? _Toast(
                    'success',
                    `Your Video is already generating. You'll be notified after it will be generated.`,
                  )
                : setGenModal(true);
            }}
            underlayColor="none">
            <LinearGradient
              colors={['#FB6200', '#EF0059']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={styles.loginButton}>
              {generateWeeklyVideoLoader && !isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text
                  {...testProps('generateWeeklyVideoBtn')}
                  style={{ color: '#fff', fontSize: 12 }}>
                  Generate
                </Text>
              )}
            </LinearGradient>
          </TouchableHighlight>
        )}
      </View>
      <View style={[styles.wrapper, { backgroundColor: colors.background, flex: 1 }]}>
        {weeklyVideo && weeklyVideo.weeklyVideos.length == 0 ? (
          <View
            style={{
              fontSize: 18,
              justifyContent: 'center',
              shadowColor: '#000',
              borderRadius: 3,
              flex: 1,
            }}>
            <Image
              {...testProps('profileNoWeeklyVideosImg')}
              source={colors.background == '#fff' ? blankImage : darkBlankImage}
              style={{ alignSelf: 'center' }}
            />
            {weeklyVideo.weekly_video_creation == true && (
              <View style={{ alignContent: 'center', alignItems: 'center' }}>
                <Text
                  style={{
                    color: Color.LightGrey1,
                    alignSelf: 'center',
                    marginTop: RFValue(10),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  {generatingWeeklyLoader
                    ? 'Your Video is being generated'
                    : 'You do not have any videos yet.'}
                </Text>
                <TouchableHighlight
                  onPress={() => {
                    generatingWeeklyLoader
                      ? _Toast(
                          'success',
                          `Your Video is already generating. You'll be notified after it will be generated.`,
                        )
                      : setGenModal(true);
                  }}
                  underlayColor="none"
                  style={{ marginTop: 20 }}>
                  <LinearGradient
                    colors={['#FB6200', '#EF0059']}
                    start={{ x: 1, y: 1 }}
                    end={{ x: 0, y: 0 }}
                    style={styles.loginButton}>
                    {generateWeeklyVideoLoader && !isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text
                        {...testProps('generateWeeklyVideoBtn')}
                        style={{ color: '#fff', fontSize: 12 }}>
                        Generate
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableHighlight>
              </View>
            )}
            {weeklyVideo.weekly_video_creation == false && (
              <View>
                <Text
                  {...testProps('profileNoWeeklyVideosText')}
                  style={{
                    color: Color.LightGrey1,
                    marginTop: RFValue(10),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                    textAlign: 'center',
                    marginHorizontal: 13,
                  }}>
                  Your weekly video cannot not be created. You need to have at least 5 videos shared
                  within the last 7 days and a total length of 80 seconds!
                </Text>
              </View>
            )}
          </View>
        ) : (
          <FlatList
            style={{
              paddingTop: RFValue(16),
            }}
            contentContainerStyle={{
              paddingBottom: RFValue(20),
            }}
            showsVerticalScrollIndicator={false}
            data={weeklyVideo.weeklyVideos}
            renderItem={renderWeeklyVideos}
            //renderItem={(item)=> _RenderWeeklyVideos(item, colors, loggedInUser, navigation )}
          />
        )}
      </View>
      <ConfirmationModal
        isVisible={isVisible}
        isLoading={false}
        discriptionText={'Are you sure you want to delete this post ?'}
        actionName="Delete"
        cancellationName="Cancel"
        hideConfirmation={() => showModal(false)}
        onPress={() => proceedDiscardPost()}
      />
    </View>
  );
};

function mapStateToProps(state) {
  return {
    weeklyVideo: state.user.user.weeklyVideo,
    loggedInUser: state.user.user,
    isLoading: state.user.weeklyLoader,
    isWeeklyVideoUpdated: state.user.isWeeklyVideoUpdated,
    generateWeeklyVideoLoader: state.weekly.generateWeeklyLoader,
    generatingWeeklyLoader: state.weekly.generatingWeeklyLoader,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWeeklyVideos: () => dispatch(getWeeklyVideos()),
    updateWeeklyVideoStatus: (status, postId) => dispatch(updateWeeklyVideoStatus(status, postId)),
    updateWeeklyVideosDispath: (payload) =>
      dispatch({
        type: 'Fetch_Weekly_Videos',
        payload: payload,
      }),
    generateWeeklyVideo: () => dispatch(generateWeeklyVideo()),
    weeklyLoaderReset: () =>
      dispatch({
        type: 'GENERATE_WEEKLY_LOADING',
        payload: false,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyScreen);
