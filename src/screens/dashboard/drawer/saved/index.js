import React, { useEffect } from 'react';
import { View, Image, FlatList, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Color, FontFamily } from 'constants';
import { RFValue } from 'react-native-responsive-fontsize';
import { Text, Icon } from 'native-base';
import { styles } from './styled';
import { playIcon, blankImage, darkBlankImage, videoLock } from 'assets';
import { connect } from 'react-redux';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useTheme } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import { Topheader, Statusbar, Modalbtn } from '../../../../components';
import { getSavedPosts } from '../../../../../store/actions/posts';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';

const Saved = (props) => {
  const { navigation, savedPosts, isLoading, updateSavedVideosDispatch, user, getSavedPosts } =
    props;
  const { colors } = useTheme();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getSavedPosts();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const goToPost = (index) => {
    if (index > 0) {
      let tempData = savedPosts;
      tempData[0].post = { ...tempData[0].post, paused: true };
      updateSavedVideosDispatch(tempData);
    }
    navigation.push('SavedPostsView', { origin: 'Profile', index: index });
  };

  return (
    <View style={{ backgroundColor: colors.card, flexGrow: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            onPressLeft={() => navigation.goBack()}
            currentIndex={colors.background == '#fff' ? (savedPosts.length > 0 ? 0 : 0) : 1}
            origin={'Saved'}
            showChatIcon={false}
          />
        </View>
        <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
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
                opacity: 0.8,
              }}>
              <ActivityIndicator color={colors.primary} size="small" />
            </View>
          )}
          {savedPosts.length <= 0 ? (
            <View
              style={{
                fontSize: 18,
                justifyContent: 'center',
                borderColor: 'transparent',
                shadowColor: '#000',
                borderTopWidth: 4,
                borderRadius: 3,
                flex: 1,
              }}>
              <Image
                source={colors.background == '#fff' ? blankImage : darkBlankImage}
                style={{ alignSelf: 'center' }}
              />
              <Text
                {...testProps('drawerSavedNovideosText')}
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
            <FlatList
              showsVerticalScrollIndicator={false}
              numColumns={3}
              contentContainerStyle={{ paddingBottom: 10 }}
              data={savedPosts}
              renderItem={({ item, index, separators }) => {
                return (
                  <Touch onPress={() => goToPost(index)}>
                    <View>
                      <FastImage
                        {...testProps('drawerSavedVideoThumbImg')}
                        style={{
                          width: wp('33.70%'),
                          height: wp('33.22%'),
                          resizeMode: 'stretch',
                          borderWidth: 0.5,
                          borderColor: '#fff',
                          marginLeft: -1,
                        }}
                        defaultSource={{
                          uri:
                            !item.post.user_medias.length ||
                            item.post.user_medias[0].thumbnail == null
                              ? 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                              : item.post.user_medias[0].thumbnail,
                          headers: {
                            Authorization: `jwt ${user.token}`,
                          },
                        }}
                        source={{
                          uri:
                            !item.post.user_medias.length ||
                            item.post.user_medias[0].thumbnail == null
                              ? 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                              : item.post.user_medias[0].thumbnail,
                          headers: {
                            Authorization: `jwt ${user.token}`,
                          },
                        }}
                        resizeMode={FastImage.resizeMode.stretch}
                      />
                      <Image
                        {...testProps('drawerSavedVideosPlayIcon')}
                        source={playIcon}
                        style={{
                          width: RFValue(23),
                          height: RFValue(23),
                          position: 'absolute',
                          top: RFValue(8),
                          right: RFValue(8),
                        }}
                      />
                      {item.post.privacy_status === 'private' && (
                        <Image
                          source={videoLock}
                          style={{
                            width: RFValue(20),
                            height: RFValue(20),
                            position: 'absolute',
                            resizeMode: 'contain',
                            bottom: RFValue(10),
                            right: RFValue(8),
                          }}
                        />
                      )}
                    </View>
                  </Touch>
                );
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};
function mapStateToProps(state) {
  return {
    user: state.user.user,
    isLoading: state.RequestLoaders.isRequested,
    savedPosts: state.postsReducer.savedVideos,
  };
}
//navigation.push('SavedPostsView', { origin: 'Profile', post: item.post, index: index })
function mapDispatchToProps(dispatch) {
  return {
    clearStateDispatch: () =>
      dispatch({
        type: 'Clear_Auth',
        payload: {},
      }),
    getSavedPosts: () => dispatch(getSavedPosts()),
    updateSavedVideosDispatch: (payload) =>
      dispatch({
        type: 'Saved_Videos',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Saved);
