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
import { _Toast, Statusbar } from '../../../../components';
import { useTheme } from '@react-navigation/native';
import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import SoundPlayer from 'react-native-sound-player';
import testProps from 'locatorId';
import { _trimVideo, _generateThumbnail } from '../../../../../store/utils/videoProcessing';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const trimVideoScreen = ({ navigation, route }) => {
  const { colors } = useTheme();
  const { uri, type } = route.params;
  let playerRef = useRef(null);
  const [thumbnailsArr, setThumbnail] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [scrollEnabled, setScroll] = useState(true);
  const [sliderRange, setRange] = useState([]);
  const [duration, setDuration] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [thumbnailsReady, setReady] = useState(false);
  const [focused, resetFocus] = useState(true);
  const [songSelected, setSong] = useState(route.params?.songSelected);
  const songUpdated = useRef(null);

  const updateState = (val) => {
    songUpdated.current = val;
  };

  useEffect(() => {
    updateState(songSelected);
  }, [songSelected]);

  useEffect(() => {
    if (route.params?.songSelected) {
    }
    if (route.params?.songSelected) {
      if (Platform.OS == 'android') {
        _attachSoundPlayer('file://' + route.params?.songSelected.fileCopyUri);
      } else {
        _attachSoundPlayer(route.params?.songSelected.uri);
      }
    }
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

    return () => {
      genericBack();
      _onFinishedPlayingSubscription.remove();
      _onFinishedLoadingSubscription.remove();
      _onFinishedLoadingURLSubscription.remove();
      _onFinishedLoadingFileSubscription.remove();
    };
  }, []);

  const _attachSoundPlayer = (url) => {
    try {
      // or play from url
      SoundPlayer.loadUrl(url);
    } catch (e) {}
  };

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

  const _videoLoaded = (videoduration) => {
    if (!thumbnailsReady && videoduration > 0) {
      setDuration(videoduration);
      let maxDuration = videoduration / 1000;
      setRange([0, Math.ceil(maxDuration)]);
      createTimeStamp(videoduration, (response) => {
        generateThumbnails(response, (calback) => {
          setReady(true);
          setLoaded(true);
        });
      });
    }
  };

  const generateThumbnails = (timeStamps, calback) => {
    var temp = thumbnailsArr;
    for (var i = 0; i < timeStamps.length; i++) {
      _generateThumbnail(uri, timeStamps[i], (response)=> {
        if(response[0] == 0){
          //return(response[1])
          temp.push(response[1]);
          setThumbnail([...temp]);
          if (i > 9) {
            calback(temp);
          }
        }else{
          console.log("Error: ", response)
        }
      })
      // createThumbnail({
      //   url: uri,
      //   timeStamp: timeStamps[i],
      // }).then((response) => {
      //   temp.push(response);
      //   setThumbnail([...temp]);
      //   if (i > 9) {
      //     calback(temp);
      //   }
      // });
    }
  };

  const createTimeStamp = (videoduration, response) => {
    if (videoduration > 0) {
      var tempArr = [];
      for (var i = 0; i < 10; i++) {
        tempArr.push(getRandomInt(videoduration));
      }
      tempArr.sort(function (a, b) {
        return a - b;
      });
      response(tempArr);
      tempArr = [];
    }
  };

  const disableScroll = () => {
    setScroll(false);
  };

  const enableScroll = () => {
    setScroll(true);
  };

  const trimVideo = () => {
    setProcessing(true);
    if (sliderRange[1] - sliderRange[0] < 31) {
      _trimVideo(uri, sliderRange, (response)=> {
        if(response.returnCode == 0){
          setProcessing(false);
          navigation.navigate('CanvasView', { uri: response.video, type: type });
        }else{
          setProcessing(true);
        }
      })
    } else {
      setProcessing(false);
      _Toast('danger', 'Please trim your video to 30 seconds or less!');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Statusbar />
      <View
        style={{
          height: hp('13%'),
          justifyContent: 'space-between',
          padding: wp('4%'),
          alignItems: 'flex-end',
          width: wp('100%'),
          backgroundColor: colors.background,
          flexDirection: 'row',
        }}>
        <Text
          {...testProps('cameraTrimCancelBtn')}
          style={{ fontSize: RFValue(14), color: colors.text }}
          onPress={() => navigation.goBack()}>
          Cancel
        </Text>
        <Text
          {...testProps('cameraTrimSaveBtn')}
          style={{ fontSize: RFValue(18), color: colors.text }}>
          Trim
        </Text>
        {!processing ? (
          <Text style={{ fontSize: RFValue(14), color: colors.text }} onPress={() => trimVideo()}>
            Save
          </Text>
        ) : (
          <ActivityIndicator color={colors.primary} size={'small'} />
        )}
      </View>
      <Video
        source={{ uri: uri }}
        muted={route.params?.isMuted || route.params?.songSelected ? true : false}
        preventsDisplaySleepDuringVideoPlayback={false}
        controls={false}
        ref={(ref) => {
          playerRef = ref;
        }}
        repeat={true}
        resizeMode={'stretch'}
        onProgress={(payload) => {
          if (Math.round(payload.currentTime) + 1 >= sliderRange[1]) {
            playerRef.seek(sliderRange[0]);
          }
        }}
        onLoad={(payload) => {
          _videoLoaded(payload.duration * 1000);
        }}
        style={{ width: wp('100%'), height: hp('70%') }}
        {...testProps('cameraTrimVideoPlayer')}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: colors.background,
          height: hp('27%'),
          width: wp('100%'),
        }}>
        {loaded && (
          <View
            style={{
              height: RFValue(90),
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              bottom: RFValue(90),
              backgroundColor: colors.background,
            }}>
            <View
              style={{
                flexDirection: 'row',
                width: '90%',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.32,
                shadowRadius: 5.46,
                elevation: 9,
                justifyContent: 'space-between',
              }}>
              <Text
                {...testProps('cameraTrimVideoStartTime')}
                style={{ fontWeight: 'bold', color: colors.text }}>
                {' '}
                {moment(sliderRange[0] * 1000).format('mm:ss')}{' '}
              </Text>
              <Text
                {...testProps('cameraTrimVideoEndTime')}
                style={{ fontWeight: 'bold', color: colors.text }}>
                {' '}
                {moment(sliderRange[1] * 1000).format('mm:ss')}{' '}
              </Text>
            </View>
            <FlatList
              horizontal={true}
              scrollEnabled={false}
              style={{ paddingHorizontal: 10 }}
              contentContainerStyle={{
                width: 320,
                justifyContent: 'center',
                overflow: 'hidden',
                alignItems: 'flex-end',
              }}
              data={thumbnailsArr}
              extraData={thumbnailsArr}
              keyExtractor={(item) => item}
              renderItem={({ item, index, separators }) => (
                <Image
                  {...testProps('cameraTrimVideoThunbnails')}
                  style={{ width: RFValue(33), height: RFValue(50), resizeMode: 'stretch' }}
                  source={{ uri: item }}
                />
              )}
            />
            <ScrollView
              style={styles.scrollView}
              alwaysBounceVertical={false}
              alwaysBounceHorizontal={false}
              contentContainerStyle={styles.scrollViewContent}
              scrollEnabled={scrollEnabled}>
              <MultiSlider
                isMarkersSeparated={true}
                values={sliderRange}
                snapped={false}
                sliderLength={320}
                min={0}
                containerStyle={{
                  width: 320,
                  height: RFValue(50),
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: '#f56942',
                }}
                trackStyle={{ height: 0 }}
                max={duration / 1000}
                enabledOne={true}
                enabledTwo={true}
                markerSize={10}
                customMarkerLeft={(e) => {
                  return (
                    <Image
                      defaultSource={require('../../../../assets/images/trimHolderLeft.png')}
                      source={require('../../../../assets/images/trimHolderLeft.png')}
                      style={{ width: RFValue(20), height: RFValue(50), resizeMode: 'stretch' }}
                      currentValue={e.currentValue}
                    />
                  );
                }}
                customMarkerRight={(e) => {
                  return (
                    <Image
                      defaultSource={require('../../../../assets/images/trimHolderLeft.png')}
                      source={require('../../../../assets/images/trimHolderRight.png')}
                      style={{ width: RFValue(20), height: RFValue(50), resizeMode: 'stretch' }}
                      currentValue={e.currentValue}
                    />
                  );
                }}
                onValuesChangeStart={(value) => {
                  enableScroll;
                }}
                onValuesChangeFinish={(value) => {
                  if (value[0] == sliderRange[0]) {
                    setRange(value);
                    playerRef.seek(value[1] - 0.5);
                  }
                  if (value[1] == sliderRange[1]) {
                    setRange(value);
                    playerRef.seek(value[0]);
                  }
                  disableScroll;
                }}
              />
            </ScrollView>
          </View>
        )}
        {loaded && (
          <Text style={[styles.btmText, { color: colors.text }]}>
            {' '}
            Tap to hold and drag the trimer to select video{' '}
          </Text>
        )}
        <View
          style={[
            styles.greyBox,
            { backgroundColor: colors.background == '#fff' ? '#EEEEEE' : colors.card },
          ]}>
          <Text {...testProps('cameraTrimVideoStartTime')} style={{ color: colors.text }}>
            {' '}
            {loaded ? moment(sliderRange[0] * 1000).format('mm:ss') : 0}{' '}
          </Text>
        </View>
        <View
          style={[
            styles.greyBox,
            {
              left: wp('33%'),
              backgroundColor: colors.background == '#fff' ? '#EEEEEE' : colors.card,
            },
          ]}>
          <Text {...testProps('cameraTrimVideoEndTime')} style={{ color: colors.text }}>
            {' '}
            {loaded ? moment(sliderRange[1] * 1000).format('mm:ss') : 0}{' '}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default trimVideoScreen;
