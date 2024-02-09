import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableHighlight,
  Text,
  BackHandler,
  FlatList,
  StatusBar,
  View,
  Platform,
  useWindowDimensions,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  Image,
  Keyboard,
  KeyboardEvent,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Icon, Right } from 'native-base';
import { styles } from './styled';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { _Toast, UnfollowConfirm, ExportVideoModal } from '../../../../components';
import { RFValue } from 'react-native-responsive-fontsize';
import { FontFamily } from 'constants';
import { RNFFprobe, RNFFmpegConfig } from 'react-native-ffmpeg';
import DocumentPicker from 'react-native-document-picker';
import SoundPlayer from 'react-native-sound-player';
import Draggable from 'react-native-draggable';
import Slider from 'react-native-smooth-slider';
import Feather from 'react-native-vector-icons/Feather';
import { SliderHuePicker, SliderValuePicker } from 'react-native-slider-color-picker';
import tinycolor from 'tinycolor2';
import Drag from 'reanimated-drag-resize';

import RNFetchBlob from 'rn-fetch-blob';
import { _formatVideo, addFilter } from '../../../../../store/utils/videoProcessing';
import { _requestPermission } from '../../../../../store/utils/permissions';
import testProps from 'locatorId';
import { BlurView } from '@react-native-community/blur';
import { muteIcon, unmuteIcon, closeIcon, colorChanger } from 'assets';

const WINDOW = Dimensions.get('window');

//temp emojis urls
import { emojis } from './emojis.json';
import { Pressable } from 'react-native';
import { Touch } from '../../../../components/touch';
import { EmojiPicker } from '../../../../components/emojiPicker';
import { TextOver } from '../../../../components/textover';

const canvas = ({ navigation, route }) => {
  const { type } = route.params;
  let playerRef = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [uri, setUri] = useState(route.params.uri);
  const [focused, resetFocus] = useState(false);
  const [isVisible, showModal] = useState(false);
  const [muted, setMute] = useState(false);
  const [processing, setProcess] = useState(false);
  const [songSelected, setSong] = useState(null);
  const songUpdated = useRef(null);
  const [vidupPlatform, setPlatform] = useState(route.params?.vidupPlatform);
  const [isWeeklyVideo, setWeeklyVideo] = useState(
    route.params?.weeklyVideo ? route.params?.weeklyVideo : 'NotWeeklyVideo',
  );
  const [noAudio, setNoAudio] = useState(false);
  const [isAudioToastVisible, setIsAudioToastVisible] = useState(false);
  const [selectedEmoji, selectEmoji] = useState([]);
  const [textOver, setTextOver] = useState([]);
  const [emojiShow, showEmoji] = useState(false);
  const { height, width } = useWindowDimensions();
  const [videoContainer, setDimension] = useState({ height: 500, width: 500 });
  const [videoDim, setDim] = useState({ height: 500, width: 500, orientation: 'landscape' });
  const [addTextCheck, setAddTextCheck] = useState(false);
  const [oldColor, setOldColor] = useState('#FFFF00');
  const [editable, setEditable] = useState(false);
  const [colorPickerType, setColorPickerType] = useState(false);
  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [vFormated, setFormat] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true); // or some other action
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false); // or some other action
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const updateState = (val) => {
    songUpdated.current = val;
  };

  const changeColor = (colorHsvOrRgb, resType) => {
    // if (resType === 'end') {
    setOldColor(tinycolor(colorHsvOrRgb).toHexString());
    // }
  };

  useEffect(() => {
    updateState(songSelected);
  }, [songSelected]);

  useEffect(() => {
    textOver.length == 0 ? setEditable(false) : {};
  }, [textOver]);

  useEffect(() => {
    setActive();
    global.currentTime = 0;
    const backAction = () => {
      showModal(true);
      return false;
    };

    const genericBack = navigation.addListener('beforeRemove', (e) => {
      if (songUpdated.current) {
        SoundPlayer.stop();
      }
    });

    const _onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({ success }) => {},
    );
    const _onFinishedLoadingSubscription = SoundPlayer.addEventListener(
      'FinishedLoading',
      ({ success }) => {},
    );
    const _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingFile',
      ({ success, name, type }) => {},
    );
    const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      ({ success, url }) => {
        SoundPlayer.play();
      },
    );

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
      genericBack();
      _onFinishedPlayingSubscription.remove();
      _onFinishedLoadingSubscription.remove();
      _onFinishedLoadingURLSubscription.remove();
      _onFinishedLoadingFileSubscription.remove();
    };
  }, []);

  const enableLogCallback = (logCallback) => {
    RNFFmpegConfig.enableLogCallback(logCallback);
  };

  const enableStatisticsCallback = (statisticsCallback) => {
    RNFFmpegConfig.enableStatisticsCallback(statisticsCallback);
  };

  const setActive = () => {
    enableLogCallback(logCallback);
    enableStatisticsCallback(statisticsCallback);
  };

  const logCallback = (log) => {
    ffprint(log.message);
  };

  const statisticsCallback = (statistics) => {};

  const requestExternalStorage = async () => {
    Platform.OS === 'ios'
      ? _pickAudio()
      : _requestPermission('READ_EXTERNAL_STORAGE', (response) => {
          if (response) {
            _pickAudio();
          } else {
            _Toast('danger', 'Storage permission denied');
          }
        });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (songUpdated.current) {
        SoundPlayer.stop();
      }
      resetFocus(false);
    });
    const unsubscribe1 = navigation.addListener('focus', () => {
      if (songUpdated.current) {
        SoundPlayer.loadUrl(songUpdated.current.uri);
      }
      setTimeout(() => {
        resetFocus(true);
      }, 600);
    });
    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, [route.params.uri]);

  useEffect(async () => {
    setUri(route.params.uri);
    RNFFmpegConfig.enableLogCallback(() => undefined);
    const information = await RNFFprobe.getMediaInformation(route.params.uri);
    if (information.getAllProperties().format.nb_streams < 2) {
      setNoAudio(true);
    } else {
      setNoAudio(false);
    }
    if (information.getAllProperties().format.duration < 31 && vFormated == false) {
      setFormat(true);
      setProcess(true);
      formatVideo();
    }
  }, [route.params.uri]);

  const formatVideo = () => {
    _formatVideo(route.params.uri, (response) => {
      if (response.returnCode == 0) {
        setUri(response.video);
        setProcess(false);
      } else {
        setProcess(false);
      }
    });
  };

  const _pickAudio = async () => {
    if (duration < 31) {
      resetFocus(false);
      try {
        const res = await DocumentPicker.pick({
          allowMultiSelection: false,
          type: [DocumentPicker.types.audio],
          copyTo: 'cachesDirectory',
        });
        setSong(res);
        setMute(false);
        resetFocus(true);
        if (Platform.OS == 'android') {
          _attachSoundPlayer('file://' + res.fileCopyUri);
        } else {
          _attachSoundPlayer(res.uri);
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          resetFocus(true);
        } else {
          throw err;
        }
      }
    } else {
      _Toast('danger', 'Please trim your video to 30 seconds or less!');
    }
  };

  const _attachSoundPlayer = (url) => {
    try {
      // or play from url
      SoundPlayer.loadUrl(url);
    } catch (e) {}
  };

  const _processVideo = (params) => {
    addFilter(
      params.uri,
      params.emojis,
      params.texts,
      params.videoContainer,
      params.videoDim,
      params.oldColor,
      params.hasAudio,
      (response) => {
        if (response.returnCode == 0) {
          setUri(response.video);
        } else {
          _Toast('danger', 'Error processing Video!');
        }
      },
    );
  };

  const proceedToPost = () => {
    if (duration < 31) {
      let ffmpegParams = {};
      ffmpegParams.uri = uri;
      ffmpegParams.emojis = selectedEmoji;
      ffmpegParams.texts = textOver;
      ffmpegParams.videoContainer = videoContainer;
      ffmpegParams.videoDim = videoDim;
      ffmpegParams.oldColor = oldColor;
      ffmpegParams.hasAudio = !noAudio;

      // console.log("------- FFMPEG: ", JSON.stringify(ffmpegParams) )
      //   _processVideo(ffmpegParams)
      // return

      if (songUpdated.current) {
        SoundPlayer.stop();
      }
      navigation.navigate('PostScreen', {
        vidupPlatform: vidupPlatform,
        uri: uri,
        type: type,
        weeklyVideo: isWeeklyVideo,
        muted: muted,
        noAudio: noAudio,
        voiceOver: songSelected,
        ffmpegParams,
      });
    } else {
      _Toast('danger', 'Please trim your video to 30 seconds or less!');
    }
  };

  const discardVideo = () => {
    // console.log('discardVideo');
    showModal(false);
    navigation.goBack();
  };

  const dissmiss = () => {
    showModal(false);
  };

  const _removeSong = () => {
    SoundPlayer.stop();
    setSong(null);
  };

  const showNoAudioToast = () => {
    setIsAudioToastVisible(true);
    setTimeout((elem) => {
      setIsAudioToastVisible(false);
    }, 1000);
  };

  var minutes = duration / 60;
  var r = minutes % 1;
  var sec = Math.floor(r * 60);
  if (sec < 10) {
    sec = '0' + sec;
  }
  minutes = Math.floor(minutes);

  const _selectEmoji = (item) => {
    if (duration < 31) {
      selectEmoji([
        ...selectedEmoji,
        {
          uri: item,
          height: 70,
          width: 70,
          x: videoContainer.width / 2.5,
          y: videoContainer.height / 2.5,
        },
      ]);
      showEmoji(false);
      downloadImage(item, selectedEmoji.length);
    } else {
      showEmoji(false);
      _Toast('danger', 'Please trim your video to 30 seconds or less!');
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => _selectEmoji(item)}>
        <FastImage
          source={{ uri: item }}
          style={{
            width: wp('20%'),
            marginRight: wp('2%'),
            height: wp('20%'),
            resizeMode: 'contain',
          }}
        />
      </TouchableWithoutFeedback>
    );
  };

  const downloadImage = (imageUrl, index) => {
    RNFetchBlob.config({
      fileCache: true,
      // by adding this option, the temp files will have a file extension
      appendExt: 'png',
    })
      .fetch('GET', imageUrl)
      .then((res) => {
        let status = res.info().status;
        let temp = selectedEmoji;
        let defaultCords = _getRelativePosition({
          top: videoContainer.height / 2.5,
          left: videoContainer.width / 2.5,
        });
        temp[index] = {
          ...temp[index],
          height: _getResponsiveSize(70),
          width: _getResponsiveSize(70),
          x: videoContainer.width / 2.5,
          y: videoContainer.height / 2.5,
          cords: defaultCords,
          uri: `file://${res.path()}`,
        };
        selectEmoji([...temp]);
        //_resizeImage(`file://${res.path()}`, index);
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // error handling
      });
  };

  const _addText = () => {
    if (duration < 31) {
      setTextOver([
        ...textOver,
        {
          text: '',
          fontColor: 'white',
          cords: _getRelativePosition({
            top: videoContainer.height / 2.5,
            left: videoContainer.width / 3.6,
          }),
          x: videoContainer.width / 3.6,
          y: videoContainer.height / 2.5,
          fontsize: 20,
          lines: [],
          0: { line: 0, text: '' },
        },
      ]);
    } else {
      _Toast('danger', 'Please trim your video to 30 seconds or less!');
    }
  };

  const ffprint = (text) => {
    // console.log(text.endsWith('\n') ? text.replace('\n', '') : text);
  };

  const _getResponsiveSize = (imgSize) => {
    let rSize = (imgSize * 100) / videoContainer.height;
    return (rSize / 100) * videoDim.height;
  };

  const _getRelativePosition = (bounds) => {
    let percentageX = (bounds.left * 100) / width;
    let positionRelatedToVideoX = (percentageX / 100) * videoDim.width;

    let percentageY = (bounds.top * 100) / videoContainer.height;
    let positionRelatedToVideoY = (percentageY / 100) * videoDim.height;

    return { left: positionRelatedToVideoX, top: positionRelatedToVideoY };
  };

  const _calculateHeigt = (videoDim) => {
    var result = (videoDim.height / videoDim.width) * width;
    return result;
  };

  const desireHeight = _calculateHeigt(videoDim);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setEditable(false);
        let temp = [];
        textOver.filter((i, ind) => {
          if (i.text !== '') {
            temp.push(i);
          }
        });
        setTextOver([...temp]);
      }}>
      <View style={styles.container}>
        {processing && <ExportVideoModal incommingText={'Processing...'} />}
        <StatusBar barStyle={'light-content'} translucent backgroundColor="transparent" />
        <UnfollowConfirm
          isVisible={isVisible}
          type={'discardVideo'}
          isLoading={false}
          hideConfirmation={() => dissmiss()}
          onUnfollow={() => discardVideo()}
        />
        {focused && (
          <View
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              console.log('View Map: ', layout);
              setDimension(layout);
            }}
            style={{
              //alignSelf: 'center',
              // flex: 1,
              // justifyContent: 'center',
              // alignItems: 'center'
              height: desireHeight,
              width: width,
              overflow: 'hidden',
            }}>
            <Video
              source={{ uri: uri }}
              muted={songSelected ? true : muted}
              preventsDisplaySleepDuringVideoPlayback={false}
              controls={false}
              ref={(ref) => {
                playerRef = ref;
              }}
              repeat={true}
              resizeMode={'none'}
              onEnd={() => {
                if (songUpdated.current) {
                  SoundPlayer.seek(1);
                }
              }}
              onLoad={(payload) => {
                setDim(payload.naturalSize);
                setDuration(payload.duration);
              }}
              style={{
                // alignSelf: 'center',
                width: width,
                height: desireHeight,
              }}
              {...testProps('capturedPostVideoPlayer')}
            />
          </View>
        )}

        <View
          style={{
            resizeMode: 'contain',
            zIndex: 999,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // justifyContent: 'center',
            // alignItems: 'center',
          }}>
          {selectedEmoji.map((item, index) => (
            <EmojiPicker
              selectedEmoji={selectedEmoji}
              index={index}
              videoContainer={videoContainer}
              desireHeight={desireHeight}
              selectEmoji={selectEmoji}
              item={item}
              videoDim={videoDim}
              width={width}
              height={height}
            />
          ))}
          {textOver.map((item, index) => (
            <TextOver
              textOver={textOver}
              index={index}
              videoContainer={videoContainer}
              setTextOver={setTextOver}
              item={item}
              videoDim={videoDim}
              width={width}
              height={height}
              setEditable={setEditable}
              setSelectedTextIndex={setSelectedTextIndex}
              editable={editable}
            />
          ))}

          {songSelected && (
            <Drag
              style={{ zIndex: 9999, width: 150, height: 50 }}
              resizable={false}
              // height={'225%'}
              // width={'45%'}
              x={videoContainer.width / 3.6}
              y={videoContainer.height / 2.4}
              limitationHeight={videoContainer.height}
              limitationWidth={videoContainer.width}>
              <View
                style={{
                  width: 150,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  backgroundColor: 'rgba(0,0,0, 0.5)',
                  zIndex: 99999,
                }}>
                <Text
                  {...testProps('capturedPostSelectedSongName')}
                  numberOfLines={1}
                  style={{ fontSize: 14, color: '#fff' }}>
                  {songSelected.name}
                </Text>
              </View>
              <View
                style={[
                  styles.roundBtn,
                  {
                    top: -10,
                    right: -10,
                    height: 30,
                    width: 30,
                    zIndex: 9999999999,
                  },
                ]}>
                <Icon
                  onPress={() => {
                    _removeSong();
                  }}
                  type="Entypo"
                  name={'cross'}
                  style={{ fontSize: 18, color: '#fff' }}
                />
              </View>
            </Drag>
          )}
        </View>

        <Icon
          {...testProps('capturedPostBackBtn')}
          onPress={() => showModal(true)}
          type="Entypo"
          name="chevron-thin-left"
          style={{
            position: 'absolute',
            left: 20,
            zIndex: 1000,
            top: RFValue(50),
            fontSize: RFValue(20),
            color: '#fff',
          }}
        />

        <Text
          {...testProps('capturedPostTitle')}
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: RFValue(50),
            fontSize: RFValue(16),
            color: '#fff',
            fontFamily: FontFamily.medium,
          }}>
          Record
        </Text>

        {!editable && (
          <View
            {...testProps('capturedPostTrimVideoIconBtn')}
            style={[styles.roundBtn, { zIndex: 1000, top: hp('7%') }]}>
            <Icon
              onPress={() =>
                navigation.navigate('TrimVideoScreen', {
                  uri: uri,
                  isMuted: muted,
                  songSelected: songSelected,
                })
              }
              type="Feather"
              name={'scissors'}
              style={{ fontSize: 28, color: '#fff' }}
            />
          </View>
        )}

        {!editable && (
          <TouchableHighlight
            {...testProps('capturedPostMusicIconBtn')}
            onPress={() => requestExternalStorage()}
            style={[styles.roundBtn, { top: hp('15%'), zIndex: 1000 }]}>
            <Icon type="Entypo" name={'folder-music'} style={{ fontSize: 28, color: '#fff' }} />
            {/* <Text style={{ fontSize: 28, color: '#fff' }}>T</Text> */}
          </TouchableHighlight>
        )}

        <Animated.View
          {...testProps('capturedPostEditIconBtn')}
          style={[styles.roundBtn, { top: editable ? hp('7%') : hp('23%'), zIndex: 1000 }]}>
          <Icon
            onPress={() => {
              if (duration < 31) {
                setEditable(true);
                setAddTextCheck(!addTextCheck);
              }
              if (!editable) {
                _addText();
              }
            }}
            type="MaterialCommunityIcons"
            name={'format-text'}
            style={{ fontSize: 28, color: '#fff' }}
          />
        </Animated.View>

        {editable && (
          <>
            <View
              style={[
                styles.roundBtn,
                {
                  top: hp(25),
                  zIndex: 1000,
                  transform: Platform.OS === 'ios' ? [{ rotate: '270deg' }] : [{ rotate: '0deg' }],
                  backgroundColor: 'rgba(0,0,0, 0.0)',
                },
              ]}>
              {colorPickerType ? (
                <SliderHuePicker
                  ref={(view) => {
                    // this.sliderHuePicker = view;
                  }}
                  oldColor={
                    textOver[selectedTextIndex]?.fontColor
                      ? textOver[selectedTextIndex].fontColor
                      : 'red'
                  }
                  trackStyle={{
                    height: 9,
                    width: 210,
                    borderColor: 'white',
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                  thumbStyle={{
                    width: 20,
                    height: 20,
                    borderColor: 'white',
                    borderWidth: 1,
                    borderRadius: 10,
                    backgroundColor: textOver[selectedTextIndex]?.fontColor,
                    shadowColor: 'black',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowRadius: 2,
                    shadowOpacity: 0.35,
                  }}
                  useNativeDriver={true}
                  onColorChange={(colorHsvOrRgb, resType) => {
                    // if (resType === 'end') {
                    let color = '';
                    color = tinycolor(colorHsvOrRgb).toHexString();
                    let temp = textOver;
                    temp[selectedTextIndex] = { ...temp[selectedTextIndex], fontColor: color };
                    setTextOver([...temp]);
                    // }
                  }}
                />
              ) : (
                <SliderValuePicker
                  ref={(view) => {
                    // this.sliderHuePicker = view;
                  }}
                  oldColor={
                    textOver[selectedTextIndex]?.fontColor
                      ? textOver[selectedTextIndex].fontColor
                      : 'red'
                  }
                  trackStyle={{
                    height: 9,
                    width: 210,
                    borderColor: 'white',
                    borderWidth: 1,
                    borderRadius: 10,
                  }}
                  thumbStyle={{
                    width: 20,
                    height: 20,
                    borderColor: 'white',
                    borderWidth: 1,
                    borderRadius: 10,
                    backgroundColor: textOver[selectedTextIndex]?.fontColor,
                    shadowColor: 'black',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowRadius: 2,
                    shadowOpacity: 0.35,
                  }}
                  useNativeDriver={true}
                  onColorChange={(colorHsvOrRgb, resType) => {
                    // if (resType === 'end') {
                    let color = '';
                    color = tinycolor(colorHsvOrRgb).toHexString();
                    let temp = textOver;
                    temp[selectedTextIndex] = { ...temp[selectedTextIndex], fontColor: color };
                    setTextOver([...temp]);
                    // }
                  }}
                />
              )}
            </View>
          </>
        )}

        {editable && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: 10,
              height: 50,
              width: 50,
              borderRadius: 100,
              backgroundColor: 'rgba(0,0,0, 0.5)',
              top: hp(25),
              zIndex: 1000,
              transform: Platform.OS === 'ios' ? [{ rotate: '270deg' }] : [{ rotate: '0deg' }],
              backgroundColor: 'rgba(0,0,0, 0.0)',
            }}>
            <Slider
              vertical={Platform.OS === 'ios' ? false : true}
              style={{ height: 12, borderRadius: 6 }}
              trackStyle={{
                height: 9,
                width: 210,
                borderColor: 'white',
                borderWidth: 1,
                borderRadius: 10,
              }}
              // trackImage={trackImage}
              thumbStyle={{
                width: 20,
                height: 20,
                borderColor: 'white',
                borderWidth: 1,
                borderRadius: 10,
                backgroundColor: 'white',
                shadowColor: 'black',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowRadius: 2,
                shadowOpacity: 0.35,
              }}
              minimumValue={10}
              maximumValue={40}
              step={1}
              moveVelocityThreshold={2000}
              useNativeDriver={false}
              value={textOver[selectedTextIndex]?.fontsize}
              onValueChange={(value) => {
                let temp = textOver;
                temp[selectedTextIndex] = { ...temp[selectedTextIndex], fontsize: value };
                setTextOver([...temp]);
              }}
              // onSlidingComplete={(value) => this._onColorChange(value, 'end')}
            />
          </View>
        )}

        {editable && (
          <View
            style={[
              styles.roundBtn,
              {
                left: 14,
                top: hp(45),
                zIndex: 1000,
                // transform: [{ rotate: '90deg' }],
                // backgroundColor: 'rgba(0,0,0, 0.0)',
              },
            ]}>
            <Touch
              onPress={() => {
                let temp = [];
                textOver.filter((i, ind) => {
                  if (ind !== selectedTextIndex) {
                    temp.push(i);
                  }
                });
                setTextOver([...temp]);
              }}>
              <Feather name={'trash-2'} color={'white'} size={22} />
            </Touch>
          </View>
        )}

        {editable && (
          <View
            style={[
              styles.roundBtn,
              {
                top: hp(45),
                zIndex: 1000,
                // transform: [{ rotate: '90deg' }],
                // backgroundColor: 'rgba(0,0,0, 0.0)',
              },
            ]}>
            <Touch
              onPress={() => {
                setColorPickerType(!colorPickerType);
                if (!colorPickerType) {
                  let temp = textOver;
                  temp[selectedTextIndex] = { ...temp[selectedTextIndex], fontColor: 'red' };
                  setTextOver([...temp]);
                } else {
                  let temp = textOver;
                  temp[selectedTextIndex] = { ...temp[selectedTextIndex], fontColor: 'white' };
                  setTextOver([...temp]);
                }
              }}>
              <Image
                {...testProps('capturedPostSoundBtn')}
                source={colorChanger}
                style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }}
              />
            </Touch>
          </View>
        )}

        {!editable && (
          <>
            <View style={[styles.roundBtn, { top: hp('31%'), zIndex: 1000 }]}>
              <Icon
                onPress={() => showEmoji(true)}
                type="Entypo"
                name={'emoji-happy'}
                style={{ fontSize: 28, color: '#fff' }}
              />
            </View>

            <View style={[styles.roundBtn, { top: hp('39%'), zIndex: 1000 }]}>
              <TouchableWithoutFeedback
                onPress={() =>
                  songSelected ? null : noAudio ? showNoAudioToast() : setMute(!muted)
                }>
                <Image
                  {...testProps('capturedPostSoundBtn')}
                  source={muted || noAudio ? muteIcon : unmuteIcon}
                  style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }}
                />
              </TouchableWithoutFeedback>
            </View>
          </>
        )}

        {!editable && (
          <View
            {...testProps('capturedPostEditIconBtn')}
            style={[styles.roundBtn, { top: hp('47%') }]}>
            <Text
              {...testProps('listPostItemVideoTimerPaused')}
              style={{
                color: 'white',
              }}>
              {('0' + Math.floor(minutes)).slice(-2)}:{('0' + Math.floor(sec)).slice(-2)}
            </Text>
          </View>
        )}

        {!isKeyboardVisible && (
          <View style={{ width: '100%', zIndex: 99990, position: 'absolute', bottom: RFValue(50) }}>
            <TouchableWithoutFeedback onPress={() => (processing ? null : proceedToPost())}>
              <LinearGradient
                colors={['#FB6200', '#EF0059']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={styles.loginButton}>
                {/* {processing ? (
                  <ActivityIndicator size={'small'} color={'#fff'} />
                ) : ( */}
                <Text {...testProps('capturedPostNextBtn')} style={styles.whiteColor}>
                  Next
                </Text>
                {/* )} */}
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        )}

        {isAudioToastVisible && (
          <View
            style={{
              position: 'absolute',
              bottom: '15%',
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
            <Text style={{ color: '#fff', fontFamily: FontFamily.medium }}>No Video Sound</Text>
          </View>
        )}

        {emojiShow && (
          <BlurView
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
            blurType="light"
            blurAmount={2}
            reducedTransparencyFallbackColor="white"
          />
        )}

        {emojiShow && (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: wp('100%'),
              height: hp('90%'),
              alignSelf: 'center',
              position: 'absolute',
              top: hp('7%'),
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 99999,
            }}>
            <FlatList
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              showsVerticalScrollIndicator={false}
              numColumns={4}
              contentContainerStyle={{
                paddingTop: hp('5%'),
                paddingBottom: hp('5%'),
                alignItems: 'center',
              }}
              style={{
                height: hp('90%'),
                width: wp('90%'),
                alignSelf: 'center',
              }}
              data={emojis}
              keyExtractor={(item) => item}
              renderItem={renderItem}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default canvas;
