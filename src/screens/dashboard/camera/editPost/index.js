import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Icon,
  Textarea,
  Thumbnail,
  Container,
  Header,
  Content,
  Button,
  ListItem,
  Left,
  Body,
  Right,
  Switch,
} from 'native-base';
import { styles } from './styled';
import { TouchableHighlight, ActivityIndicator, Image, StatusBar, Pressable } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Video from 'react-native-video';
import { _Toast, Statusbar, _RenderSuggestions } from '../../../../components';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import {
  commentIcon,
  unlockIcon,
  shareIcon,
  darkShareIcon,
  darkUnlockIcon,
  darkCommentIcon,
  noUserPlaceholder,
} from 'assets';
import { Color, FontFamily } from 'constants';
import testProps from 'locatorId';

//Redux
import {
  createPost,
  mediaUploadStatus,
  sharePost,
  createPostStatus,
  editPost,
  updateFeedPosts,
} from '../../../../../store/actions/posts';
import { connect } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import {
  replaceMentionValues,
  Part,
  mentionRegEx,
  PartType,
  MentionInput,
  Suggestion,
  parseValue,
  isMentionPartType,
} from '../../../../edited-modules/react-native-controlled-mentions';
import { _MentionSearch } from '../../../../../store/actions/follow-following';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import convertToProxyURL from 'react-native-video-cache';

const pattern = /(?<original>(?<trigger>.)\[(?<name>([^[]*))]\((?<id>([\d\w-]*))\))/gi;
const hashpattern = /\B\#\w\w+\b/g;

const EditPostScreen = (props) => {
  const {
    sharePost,
    user,
    apiResponse,
    uploadResponse,
    mediaUploadStatusDispatch,
    createNewPostDispatch,
    createPostStatus,
    route,
    navigation,
    editPost,
    loggedInUser,
    updatePersonalPosts,
    updateSavedVideosDispatch,
    updateTopVideosDispatch,
    updateFeedPostsDispatch,
    personalPosts,
    postsData,
    savedVideos,
    topVideos,
    updateHashVideos,
    hashVideos,
    updateExploredVideos,
    expoloreVideos,
  } = props;

  const { type } = route.params;

  const [uri, updateUri] = useState(
    route.params?.post ? route.params.post.user_medias[0].media_file : 'file://' + route.params.uri,
  );
  const [caption, setCaption] = useState(route.params?.post.description);
  const [previosHash, setPreviousHash] = useState(
    route.params?.post.description.match(hashpattern) || [],
  );
  const [privacy, setPrivacy] = useState('Public');
  const [commentsPrivacy, setCommentPrivacy] = useState(true);
  const [allowSharing, setSharing] = useState(true);
  const { colors } = useTheme();
  const [mentions, setMentions] = useState([]);
  const [tagged, setTagged] = useState([]);
  const [previousMentions, setPrevious] = useState([]);

  useEffect(() => {
    if (apiResponse.isSuccess) {
      createPostStatus(false, false, false);
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } else if (apiResponse.isError) {
      _Toast('danger', apiResponse.isError);
      createPostStatus(false, false, false);
    }
  }, [apiResponse]);

  useEffect(() => {
    setCaption(route.params.post.description);
    setCommentPrivacy(route.params.post.allow_comments);
    setSharing(route.params.post.allow_sharing);
    setPrivacy(route.params.post.privacy_status);

    if (route.params.post.description) {
      let usersTagged = route.params.post.description.match(pattern);
      let mentionedUsers = [];
      if (usersTagged) {
        usersTagged.forEach((item, index) => {
          mentionedUsers.push(Number(replaceMentionValues(item, ({ id }) => `${id}`)));
        });
        setPrevious(mentionedUsers);
      }
    }
  }, []);

  const arr_diff = (arr1, arr2) => {
    let res = [];
    res = arr1.filter((el) => {
      return !arr2.find((obj) => {
        return el === obj;
      });
    });
    return res;
  };

  const onPostUpdate = () => {
    let obj = {};
    obj.id = route.params.post.id;
    obj.description = caption ? caption : '';
    obj.privacy_status = privacy.toLowerCase();
    obj.allow_comments = commentsPrivacy;
    obj.allow_sharing = allowSharing;
    if (caption) {
      let usersTagged = caption.match(pattern);
      let mentionList = [];
      if (usersTagged) {
        usersTagged.forEach((item, index) => {
          mentionList.push(Number(replaceMentionValues(item, ({ id }) => id)));
        });
      }
      obj.mentioned_user_list = mentionList;
      obj.remove_mentioned_user_list =
        previousMentions.length > 0 ? arr_diff(previousMentions, mentionList) : [];
      obj.remove_mentioned_user_list = obj.remove_mentioned_user_list.map((elem) => Number(elem));
    } else {
      obj.mentioned_user_list = [];
      obj.remove_mentioned_user_list = [];
    }
    const savedVideoIndex = savedVideos.findIndex((elem) => elem.post.id == route.params.post.id);
    if (savedVideoIndex >= 0) {
      savedVideos[savedVideoIndex].post = { ...savedVideos[savedVideoIndex].post, ...obj };
      updateSavedVideosDispatch(savedVideos);
    }

    const postDataIndex = postsData.findIndex((elem) => elem.id == route.params.post.id);
    if (postDataIndex >= 0) {
      postsData[postDataIndex] = { ...postsData[postDataIndex], ...obj };
      updateFeedPostsDispatch(postsData);
    }

    const personalPostIndex = personalPosts.findIndex((elem) => elem.id == route.params.post.id);
    if (personalPostIndex >= 0) {
      personalPosts[personalPostIndex] = { ...personalPosts[personalPostIndex], ...obj };
      updatePersonalPosts(personalPosts);
    }

    const topVideoIndex = topVideos.findIndex((elem) => elem.id == route.params.post.id);
    if (topVideoIndex >= 0) {
      topVideos[topVideoIndex] = { ...topVideos[topVideoIndex], ...obj };
      updateTopVideosDispatch(topVideos);
    }

    const hashVideosIndex = hashVideos.findIndex((elem) => elem.id == route.params.post.id);
    if (hashVideosIndex >= 0) {
      hashVideos[hashVideosIndex] = { ...hashVideos[hashVideosIndex], ...obj };
      updateHashVideos(hashVideos);
    }

    const exploredVideosIndex = expoloreVideos.findIndex((elem) => elem.id == route.params.post.id);
    if (exploredVideosIndex >= 0) {
      expoloreVideos[exploredVideosIndex] = { ...expoloreVideos[exploredVideosIndex], ...obj };
      updateHashVideos(expoloreVideos);
    }
    const newHash = caption.match(hashpattern);

    console.log(newHash);

    if (previosHash.length > 0) {
      const res = previosHash.map((i) => {
        return newHash?.includes(i) ? null : i;
      });

      obj.remove_hashtag_list = res.filter((n) => n) || [];
    } else {
      obj.remove_hashtag_list = [];
    }
    editPost(obj);
  };

  const _tagPeople = (user) => {
    let temp = tagged;
    temp.push(user);
    setTagged(temp);
  };

  const renderMentionSuggestions = _RenderSuggestions(
    mentions,
    (returnMentions) => {
      setMentions(returnMentions);
    },
    (returnTagged) => {
      _tagPeople(returnTagged);
    },
  );

  return (
    <Container>
      <Statusbar />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[styles.topHeader, { backgroundColor: colors.background }]}>
          <TouchableHighlight
            {...testProps('editPostBackBtn')}
            onPress={() => navigation.navigate('HomeScreen')}
            underlayColor="none">
            <Icon
              type="Entypo"
              name="chevron-thin-left"
              style={{ fontSize: 20, color: colors.text }}
            />
          </TouchableHighlight>
          <Text style={{ fontFamily: FontFamily.bold, color: colors.text }}>Edit Post</Text>
          {!apiResponse.isRequested ? (
            <TouchableHighlight onPress={onPostUpdate} underlayColor="none">
              <Text
                {...testProps('editPostBtn')}
                style={{ fontFamily: FontFamily.bold, color: colors.text }}>
                Update
              </Text>
            </TouchableHighlight>
          ) : (
            <ActivityIndicator color={colors.primary} size="small" />
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            borderBottomWidth: 1,
            paddingBottom: 15,
            borderBottomColor: colors.background == '#fff' ? '#e4e4e4' : colors.inputBorder,
            paddingHorizontal: 15,
          }}>
          <View style={styles.textArea}>
            <MentionInput
              autoFocus
              value={caption}
              onChange={setCaption}
              placeholderTextColor={colors.background !== '#fff' && Color.LightGrey3}
              partTypes={[
                {
                  trigger: '@',
                  renderSuggestions: renderMentionSuggestions,
                  textStyle: { fontWeight: 'bold', color: Color.Blue },
                  isBottomMentionSuggestionsRender: true,
                  isInsertSpaceAfterMention: true,
                },
                {
                  trigger: '#',
                  textStyle: { fontWeight: 'bold', color: Color.Blue },
                  isInsertSpaceAfterMention: true,
                },
                {
                  pattern:
                    /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/gi,
                  textStyle: { color: Color.Blue },
                },
              ]}
              style={{ marginBottom: 5, maxHeight: 80, color: colors.text }}
              placeholder="Write a caption..."
              {...testProps('editPostMentionInput')}
            />

            <View style={{ marginTop: 30, flexDirection: 'row' }}>
              {/* <Button rounded bordered dark style={{ borderColor: colors.inputBorder, height: 35, backgroundColor: colors.inputInnerColor }}>
                          <Text style={{ fontSize: 13, color: colors.text, textTransform: 'capitalize' }}>#Hashtags</Text>
                      </Button> */}
              <Button
                rounded
                bordered
                dark
                style={{
                  borderColor: colors.inputBorder,
                  height: 35,
                  marginLeft: 5,
                  backgroundColor: colors.inputInnerColor,
                }}>
                <Text
                  {...testProps('addPostTagFirnedBtn')}
                  style={{ fontSize: 13, color: colors.text, textTransform: 'capitalize' }}>
                  @Friends
                </Text>
              </Button>
              <Button
                rounded
                bordered
                dark
                style={{
                  borderColor: colors.inputBorder,
                  height: 35,
                  marginLeft: 5,
                  backgroundColor: colors.inputInnerColor,
                }}>
                <Text
                  {...testProps('addPostTagFirnedBtn')}
                  style={{ fontSize: 13, color: colors.text, textTransform: 'capitalize' }}>
                  #Hashtags
                </Text>
              </Button>
            </View>
          </View>
          <View
            style={{
              borderWidth: 1,
              width: wp('25%'),
              maxHeight: 93,
              alignItems: 'center',
              backgroundColor: colors.background == '#fff' ? 'black' : colors.card,
            }}>
            {type === 'img' ? (
              <Thumbnail
                square
                large
                source={{ uri: uri }}
                style={{ width: '100%', resizeMode: 'contain' }}
              />
            ) : (
              <Video
                source={{
                  //uri: convertToProxyURL(uri),
                  uri: route.params?.post
                    ? route.params.post.user_medias[0].media_file
                    : 'file://' + route.params.uri,
                  headers: {
                    Authorization: `jwt ${loggedInUser.token}`,
                  },
                }} // Can be a URL or a local file.
                muted={true}
                paused={true}
                repeat={true}
                resizeMode={'contain'}
                posterResizeMode={'stretch'}
                controls={false}
                style={{ width: wp('20%'), height: 90 }}
                {...testProps('editPostVideoPlayer')}
              />
            )}
          </View>
        </View>
        <Container>
          <Content style={{ marginTop: 20, backgroundColor: colors.background }}>
            <ListItem style={{ marginVertical: 5 }} icon>
              <Left>
                <Image
                  source={colors.background == '#fff' ? unlockIcon : darkUnlockIcon}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
                <Text {...testProps('editPostWhoCanViewText')} style={{ color: colors.text }}>
                  Who can view this video
                </Text>
              </Body>
              <Right style={{ borderBottomWidth: 0 }}>
                <Menu>
                  <MenuTrigger
                    customStyles={{
                      triggerTouchable: {
                        underlayColor: 'none',
                        activeOpacity: 70,
                      },
                    }}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                      <Text
                        {...testProps('editPostPrivacyModalBtn')}
                        style={{ textAlign: 'center', color: colors.text }}>
                        {privacy?.substr(0, 1).toUpperCase() + privacy?.substr(1).toLowerCase()}
                      </Text>
                      <Icon
                        style={{
                          fontSize: RFValue(12),
                          marginBottom: 3,
                          marginTop: 2,
                          marginLeft: 3,
                          color: colors.text,
                        }}
                        active
                        type="SimpleLineIcons"
                        name="arrow-right"
                      />
                    </View>
                  </MenuTrigger>
                  <MenuOptions
                    optionsContainerStyle={{
                      marginTop: RFValue(20),
                      width: RFValue(150),
                      marginRight: RFValue(10),
                      backgroundColor: colors.card,
                    }}>
                    <MenuOption
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => setPrivacy('Public')}>
                      <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Public</Text>
                    </MenuOption>
                    <MenuOption
                      checked
                      style={{ marginVertical: RFValue(5) }}
                      onSelect={() => setPrivacy('Private')}>
                      <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>Private</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </Right>
            </ListItem>

            <ListItem style={{ marginVertical: 5 }} icon>
              <Left>
                <Image
                  resizeMode={'contain'}
                  source={colors.background == '#fff' ? commentIcon : darkCommentIcon}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
                {/* <Icon type="Feather" name='message-square' /> */}
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
                <Text {...testProps('editPostAllowCommentsText')} style={{ color: colors.text }}>
                  Allow comments
                </Text>
              </Body>
              <Right style={{ borderBottomWidth: 0 }}>
                <Switch
                  {...testProps('editPostAllowCommentsSwitch')}
                  onValueChange={() => setCommentPrivacy(!commentsPrivacy)}
                  value={commentsPrivacy}
                />
              </Right>
            </ListItem>
            <ListItem style={{ marginVertical: 5 }} icon>
              <Left>
                <Image
                  source={colors.background == '#fff' ? shareIcon : darkShareIcon}
                  resizeMode={'contain'}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
              </Left>
              <Body style={{ borderBottomWidth: 0 }}>
                <Text {...testProps('editPostAllowSharingText')} style={{ color: colors.text }}>
                  Allow sharing
                </Text>
              </Body>
              <Right style={{ borderBottomWidth: 0 }}>
                <Switch
                  {...testProps('editPostAllowSharingSwitch')}
                  onValueChange={() => setSharing(!allowSharing)}
                  value={allowSharing}
                />
              </Right>
            </ListItem>
          </Content>
        </Container>
      </SafeAreaView>
    </Container>
  );
};

function mapStateToProps(state) {
  return {
    apiResponse: state.postsReducer.createPost,
    loggedInUser: state.user.user,
    uploadResponse: state.postsReducer.mediaUpload,
    personalPosts: state.postsReducer.personalPosts,
    postsData: state.postsReducer.posts,
    savedVideos: state.postsReducer.savedVideos,
    topVideos: state.postsReducer.topVideos,
    hashVideos: state.postsReducer.hashVideos,
    expoloreVideos: state.postsReducer.expoloreVideos,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createNewPostDispatch: (uri, caption, privacy, commentsPrivacy, allowSharing) =>
      dispatch(createPost(uri, caption, privacy, commentsPrivacy, allowSharing)),
    createPostStatus: (isRequested, isSuccess, isError) =>
      dispatch(createPostStatus(isRequested, isSuccess, isError)),
    mediaUploadStatusDispatch: (isRequested, isSuccess, isError) =>
      dispatch(mediaUploadStatus(isRequested, isSuccess, isError)),
    sharePost: (post) => dispatch(sharePost(post)),
    editPost: (post) => dispatch(editPost(post)),
    updatePersonalPosts: (payload) =>
      dispatch({
        type: 'Get_Personal_Posts',
        payload: payload,
      }),
    updateFeedPostsDispatch: (payload) => dispatch(updateFeedPosts(payload)),
    updateSavedVideosDispatch: (payload) =>
      dispatch({
        type: 'Saved_Videos',
        payload: payload,
      }),
    updateTopVideosDispatch: (payload) =>
      dispatch({
        type: 'Top_Videos',
        payload: payload,
      }),
    updateHashVideos: (payload) =>
      dispatch({
        type: 'HASH_VIDEOS',
        payload: payload,
      }),
    updateExploredVideos: (payload) =>
      dispatch({
        type: 'EXPLORE_VIDEOS',
        payload: payload,
      }),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPostScreen);
