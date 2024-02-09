import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Text, View, Thumbnail, Icon } from 'native-base';
import {
  TouchableHighlight,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { styles } from './styled';
import { Link } from 'components';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { getWeeklyVideos } from '../../../../../store/actions/user';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

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
import testProps from 'locatorId';

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
  const { isLoading, weeklyVideo, navigation } = props;
  const { colors } = useTheme();
  // const uri = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
  const [thumbnails, setThumbnails] = useState([]);
  // const [isStillLoading, setIsStillLoading] = useState(false);

  useEffect(() => {
    if (weeklyVideo && Object.keys(weeklyVideo).length > 0) {
      let tempArr = [];
      weeklyVideo.thumbnails.map((elem) => {
        tempArr.push(`${axios.getServerUrl()}${elem}`);
      });
      setThumbnails(tempArr);
    } else {
      setThumbnails([]);
    }
  }, [weeklyVideo]);

  useEffect(() => {
    getWeeklyVideos();
  }, []);

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
      <View style={[styles.wrapper, { backgroundColor: colors.background, flex: 1 }]}>
        {isLoading ? <ActivityIndicator color={colors.text} size="large" /> : null}
        {thumbnails.length <= 0 ? (
          <View
            style={{
              fontSize: 18,
              justifyContent: 'center',
              shadowColor: '#000',
              borderRadius: 3,
              flex: 1,
            }}>
            <Image
              {...testProps('profileWeeklyScreenNoVideosImg')}
              source={colors.background == '#fff' ? blankImage : darkBlankImage}
              style={{ alignSelf: 'center' }}
            />
            <Text
              {...testProps('profileWeeklyScreenNoVideosText')}
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
          <View>
            <View style={{ paddingHorizontal: wp('5%'), marginTop: RFValue(10) }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      backgroundColor: 'red',
                      width: 10,
                      height: 10,
                      borderRadius: 100,
                      marginRight: 5,
                    }}></View>
                  <Text
                    {...testProps('profileWeeklyScreenCreatedAtDateText')}
                    style={{
                      fontSize: RFValue(12),
                      fontFamily: FontFamily.regular,
                      color: colors.text,
                    }}>
                    {weeklyVideo ? moment(weeklyVideo.created_at).format('MMM DD, YYYY') : ''}{' '}
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        fontFamily: FontFamily.bold,
                        color: colors.text,
                      }}>
                      {weeklyVideo ? moment(weeklyVideo.created_at).format('h:mm a') : ''}
                    </Text>
                  </Text>
                </View>

                {/* <View style={{ flexDirection: 'row' }}>
                                    <Icon type="SimpleLineIcons" name='lock' style={{ fontSize: 16, marginRight: 10 }} />
                                    <Menu>
                                        <MenuTrigger>
                                            <Icon type="Entypo" name='dots-three-vertical' style={{ fontSize: 16, color: colors.text }} />
                                        </MenuTrigger>
                                        <MenuOptions optionsContainerStyle={{ marginTop: RFValue(25), padding: 15, width: RFValue(130), marginRight: RFValue(10), backgroundColor: colors.card }}>
                                            <MenuOption style={{ marginVertical: RFValue(5) }} onSelect={() => alert(`save`)} ><Text style={{ color: colors.text }}>Save</Text></MenuOption>
                                            <MenuOption style={{ marginVertical: RFValue(5) }} onSelect={() => alert(`Shared`)} ><Text style={{ color: colors.text }}>Share</Text></MenuOption>
                                            <MenuOption style={{ marginVertical: RFValue(5) }} onSelect={() => alert(`Report`)} ><Text style={{ color: colors.text }}>Report</Text></MenuOption>
                                        </MenuOptions>
                                    </Menu>
                                </View> */}
              </View>

              <View style={{ flexDirection: 'row' }}>
                <View
                  style={{
                    backgroundColor: 'red',
                    width: 2,
                    marginTop: -8,
                    marginLeft: 3.5,
                    height: wp('26%'),
                    marginRight: 5,
                  }}></View>
                <View style={{ marginVertical: 10, marginLeft: 10, height: wp('18%') }}>
                  <TouchableHighlight
                    onPress={() =>
                      navigation.navigate('weeklyVideoViewScreen', {
                        uri: `${axios.getServerUrl()}${weeklyVideo.media_file}`,
                        videoData: weeklyVideo,
                        thumbnails: thumbnails,
                      })
                    }
                    underlayColor="none">
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      scrollEnabled={false}
                      style={{ paddingHorizontal: 10 }}
                      contentContainerStyle={{
                        width: 320,
                        justifyContent: 'center',
                        overflow: 'hidden',
                        alignItems: 'flex-end',
                      }}
                      data={thumbnails}
                      extraData={thumbnails}
                      keyExtractor={(item) => item.path}
                      renderItem={({ item, index, separators }) => (
                        <Image
                          {...testProps('profileWeeklyScreenListImg')}
                          style={{ width: RFValue(33), height: RFValue(50), resizeMode: 'stretch' }}
                          source={{ uri: item }}
                        />
                      )}
                    />
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    weeklyVideo: state.user.user.weeklyVideo,
    isLoading: state.RequestLoaders.isRequested,
    isWeeklyVideoUpdated: state.user.isWeeklyVideoUpdated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWeeklyVideos: () => dispatch(getWeeklyVideos()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WeeklyScreen);
