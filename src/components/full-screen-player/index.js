import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Input, Item, Icon } from 'native-base';
import { StyleSheet, View, Text, Platform } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Color } from 'constants';
import testProps from 'locatorId';
import { DarkTheme, useTheme, DefaultTheme } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import { connect } from 'react-redux';
import globalChecks from '../../../store/reducers/global-checks';
import Orientation from 'react-native-orientation-locker';

const FullScreenVideo = ({ loggedInUser, updateOrientation, route, navigation }) => {
  const { colors } = useTheme();
  const [showPassword, setShowPassword] = useState(true);
  const [isMute, setMute] = useState(false);
  const [paused, setPause] = useState(false);
  let playerRef = useRef(null);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      Orientation.lockToLandscapeLeft();
      updateOrientation('landscape');
    });
    const unsubscribe = navigation.addListener('blur', () => {
      Orientation.lockToPortrait();
      updateOrientation('portrait');
    });
    return () => {
      unsubscribe1();
      unsubscribe();
    };
  }, []);

  const _goBack = () => {
    updateOrientation('portrait');
    navigation.goBack();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Video
        source={{
          //uri: convertToProxyURL(route.params?.videoUrl),
          uri: route.params?.videoUrl,
          // headers: {
          //   Authorization: `jwt ${loggedInUser.token}`,
          // },
        }}
        muted={isMute}
        preventsDisplaySleepDuringVideoPlayback={false}
        paused={paused}
        ref={(ref) => {
          playerRef = ref;
        }}
        // onLoadStart={(elem) => {
        //   addViewCountDispatch(item.id, index)
        // }}
        // onEnd={(elem) => {
        //   addViewCountDispatch(item.id, index)
        // }}
        // onLoad={(video) => {
        //   //updatePlayBack(index, video.duration)
        // }}
        // onProgress={(e) => {
        //   setTimer(parseInt(e.currentTime))
        //   setSeek(e.currentTime)
        // }}
        resizeMode={'contain'}
        controls={true}
        repeat={true}
        style={styles.videoPlayer}
      />
      <Icon
        onPress={() => _goBack()}
        name="close-fullscreen"
        type="MaterialIcons"
        style={{
          position: 'absolute',
          top: RFValue(27),
          left: 5,
          fontSize: RFValue(30),
          color: '#fff',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: hp('6%'),
    fontSize: hp('1.7%'),
    paddingLeft: 20,
  },
  videoPlayer: {
    width: '100%',
    height: Platform.OS == 'ios' ? '80%' : '100%',
    backgroundColor: 'black',
    marginVertical: Platform.OS == 'ios' ? 30 : 0,
  },
});

function mapStateToProps(state) {
  return {
    loggedInUser: state.user.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateOrientation: (payload) =>
      dispatch({
        type: 'UPDATE_ORIENTATION',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FullScreenVideo);
