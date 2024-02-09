import React, { useEffect, useState } from 'react';
import { Container, Text, View, Thumbnail, Icon } from 'native-base';
import {
  TouchableHighlight,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styled';
import { Color, FontFamily } from 'constants';
import { getAllUsers } from '../../../../../store/actions/user';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { playIcon, blankImage, darkBlankImage, videoLock } from 'assets';
import testProps from 'locatorId';

//Redux
import { getPersonalPosts } from '../../../../../store/actions/posts';
import { connect } from 'react-redux';

const uri = 'https://facebook.github.io/react-native/docs/assets/favicon.png';
import { FollowUser } from '../../../../../store/actions/follow-following';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import { Touch } from '../../../../components/touch';

const ProfileHome = (props) => {
  const {
    navigation,
    isLoading,
    route,
    updatePersonalPosts,
    personalPosts,
    getPersonalPostsDispatch,
    totalPages,
  } = props;
  const { colors } = useTheme();

  const [selectedPostType, setSelectedPostType] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [page, setPage] = useState(2);

  useEffect(() => {
    setPosts(personalPosts);
    if (selectedPostType === 'All') {
      setPosts(personalPosts);
    } else if (selectedPostType === 'Public') {
      setPosts([]);
      let filteredItems = [];
      personalPosts.filter((item) => {
        if (item.privacy_status === selectedPostType.toLowerCase()) {
          filteredItems.push(item);
        }
      });
      setPosts(filteredItems);
    } else if (selectedPostType === 'Private') {
      setPosts([]);
      let filteredItems = [];
      personalPosts.filter((item) => {
        if (item.privacy_status === selectedPostType.toLowerCase()) {
          filteredItems.push(item);
        }
      });
      setPosts(filteredItems);
    } else {
    }
  }, [personalPosts, selectedPostType]);

  useEffect(() => {
    const unsubscribe1 = navigation.addListener('focus', () => {
      getPersonalPostsDispatch(1);
    });
    return () => {
      unsubscribe1();
    };
  }, []);

  const _loadMore = () => {
    console.log('pagination --- = ', page, totalPages.totalPages);
    if (page < totalPages.totalPages) {
      getPersonalPostsDispatch(page);
      setPage(page + 1);
    }
    setLoadMore(false);
  };

  const goToPost = (item, index) => {
    var tempData = personalPosts;
    if (index > 0) {
      tempData[0] = { ...tempData[0], paused: true };
      updatePersonalPosts(tempData);
    }
    navigation.push('PersonalPostView', {
      posts: tempData,
      post: item,
      index: index,
      origin: 'Profile',
    });
  };

  return (
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
      <View
        style={{
          width: '90%',
          height: '10%',
          flexDirection: 'row',
          alignContent: 'center',
          justifyContent: 'space-between',
          alignSelf: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <Text
          style={{
            color: colors.text,
            fontSize: RFValue(14),
            fontFamily: FontFamily.regular,
            fontWeight: '600',
          }}>
          {selectedPostType}
        </Text>
        <View>
          <Menu>
            <MenuTrigger
              customStyles={{
                triggerText: {
                  color: 'white',
                },
                triggerWrapper: {
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                },
                triggerTouchable: {
                  underlayColor: 'transparent',
                  activeOpacity: 70,
                },
              }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: RFValue(13),
                  marginRight: 5,
                  fontFamily: FontFamily.regular,
                }}>
                {selectedPostType} Videos
              </Text>
              <Icon
                type="AntDesign"
                name="caretdown"
                style={{ fontSize: RFValue(10), color: colors.text }}
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
                onSelect={() => setSelectedPostType('All')}>
                <Text
                  style={{
                    color: colors.text,
                    paddingLeft: RFValue(15),
                  }}>
                  All
                </Text>
              </MenuOption>
              <MenuOption
                style={{ marginVertical: RFValue(5) }}
                onSelect={() => setSelectedPostType('Public')}>
                <Text
                  style={{
                    color: colors.text,
                    paddingLeft: RFValue(15),
                  }}>
                  Public
                </Text>
              </MenuOption>
              <MenuOption
                style={{ marginVertical: RFValue(5) }}
                onSelect={() => setSelectedPostType('Private')}>
                <Text
                  style={{
                    color: colors.text,
                    paddingLeft: RFValue(15),
                  }}>
                  Private
                </Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {!isLoading && posts.length < 1 ? (
          <View
            style={{
              backgroundColor: '#ffffff',
              flex: 1,
              borderTopWidth: colors.background == '#fff' ? 5 : 0,
              borderColor: 'transparent',
            }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
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
                  style={{
                    color: Color.LightGrey1,
                    alignSelf: 'center',
                    marginTop: RFValue(10),
                    fontSize: RFValue(12),
                    fontFamily: FontFamily.regular,
                  }}>
                  {selectedPostType === 'Private'
                    ? 'You do not have any private videos yet.'
                    : 'You do not have any videos yet.'}
                </Text>
              </View>
            </SafeAreaView>
          </View>
        ) : (
          <View>
            {!isLoading ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={3}
                contentContainerStyle={{ paddingBottom: 10 }}
                data={posts}
                extraData={selectedPostType}
                onEndReached={() => _loadMore()}
                onEndReachedThreshold={0.9}
                renderItem={({ item, index, separators }) => {
                  return (
                    <Touch onPress={() => goToPost(item, index)}>
                      <View {...testProps('profileScreenHomeTabPostItem')}>
                        <FastImage
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
                              !item.user_medias.length || item.user_medias[0]?.thumbnail == null
                                ? 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                                : item.user_medias[0]?.thumbnail,
                          }}
                          source={{
                            uri:
                              !item.user_medias.length || item.user_medias[0]?.thumbnail == null
                                ? 'https://i.vimeocdn.com/video/499134794_1280x720.jpg'
                                : item.user_medias[0]?.thumbnail,
                          }}
                          resizeMode={FastImage.resizeMode.stretch}
                        />
                        <Image
                          source={playIcon}
                          style={{
                            width: RFValue(23),
                            height: RFValue(23),
                            position: 'absolute',
                            top: RFValue(8),
                            right: RFValue(8),
                          }}
                        />
                        {item.privacy_status === 'private' && (
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
            ) : (
              <View></View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

function mapStateToProps(state) {
  return {
    users: state.user.users,
    followUserLoader: state.followFollowing.followUserRequestLoader,
    isLoading: state.RequestLoaders.isRequested,
    personalPosts: state.postsReducer.personalPosts,
    totalPages: state.postsReducer.personalPostsExtra,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAllUsers: (uname) => dispatch(getAllUsers(uname)),
    followUser: (email) => dispatch(FollowUser(email)),
    getPersonalPostsDispatch: (page) => dispatch(getPersonalPosts(page)),
    updatePersonalPosts: (payload) =>
      dispatch({
        type: 'Get_Personal_Posts',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileHome);
