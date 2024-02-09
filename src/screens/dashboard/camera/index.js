import React, { useRef, useState, useEffect } from 'react';
import {
  Text,
  Pressable,
  StatusBar,
  View,
  BackHandler,
  Image,
  Platform,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Icon } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import { styles } from './styled';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { _Toast, Statusbar } from './../../../components';
import KeepAwake from '@sayem314/react-native-keep-awake';
//import { LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import { useWindowDimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { galleryIcon, cameraFlip } from 'assets';
import testProps from 'locatorId';

const constCameraScreen = ({ navigation }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  var camera;

  const [cameraType, setType] = useState(true);
  const [flash, setFlash] = useState(false);
  const [focused, resetFocus] = useState(true);
  const [recording, setRecording] = useState(false);
  const [canceled, setCancel] = useState(false);
  const [vidupPlatform, setPlatform] = useState(true);

  useEffect(() => {
    // getCameraRatio();

    const unsubscribe = navigation.addListener('blur', () => {
      resetFocus(false);
    });

    const unsubscribe1 = navigation.addListener('focus', () => {
      global.canceled = false;
      resetFocus(true);
    });

    return () => {
      global.canceled = true;
      unsubscribe();
      unsubscribe1();
    };
  }, []);

  const recordVideo = async () => {
    if (camera) {
      camera
        .recordAsync({
          maxDuration: 30,
          quality: RNCamera.Constants.VideoQuality['4:3'],
          //maxFileSize: 4.5*1024*1024,
          videoBitrate: 2 * 1000 * 1000,
          captureAudio: false,
          // fps: 30
          // mute: true 480
        })
        .then((data) => {
          if (global.canceled == false) {
            setRecording(false);
            navigation.navigate('CanvasView', {
              vidupPlatform: true,
              uri: data.uri,
              type: 'video',
            });
          } else {
            _Toast('warning', 'Recording has been cancelled!');
          }
        });
    }
  };

  const stopRecording = () => {
    if (camera) {
      resetFocus(false);
      camera.stopRecording();
      setRecording(false);
    }
  };

  const recordingStarted = () => {
    setRecording(true);
  };

  const openPicker = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then((video) => {
      // navigation.navigate('PostViewScreen', {
      navigation.navigate('CanvasView', {
        duration: video.duration,
        vidupPlatform: false,
        uri: video.path,
        type: 'video',
      });
    });
  };

  return (
    <View style={styles.container}>
      <Statusbar />
      {focused && (
        <RNCamera
          ref={(ref) => (camera = ref)}
          style={styles.preview}
          onRecordingStart={recordingStarted}
          type={cameraType ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
          flashMode={
            flash
              ? recording
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.on
              : RNCamera.Constants.FlashMode.off
          }
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {}}>
          {!recording && (
            <Icon
              onPress={() => navigation.goBack()}
              type="Entypo"
              name="cross"
              style={{
                position: 'absolute',
                left: 20,
                top: 60,
                fontSize: RFValue(20),
                color: '#fff',
              }}
            />
          )}

          <Text
            {...testProps('cameraRecorddingText')}
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              position: 'absolute',
              top: 60,
            }}>
            {recording ? `Recording` : `Record`}
          </Text>
          {!recording && (
            <View style={styles.roundBtn}>
              <TouchableWithoutFeedback onPress={() => setFlash(!flash)}>
                {flash ? (
                  <Image
                    {...testProps('cameraFlashOn')}
                    source={require('../../../assets/images/Flash/Flash2x.png')}
                    style={{
                      width: RFValue(20),
                      height: RFValue(20),
                      resizeMode: 'contain',
                    }}
                  />
                ) : (
                  <Image
                    {...testProps('cameraFlashOff')}
                    source={require('../../../assets/images/Flash/Flash-off2x.png')}
                    style={{
                      width: RFValue(20),
                      height: RFValue(20),
                      resizeMode: 'contain',
                    }}
                  />
                )}
              </TouchableWithoutFeedback>
            </View>
          )}

          {!recording && (
            <View style={[styles.roundBtn, { top: 125 }]}>
              <TouchableWithoutFeedback onPress={() => setType(!cameraType)}>
                <Image
                  {...testProps('cameraFlipBtn')}
                  source={require('../../../assets/images/camera/camerflip.png')}
                  style={{
                    width: RFValue(25),
                    height: RFValue(25),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
          )}

          <View style={styles.bottomView}>
            {recording ? (
              <Pressable underlayColor="none" onPress={stopRecording}>
                <AnimatedCircularProgress
                  size={90}
                  width={8}
                  duration={29000}
                  rotation={0}
                  fill={100}
                  childrenContainerStyle={{ backgroundColor: 'red' }}
                  style={{ marginBottom: 15 }}
                  tintColor="white"
                  onAnimationComplete={() => stopRecording}
                  backgroundColor="gray">
                  {() => <View></View>}
                </AnimatedCircularProgress>
              </Pressable>
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Pressable underlayColor="none" onPress={recordVideo}>
                  <View style={[styles.recordBtn, { marginBottom: 0 }]}></View>
                </Pressable>
                <Text style={{ color: '#ffff', marginTop: RFValue(5) }}>30s</Text>
              </View>
            )}
            <View style={styles.imagesView}>
              <TouchableWithoutFeedback onPress={() => openPicker()}>
                <Image
                  {...testProps('cameraGalleryIconBtn')}
                  source={require('../../../assets/images/camera/galleryIcon.png')}
                  style={{
                    width: RFValue(23),
                    height: RFValue(18),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>
        </RNCamera>
      )}
    </View>
  );
};

export default constCameraScreen;
