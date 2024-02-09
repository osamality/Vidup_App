import { View, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useRef } from 'react';
import { styles } from './styled';
import FastImage from 'react-native-fast-image';
import { Topheader } from '../../../../components';
import { likePost, unlikePost } from '../../../../../store/actions/posts';
import { connect } from 'react-redux';
import { playIcon } from 'assets';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import testProps from 'locatorId';
import { Touch } from '../../../../components/touch';

const ViewAllVideos = (props) => {
  let flatListRef = useRef(null);
  const { navigation, route, topVideos, updateTopVideosDispatch, loggedInUser, likePostDispatch } =
    props;
  const { colors } = useTheme();

  const goToPost = (index) => {
    if (index > 0) {
      let tempData = topVideos;
      tempData[0] = { ...tempData[0], paused: true };
      updateTopVideosDispatch(tempData);
    }
    navigation.push('TopVideosView', {
      origin: route.params?.origin == 'TopVideos' ? 'TopVideos' : 'SearchScreen',
      index: index,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }} edges={['top']}>
      <View style={[styles.MainContainer, { backgroundColor: colors.background }]}>
        <View style={{ overflow: 'hidden' }}>
          <Topheader
            currentIndex={colors.background == '#fff' ? 0 : 1}
            origin={'Top Videos'}
            onPressLeft={() => navigation.goBack()}
          />
        </View>
        {/* <View style={[styles.wrapper, { backgroundColor: colors.background }]}> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={3}
          contentContainerStyle={{ paddingBottom: 10 }}
          data={topVideos}
          renderItem={({ item, index, separators }) => (
            <Touch onPress={() => goToPost(index)}>
              <View>
                <FastImage
                  style={{
                    width: wp('33.70%'),
                    height: wp('33.22%'),
                    resizeMode: 'stretch',
                    borderWidth: 0.5,
                    borderColor: '#fff',
                    marginLeft: -1,
                  }}
                  source={{
                    uri: item.user_medias.length
                      ? item.user_medias[0]?.thumbnail
                        ? item.user_medias[0]?.thumbnail
                        : 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                      : 'https://i.vimeocdn.com/video/499134794_1280x720.jpg',
                    headers: {
                      Authorization: `jwt ${loggedInUser.token}`,
                    },
                  }}
                  resizeMode={FastImage.resizeMode.stretch}
                  {...testProps('searchAllVideosThumb')}
                />
                <Image
                  {...testProps('searchAllVideosThumbPlayIcon')}
                  source={playIcon}
                  style={{
                    width: RFValue(23),
                    height: RFValue(23),
                    position: 'absolute',
                    top: RFValue(8),
                    right: RFValue(8),
                  }}
                />
              </View>
            </Touch>
          )}
        />
        {/* </View> */}
      </View>
    </SafeAreaView>
  );
};

function mapStateToProps(state) {
  return {
    topVideos: state.postsReducer.topVideos,
    loggedInUser: state.user.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    likePostDispatch: (postId) => dispatch(likePost(postId)),
    unlikePostDispatch: (postId) => dispatch(unlikePost(postId)),
    _getTopVideos: () => dispatch(getTopVideos()),
    updateTopVideosDispatch: (payload) =>
      dispatch({
        type: 'Top_Videos',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAllVideos);
