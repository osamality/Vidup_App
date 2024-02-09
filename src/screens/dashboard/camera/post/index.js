import React, { useState, useRef, useEffect } from 'react';
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
import { TouchableHighlight, ActivityIndicator, Image, Pressable, Platform } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import Video from 'react-native-video';
import { _Toast, Statusbar, ProfileThumb, _RenderSuggestions } from '../../../../components';
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
  noUserPlaceholder,
  darkUnlockIcon,
  darkCommentIcon,
} from 'assets';
import { Color, FontFamily } from 'constants';
import { RNFFmpegConfig, LogLevel, RNFFmpeg } from 'react-native-ffmpeg';
import RNFetchBlob from 'rn-fetch-blob';
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
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import testProps from 'locatorId';
import { removeAudio, addFilter, _appendAudio } from '../../../../../store/utils/videoProcessing';

//Redux
import {
  createPost,
  mediaUploadStatus,
  sharePost,
  createPostStatus,
} from '../../../../../store/actions/posts';
import { _MentionSearch } from '../../../../../store/actions/follow-following';
import { connect } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from '@react-navigation/native';
import SoundPlayer from 'react-native-sound-player';

const PostScreen = (props) => {
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
  } = props;

  const { type, weeklyVideo } = route.params;

  const [uri, updateUri] = useState(
    route.params?.post ? route.params.post.user_medias[0].media_file : route.params.uri,
  );
  //const [uri, updateUri] = useState(route.params?.post ? route.params.post.user_medias[0].media_file : "file://" + route.params.uri);
  const [caption, setCaption] = useState('');
  const [privacy, setPrivacy] = useState('Public');
  const [commentsPrivacy, setCommentPrivacy] = useState(true);
  const [allowSharing, setSharing] = useState(true);
  const { colors } = useTheme();
  const [processing, setProcess] = useState(false);
  const [duration, setDuration] = useState(0);
  const [songSelected, setSong] = useState(route.params?.voiceOver);
  const songUpdated = useRef(null);
  const [value, setValue] = useState('Hello @[Mary](2)! How are you?');
  const [mentions, setMentions] = useState([]);
  const [perKey, setOldKey] = useState('');
  const [tagged, setTagged] = useState([]);
  const [vidupPlatform, setPlatform] = useState(route.params?.vidupPlatform);
  const [hasAudio, setHasAudio] = useState(
    (route.params?.muted != true && route.params?.noAudio != true) || route.params?.voiceOver
      ? true
      : false,
  );
  const params = route.params.ffmpegParams;

  console.log('Param: ', route.params?.ffmpegParams.emojis);

  const updateState = (val) => {
    songUpdated.current = val;
  };

  useEffect(() => {
    updateState(songSelected);
  }, [songSelected]);

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

  useEffect(() => {
    if (apiResponse.isSuccess) {
      createPostStatus(false, false, false);
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [{ name: 'HomeScreen' }],
        }),
      );
    } else if (apiResponse.isError) {
      _Toast('danger', apiResponse.isError);
      createPostStatus(false, false, false);
    }
  }, [apiResponse]);

  const onPostShare = (post) => {
    let obj = {};
    obj.id = route.params.post.id;
    obj.description = caption;
    obj.privacy_status = privacy.toLowerCase();
    obj.allow_comments = JSON.stringify(commentsPrivacy);
    obj.allow_sharing = JSON.stringify(allowSharing);
    sharePost(obj);
  };

  const _processVideo = () => {
    setProcess(true);
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
          createPost(response.video);
        } else {
          setProcess(false);
          _Toast('danger', 'Error processing Video!');
        }
      },
    );
  };

  const createPost = (videoUri) => {
    var pattern = /(?<original>(?<trigger>.)\[(?<name>([^[]*))]\((?<id>([\d\w-]*))\))/gi;
    var usersTagged = caption.match(pattern);
    let mentionList = [];
    if (usersTagged) {
      usersTagged.forEach((item, index) => {
        mentionList.push(replaceMentionValues(item, ({ id }) => `${id}`));
      });
    }
    const videoPath = decodeURIComponent(videoUri);
    if (route.params?.muted) {
      removeAudio(videoUri, (response) => {
        if (response.returnCode == 0) {
          setProcess(false);
          updateUri(response.video);
          createNewPostDispatch(
            response.video,
            caption,
            privacy.toLowerCase(),
            JSON.stringify(commentsPrivacy),
            JSON.stringify(allowSharing),
            hasAudio,
            mentionList,
            vidupPlatform,
            weeklyVideo,
          );
        } else {
          setProcess(false);
        }
      });
    }
    if (route.params?.voiceOver) {
      _appendAudio(videoPath, route.params?.voiceOver, duration, (response) => {
        if (response.returnCode == 0) {
          setProcess(false);
          updateUri(response.video);
          createNewPostDispatch(
            response.video,
            caption,
            privacy.toLowerCase(),
            JSON.stringify(commentsPrivacy),
            JSON.stringify(allowSharing),
            hasAudio,
            mentionList,
            vidupPlatform,
            weeklyVideo,
          );
        } else {
          setProcess(false);
        }
      });
    }
    if (
      !route.params?.muted &&
      (route.params.voiceOver == null || route.params.voiceOver == undefined)
    ) {
      createNewPostDispatch(
        videoPath,
        caption,
        privacy.toLowerCase(),
        JSON.stringify(commentsPrivacy),
        JSON.stringify(allowSharing),
        hasAudio,
        mentionList,
        vidupPlatform,
        weeklyVideo,
      );
    }
  };

  return (
    <Container>
      <Statusbar />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[styles.topHeader, { backgroundColor: colors.background }]}>
          <TouchableHighlight
            {...testProps('addPostBackBtn')}
            onPress={() => navigation.goBack()}
            underlayColor="none">
            <Icon
              type="Entypo"
              name="chevron-thin-left"
              style={{ fontSize: 20, color: colors.text }}
            />
          </TouchableHighlight>
          <Text style={{ fontFamily: FontFamily.bold, color: colors.text }}>
            {route.params?.post ? 'Shared Post' : 'New Post'}
          </Text>
          {!apiResponse.isRequested && !processing ? (
            <TouchableHighlight
              onPress={() => {
                route.params?.post ? onPostShare() : _processVideo();
              }}
              underlayColor="none">
              <Text
                {...testProps('addPostBtn')}
                style={{ fontFamily: FontFamily.bold, color: colors.text }}>
                Post
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
              {...testProps('addPostMentionInput')}
            />

            {/* <Textarea style={{ marginBottom: 5, color: colors.text }} onChangeText={(text) => setCaption(text)} rowSpan={3} placeholderTextColor='#d0d0d0' placeholder="Write a caption..." /> */}
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
                  uri: route.params?.post
                    ? route.params.post.user_medias[0].media_file
                    : route.params.uri,
                }} // Can be a URL or a local file.
                muted={true}
                preventsDisplaySleepDuringVideoPlayback={false}
                repeat={true}
                resizeMode={'contain'}
                posterResizeMode={'stretch'}
                controls={false}
                paused={true}
                onLoad={(payload) => {
                  setDuration(payload.duration);
                }}
                // onProgress={(payload) => {
                //     if (Math.ceil(payload.currentTime) > duration && Platform.OS == 'android' && route.params?.voiceOver) {
                //         SoundPlayer.seek(0)
                //     }
                // }}
                onEnd={() => (route.params?.voiceOver ? SoundPlayer.seek(0) : null)}
                style={{ width: wp('20%'), height: 90 }}
                {...testProps('addPostVideoPlayer')}
              />
            )}

            {/* <Button onPress={() => CreateThumbnail()} full style={{ backgroundColor: '#404040', height: 35 }}>
                      <Text style={{ fontSize: RFValue(10), color: '#fff' }}>Add Cover</Text>
                  </Button> */}
          </View>
        </View>
        <Container>
          <Content style={{ marginTop: 20, backgroundColor: colors.background }}>
            {!route.params?.post && (
              <ListItem style={{ marginVertical: 5 }} icon>
                <Left>
                  <Image
                    source={colors.background == '#fff' ? unlockIcon : darkUnlockIcon}
                    resizeMode={'contain'}
                    style={{ width: 20, height: 20, marginRight: 5 }}
                  />
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text {...testProps('addPostWhoCanViewText')} style={{ color: colors.text }}>
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
                      <View
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }}>
                        <Text
                          {...testProps('addPostPrivacyModalBtn')}
                          style={{ textAlign: 'center', color: colors.text }}>
                          {privacy}
                        </Text>
                        <Icon
                          style={{ fontSize: RFValue(12), marginLeft: 3, color: colors.text }}
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
                        style={{ marginVertical: RFValue(5) }}
                        onSelect={() => setPrivacy('Private')}>
                        <Text style={{ color: colors.text, paddingLeft: RFValue(15) }}>
                          Private
                        </Text>
                      </MenuOption>
                    </MenuOptions>
                  </Menu>
                </Right>
              </ListItem>
            )}
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
                <Text {...testProps('addPostAllowCommentsText')} style={{ color: colors.text }}>
                  Allow comments
                </Text>
              </Body>
              <Right style={{ borderBottomWidth: 0 }}>
                <Switch
                  {...testProps('addPostAllowCommentsSwitch')}
                  onValueChange={() => setCommentPrivacy(!commentsPrivacy)}
                  value={commentsPrivacy}
                />
              </Right>
            </ListItem>
            {!route.params?.post && (
              <ListItem style={{ marginVertical: 5 }} icon>
                <Left>
                  <Image
                    source={colors.background == '#fff' ? shareIcon : darkShareIcon}
                    resizeMode={'contain'}
                    style={{ width: 20, height: 20, marginRight: 5 }}
                  />
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                  <Text {...testProps('addPostAllowSharingText')} style={{ color: colors.text }}>
                    Allow sharing
                  </Text>
                </Body>
                <Right style={{ borderBottomWidth: 0 }}>
                  <Switch
                    {...testProps('addPostAllowSharingSwitch')}
                    onValueChange={() => setSharing(!allowSharing)}
                    value={allowSharing}
                  />
                </Right>
              </ListItem>
            )}
          </Content>
        </Container>
      </SafeAreaView>
    </Container>
  );
};

function mapStateToProps(state) {
  return {
    apiResponse: state.postsReducer.createPost,
    uploadResponse: state.postsReducer.mediaUpload,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createNewPostDispatch: (
      uri,
      caption,
      privacy,
      commentsPrivacy,
      allowSharing,
      hasAudio,
      tagList,
      vidupPlatform,
      weeklyVideo,
    ) =>
      dispatch(
        createPost(
          uri,
          caption,
          privacy,
          commentsPrivacy,
          allowSharing,
          hasAudio,
          tagList,
          vidupPlatform,
          weeklyVideo,
        ),
      ),
    createPostStatus: (isRequested, isSuccess, isError) =>
      dispatch(createPostStatus(isRequested, isSuccess, isError)),
    mediaUploadStatusDispatch: (isRequested, isSuccess, isError) =>
      dispatch(mediaUploadStatus(isRequested, isSuccess, isError)),
    sharePost: (post) => dispatch(sharePost(post)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostScreen);
