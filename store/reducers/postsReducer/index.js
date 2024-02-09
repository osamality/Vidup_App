const createPost = {
  isRequested: false,
  isSuccess: false,
  isError: false,
};

const mediaUpload = {
  isRequested: false,
  isSuccess: false,
  isError: false,
  create_at: new Date(),
};

const initialState = {
  createPost: createPost,
  posts: [],
  homeFeedExtra: {},
  exploreVideosExtra: {},
  commentsExtra: {},
  personalPostsExtra: {},
  comments: [],
  videoMute: false,
  replies: [],
  mediaUpload: mediaUpload,
  personalPosts: [],
  userPosts: [],
  singlePost: {},
  appIntro: '0',
  topVideos: [],
  hashtags: [],
  tophashtags: [],
  hashVideos: [],
  savedVideos: [],
  sharedVideos: [],
  postLikedUsers: [],
  isUnSavedSuccessfully: false,
  postViewHeight: 0,
  expoloreVideos: [],
  hashtagVideos: [],
  commented: false,
  isViewCountUpdated: {
    postId: null,
    postIndex: null,
    isCountUpdated: false,
  },
};

const postsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'Get_Feed_Posts':
      return {
        ...state,
        posts: action.payload,
        //posts: [...state.posts, ...action.payload]
      };
    case 'EXPLORE_VIDEOS':
      return {
        ...state,
        expoloreVideos: action.payload,
      };
    case 'HASHTAG_VIDEOS':
      return {
        ...state,
        hashtagVideos: action.payload,
      };
    case 'HASH_VIDEOS':
      return {
        ...state,
        hashVideos: action.payload,
      };
    case 'COMMENT_STATUS':
      return {
        ...state,
        commented: action.payload,
      };
    case 'Get_Personal_Posts':
      return {
        ...state,
        personalPosts: action.payload,
      };
    case 'HOME_FEED_EXTRA':
      return {
        ...state,
        homeFeedExtra: action.payload,
      };
    case 'EXPLORED_VIDEOS_EXTRA':
      return {
        ...state,
        expolreVideosExtra: action.payload,
      };
    case 'GET_COMMENTS_EXTRA':
      return {
        ...state,
        commentsExtra: action.payload,
      };
    case 'EXPLORE_VIDEOS_EXTRA':
      return {
        ...state,
        exploreVideosExtra: action.payload,
      };
    case 'PERSONAL_POSTS_EXTRA':
      return {
        ...state,
        personalPostsExtra: action.payload,
      };
    case 'HASHTAG_VIDEOS_EXTRA':
      return {
        ...state,
        personalPostsExtra: action.payload,
      };
    case 'Get_User_Posts':
      return {
        ...state,
        userPosts: action.payload,
      };
    case 'Create_Post':
      return {
        ...state,
        createPost: action.payload,
      };
    case 'Get_Comments_On_Post':
      return {
        ...state,
        comments: action.payload,
      };
    case 'Get_Replies_On_Comment':
      return {
        ...state,
        replies: action.payload,
      };
    case 'App_Intro':
      return {
        ...state,
        appIntro: action.payload,
      };
    case 'Single_Post':
      return {
        ...state,
        singlePost: action.payload,
      };
    case 'Media_Upload_Status':
      return {
        ...state,
        mediaUpload: action.payload,
      };
    case 'Top_Videos':
      return {
        ...state,
        topVideos: action.payload,
      };
    case 'Hash_tags':
      return {
        ...state,
        hashtags: action.payload,
      };
    case 'Top_Hashtags':
      return {
        ...state,
        tophashtags: action.payload,
      };
    case 'Saved_Videos':
      return {
        ...state,
        savedVideos: action.payload,
      };
    case 'Get_Shared_Posts':
      return {
        ...state,
        sharedVideos: action.payload,
      };
    case 'UnSaved_Videos':
      return {
        ...state,
        isUnSavedSuccessfully: action.payload,
      };
    case 'GET_POST_HEIGHT':
      return {
        ...state,
        postViewHeight: action.payload,
      };
    case 'GET_LIKED_POST_USERS':
      return {
        ...state,
        postLikedUsers: action.payload,
      };
    case 'CLEAR_POSTS':
      return {
        ...initialState,
        appIntro: '1',
      };
    case 'IS_VIEW_COUNT_UPDATED':
      return {
        ...state,
        isViewCountUpdated: action.payload,
      };
    case 'IS_VIEW_COUNT_UPDATED_RESET':
      return {
        ...state,
        isViewCountUpdated: action.payload,
      };
    case 'IS_MEDIA_MUTE':
      return {
        ...state,
        videoMute: action.payload,
      };

    default:
      return state;
  }
};

export default postsReducer;
