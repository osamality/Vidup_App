const initialState = {
  followersRequest: [],
  followersRequestLoader: {
    requested: false,
    id: '7',
    successed: false,
    error: false,
  },
  followUserRequestLoader: {
    requested: false,
    id: '7',
    successed: false,
    error: false,
  },
  followings: [],
  followers: [],
};

const followFollowingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FollowersRequests':
      return {
        ...state,
        followersRequest: action.payload,
      };
    case 'FollowersRequestsLoader':
      return {
        ...state,
        followersRequestLoader: action.payload,
      };
    case 'FollowUserRequestLoader':
      return {
        ...state,
        followUserRequestLoader: action.payload,
      };
    case 'Followings':
      return {
        ...state,
        followings: action.payload,
      };
    case 'Followers':
      return {
        ...state,
        followers: action.payload,
      };
    case 'CLEAR_FOLLOWING_FOLLOWERS':
      return {
        ...initialState,
      };
    default:
      return state;
  }
};
export default followFollowingReducer;
