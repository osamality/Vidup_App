import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  FlatList,
  ScrollView,
  StatusBar,
  View,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styled';
import Video from 'react-native-video';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { createThumbnail } from 'react-native-create-thumbnail';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Slider from '@react-native-community/slider';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import { useTheme } from '@react-navigation/native';
import { Icon } from 'native-base';
import { FontFamily } from 'constants';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { connect } from 'react-redux';
import { updateWeeklyVideoStatus } from '../../../../../../store/actions/user';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import convertToProxyURL from 'react-native-video-cache';
import { muteIcon, unmuteIcon, playIcon } from 'assets';
import IconV from 'react-native-vector-icons/MaterialIcons';
import { ConfirmationModal, ExportVideoModal } from 'components';
import testProps from 'locatorId';
import RNFetchBlob from 'rn-fetch-blob';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const weeklyVideoViewScreen = (props) => {
  const { navigation, route, isLoading, updateWeeklyVideoStatus, loggedInUser } = props;
  const { colors } = useTheme();
  const { uri, videoData, thumbnails } = route.params;
  let playerRef = useRef(null);
  let videoPlayerRef = useRef(null);
  const [thumbnailsArr, setThumbnail] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [scrollEnabled, setScroll] = useState(true);
  const [sliderRange, setRange] = useState([]);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [thumbnailsReady, setReady] = useState(false);
  const [focused, resetFocus] = useState(true);
  const [isMuted, setIsMuted] = useState(videoData.has_audio ? false : true);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSeek, setSeek] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [sliderOneChanging, setSliderOneChanging] = React.useState(false);
  const [sliderOneValue, setSliderOneValue] = React.useState([5]);
  const [timer, setTimer] = useState(0);
  const [seekTimer, setSeekTimer] = useState(0);
  const [icon, setIcon] = useState();
  const [isAudioToastVisible, setIsAudioToastVisible] = useState(false);
  const [isVisible, showModal] = useState(false);
  const [exporting, setExport] = useState(false);

  useEffect(() => {
    IconV.getImageSource('stop-circle', 15, 'rgba(52, 52, 52, 1)').then(setIcon);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      resetFocus(false);
    });
    const unsubscribe1 = navigation.addListener('focus', () => {
      resetFocus(true);
    });
    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, []);

  const muteUnmute = () => {
    setIsMuted(!isMuted);
  };
  const showNoAudioToast = () => {
    setIsAudioToastVisible(true);
    setTimeout((elem) => {
      setIsAudioToastVisible(false);
    }, 1000);
  };

  const onsubmit = (status) => {
    if (status) {
      updateWeeklyVideoStatus(status, videoData.id);
      setTimeout((elem) => {
        navigation.goBack();
      }, 1000);
    }
  };
  const seekVideo = (value) => {
    setSeekTimer(value);
    videoPlayerRef.seek(value);
    setIsPaused(false);
  };

  const _exportAndShare = () => {
    setExport(true);
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp4',
    })
      .fetch('GET', videoData.media_file, {
        Authorization: `jwt ${loggedInUser.token}`,
      })
      .then((res) => {
        setExport(false);
        navigation.navigate('CanvasView', {
          vidupPlatform: true,
          uri: `file://${res.path()}`,
          type: 'video',
          weeklyVideo: videoData.id,
        });
      })
      .catch((errorMessage, statusCode) => {
        setExport(false);
        // error handling
      });
  };

  var minutes = videoData.duration / 1000 / 60;
  var r = minutes % 1;
  var sec = Math.floor(r * 60);
  if (sec < 10) {
    sec = '0' + sec;
  }
  minutes = Math.floor(minutes);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {exporting && <ExportVideoModal />}
      {/* <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" /> */}
      <View
        style={{
          height: hp('13%'),
          justifyContent: 'space-between',
          padding: wp('4%'),
          alignItems: 'flex-end',
          width: wp('100%'),
          backgroundColor: colors.card,
          flexDirection: 'row',
        }}>
        <Icon
          {...testProps('weeklyVideoViewBackBtn')}
          onPress={() => navigation.goBack()}
          type="Entypo"
          name="chevron-thin-left"
          style={{ fontSize: 20, color: colors.text }}
        />
        <Text style={{ fontSize: RFValue(15), color: colors.text, fontFamily: FontFamily.medium }}>
          {moment(videoData.created_at).format('MMMM DD, YYYY')}
        </Text>
        {!isLoading ? (
          <View style={{ flexDirection: 'row' }}>
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
                  backgroundColor: colors.card,
                }}>
                <MenuOption
                  style={{ marginVertical: RFValue(5) }}
                  onSelect={() => onsubmit('post')}>
                  <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Share</Text>
                </MenuOption>
                <MenuOption
                  style={{ marginVertical: RFValue(5) }}
                  onSelect={() => _exportAndShare()}>
                  <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Edit</Text>
                </MenuOption>
                <MenuOption style={{ marginVertical: RFValue(5) }} onSelect={() => showModal(true)}>
                  <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Delete</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        ) : (
          <ActivityIndicator color={'black'} size={'small'} />
        )}
      </View>

      <View style={{ width: wp('100%'), aspectRatio: 4 / 4 }}>
        {focused && (
          <Video
            source={{
              //uri: convertToProxyURL(uri),
              uri: uri,
              headers: {
                Authorization: `jwt ${loggedInUser.token}`,
              },
            }}
            muted={isMuted}
            preventsDisplaySleepDuringVideoPlayback={false}
            paused={isPaused}
            ref={(ref) => {
              videoPlayerRef = ref;
            }}
            onError={(e)=> console.log("Error: ", e, " URI: ", uri)}
            onProgress={(payload) => {
              setTimer(parseInt(payload.currentTime));
              setSeekTimer(payload.currentTime);
            }}
            resizeMode={'contain'}
            controls={false}
            repeat={true}
            style={styles.videoPlayer}
          />
        )}
        <View style={styles.postOverlay}>
          {isPaused == true ? (
            <TouchableWithoutFeedback
              onPress={() => setIsPaused(false)}
              style={{ justifyContent: 'center', flex: 1 }}>
              <Image
                source={playIcon}
                style={{
                  margin: wp('90%'),
                  width: RFValue(50),
                  height: RFValue(50),
                  resizeMode: 'contain',
                }}
              />
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => setIsPaused(true)}
              style={{ justifyContent: 'center', flex: 1 }}>
              <View style={{ margin: wp('90%'), width: wp('78%'), height: hp('27%') }}></View>
            </TouchableWithoutFeedback>
          )}
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            position: 'absolute',
            bottom: 2,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            zIndex: 100,
          }}>
          {isPaused ? (
            <Icon
              onPress={() => setIsPaused(false)}
              name="play"
              type="Foundation"
              style={{ fontSize: RFValue(20), color: '#fff' }}
            />
          ) : (
            <Icon
              onPress={() => setIsPaused(true)}
              name="pause"
              type="Foundation"
              style={{ fontSize: RFValue(20), color: '#fff' }}
            />
          )}
          <Slider
            style={{ width: '80%', marginRight: 18, zIndex: 9999 }}
            minimumValue={0}
            value={seekTimer}
            tapToSeek={true}
            useNativeDriver={true}
            onSlidingStart={() => setIsPaused(true)}
            onSlidingComplete={(value) => seekVideo(value)}
            maximumValue={videoData.duration / 1000}
            minimumTrackTintColor="rgba(52, 52, 52, 1)"
            maximumTrackTintColor="#d3d3d3"
            thumbImage={icon}
            thumbStyle={{ height: 5, width: 5, borderRadius: 100 }}
          />
          <TouchableWithoutFeedback onPress={videoData.has_audio ? muteUnmute : showNoAudioToast}>
            {isMuted ? (
              <Image
                source={muteIcon}
                style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }}
              />
            ) : (
              <Image
                source={unmuteIcon}
                style={{ width: RFValue(20), height: RFValue(20), resizeMode: 'contain' }}
              />
            )}
          </TouchableWithoutFeedback>
        </View>
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
            <Text style={{ color: '#fff', fontFamily: FontFamily.medium }}>No Video Sound</Text>
          </View>
        )}
      </View>

      <View style={{ alignContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: RFValue(22),
            paddingVertical: RFValue(10),
          }}>
          <Text style={{ color: colors.text, fontFamily: FontFamily.medium }}>
            00:{('0' + Math.floor(seekTimer)).slice(-2)}
          </Text>
          <Text style={{ color: colors.text, fontFamily: FontFamily.medium }}>
            {('0' + Math.floor(minutes)).slice(-2)}:{('0' + Math.floor(sec)).slice(-2)}
          </Text>
        </View>
        <View style={{ marginTop: 15 }}></View>
        {Platform.OS == 'ios' ? (
          <>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              style={{ marginBottom: -36, borderRadius: 5 }}
              contentContainerStyle={{ width: 380 }}
              data={thumbnails}
              extraData={thumbnails}
              keyExtractor={(item) => item.path}
              renderItem={({ item, index, separators }) => (
                <Image
                  style={{ width: 40, height: 65, resizeMode: 'stretch' }}
                  source={{
                    uri: item,
                    headers: {
                      Authorization: `jwt ${loggedInUser.token}`,
                    },
                  }}
                />
              )}
            />
            <ScrollView
              style={[styles.scrollView]}
              contentContainerStyle={styles.scrollViewContent}
              scrollEnabled={false}>
              <MultiSlider
                isMarkersSeparated={true}
                values={[seekTimer]}
                snapped={false}
                sliderLength={350}
                containerStyle={{ height: 63, width: 382 }}
                trackStyle={{ height: 0 }}
                enabledOne={true}
                min={0}
                step={0.1}
                max={30}
                // markerSize={10}
                customMarkerLeft={(e) => {
                  return (
                    <Image
                      defaultSource={require('../../../../../assets/images/weeklyvideoslider.png')}
                      source={require('../../../../../assets/images/weeklyvideoslider.png')}
                      style={{
                        height: 80,
                        marginTop: -13,
                        resizeMode: 'contain',
                        marginLeft: RFValue(15),
                      }}
                    />
                  );
                }}
              />
            </ScrollView>
          </>
        ) : (
          <>
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              style={{ marginBottom: -70, borderRadius: 5 }}
              contentContainerStyle={{ width: 380 }}
              data={thumbnails}
              extraData={thumbnails}
              keyExtractor={(item) => item.path}
              renderItem={({ item, index, separators }) => (
                <Image
                  style={{ width: 40, height: 69, resizeMode: 'stretch' }}
                  source={{
                    uri: item,
                    headers: {
                      Authorization: `jwt ${loggedInUser.token}`,
                    },
                  }}
                />
              )}
            />
            <MultiSlider
              isMarkersSeparated={true}
              values={[seekTimer]}
              snapped={false}
              sliderLength={350}
              containerStyle={{
                height: 72,
                width: 382,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: '#f56942',
              }}
              trackStyle={{ height: 0 }}
              enabledOne={true}
              min={0}
              step={0.1}
              max={30}
              customMarkerLeft={(e) => {
                return (
                  <Image
                    defaultSource={{ uri: 'weeklyvideoslider' }}
                    source={{ uri: 'weeklyvideoslider' }}
                    style={{
                      height: 80,
                      width: 20,
                      marginTop: -15,
                      resizeMode: 'contain',
                      marginLeft: RFValue(15),
                    }}
                    currentValue={e.currentTime}
                  />
                );
              }}
            />
          </>
        )}
      </View>
      <ConfirmationModal
        isVisible={isVisible}
        isLoading={false}
        discriptionText={'Are you sure you want to delete this post ?'}
        actionName="Delete"
        cancellationName="Cancel"
        hideConfirmation={() => showModal(false)}
        onPress={() => onsubmit('discard')}
      />
    </View>
  );
};
function mapStateToProps(state) {
  return {
    isLoading: state.RequestLoaders.isRequested,
    loggedInUser: state.user.user,
    isWeeklyVideoUpdated: state.user.isWeeklyVideoUpdated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateWeeklyVideoStatus: (status, postId) => dispatch(updateWeeklyVideoStatus(status, postId)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(weeklyVideoViewScreen);
