import axios from '../../utils/axiosCongif';
import { Toast } from 'native-base';
import { _Toast } from '../../../src/components';

export const FollowerRequests = () => {
  return (dispatch) => {
    axios
      .getInstance()
      .get(`community_service/followers_requests/`)
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          dispatch({
            type: 'FollowersRequests',
            payload: data,
          });
        }
      })
      .catch((error) => {
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
      });
  };
};

export const SendFollowerRequests = (user) => {
  console.log(user);

  return (dispatch) => {
    dispatch({
      type: 'FollowersRequestsLoader',
      payload: { requested: true, successed: false, error: false, id: user.email },
    });
    axios
      .getInstance()
      .post(`community_service/followers_requests/`, { following_email: user.email })
      .then(({ data }) => {
        const { status, code, result } = data;
        if (code === 200) {
          dispatch({
            type: 'ON_FOLLOW_REQUEST_SUCCESS',
            payload: { followingEmail: user.email, id: '' },
          });
          dispatch({
            type: 'FollowersRequestsLoader',
            payload: { requested: false, successed: true, error: false, id: '' },
          });
          _Toast('success', `You've sent follow request to @${user.username}`);
        }
      })
      .catch((error) => {
        dispatch({
          type: 'FollowersRequestsLoader',
          payload: { requested: false, successed: false, error: true, id: '' },
        });
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
        _Toast('danger', 'Something went wrong. Please try again later.');
      });
  };
};

export const AcceptRejectFollowerRequest = (followerEmail, status) => {
  return (dispatch) => {
    dispatch({
      type: 'FollowersRequestsLoader',
      payload: { requested: true, successed: false, error: false },
    });
    axios
      .getInstance()
      .post(`community_service/respond_followers_requests/`, { email: followerEmail, status })
      .then(({ data }) => {
        const { code, result } = data;
        if (code === 200) {
          _Toast('success', `Request ${status} successfully`);
          dispatch({
            type: 'FollowersRequestsLoader',
            payload: { requested: false, successed: true, error: false },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'FollowersRequestsLoader',
          payload: { requested: false, successed: false, error: false },
        });
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
      });
  };
};

export const GetFollowings = (emailOrUserName) => {
  return (dispatch) => {
    axios
      .getInstance()
      .get(`community_service/followings/${emailOrUserName ? `?q=${emailOrUserName}` : ''}`)
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          dispatch({
            type: 'Followings',
            payload: data,
          });
        }
      })
      .catch((error) => {
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
      });
  };
};

export const _MentionSearch = (keyword, callBack) => {
  axios
    .getInstance()
    .get(`community_service/get_followers_followings/${keyword ? `?q=${keyword}` : ''}`)
    .then((response) => {
      const { status, code, data } = response.data;
      if (code === 200) {
        callBack(data.slice(0, 5));
      }
    })
    .catch((error) => {
      if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
        _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
        return;
      }
      if (error.response.status == '401') {
        _Toast('danger', 'Session expired, Please sign in again');
      }
    });
};

export const GetFollowers = (emailOrUserName) => {
  return (dispatch) => {
    axios
      .getInstance()
      .get(`community_service/followers/${emailOrUserName ? `?q=${emailOrUserName}` : ''}`)
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          dispatch({
            type: 'Followers',
            payload: data,
          });
        }
      })
      .catch((error) => {
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
      });
  };
};

export const RemoveFollower = (user) => {
  return (dispatch) => {
    dispatch({
      type: 'FollowersRequestsLoader',
      payload: { requested: true, successed: false, error: false, id: user.email },
    });
    axios
      .getInstance()
      .post(`community_service/remove_follower/`, { follower_email: user.email })
      .then(({ data }) => {
        const { code, result } = data;
        if (code === 200) {
          _Toast('success', `${user.username} is not following you anymore!`);
          dispatch({
            type: 'FollowersRequestsLoader',
            payload: { requested: false, successed: true, error: false, id: '' },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'FollowersRequestsLoader',
          payload: { requested: false, successed: false, error: false, id: '' },
        });
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
        _Toast('danger', 'Something went wrong. Please try again later');
      });
  };
};

export const OtherUserFollowers = (email, searchUser, response) => {
  axios
    .getInstance()
    .get(
      `community_service/other_users_followers/?following_email=${email}&q=${
        searchUser != '' ? `${searchUser}` : ''
      }`,
    )
    .then(({ data }) => {
      const { code, result } = data;
      if (code === 200) {
        response(data.data);
      }
    })
    .catch((error) => {
      if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
        _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
        return;
      }
      if (error.response.status == '401') {
        _Toast('danger', 'Session expired, Please sign in again');
        dispatch({
          type: 'Clear_Auth',
          payload: {},
        });
      }
      return false;
      _Toast('danger', 'Something went wrong. Please try again later');
    });
};

export const OtherUserFollowings = (email, searchUser, response) => {
  axios
    .getInstance()
    .get(
      `community_service/other_users_following/?follower_email=${email}&q=${
        searchUser != '' ? `${searchUser}` : ''
      }`,
    )
    .then(({ data }) => {
      const { code, result } = data;
      if (code === 200) {
        response(data.data);
      }
    })
    .catch((error) => {
      if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
        _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
        return;
      }
      if (error.response.status == '401') {
        _Toast('danger', 'Session expired, Please sign in again');
        dispatch({
          type: 'Clear_Auth',
          payload: {},
        });
      }
      return false;
      _Toast('danger', 'Something went wrong. Please try again later');
    });
};

export const FollowUser = (user) => {
  return (dispatch) => {
    dispatch({
      type: 'FollowersRequestsLoader',
      payload: { requested: true, successed: false, error: false, id: user.email },
    });
    axios
      .getInstance()
      .post(`community_service/follow_user/`, { following_email: user.email })
      .then(({ data }) => {
        const { status, code, result } = data;
        if (code === 200) {
          _Toast('success', `You are now following @${user.username}`);
          dispatch({
            type: 'FollowersRequestsLoader',
            payload: { requested: false, successed: true, error: false, id: '' },
          });

          dispatch({
            type: 'ON_FOLLOW_SUCCESS',
            payload: { followingEmail: user.email, id: '' },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'FollowersRequestsLoader',
          payload: { requested: false, successed: false, error: true, id: '' },
        });
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
        _Toast('danger', 'Something went wrong. Please try again later');
      });
  };
};

export const UnfollowUser = (user) => {
  return (dispatch) => {
    dispatch({
      type: 'FollowUserRequestLoader',
      payload: {
        requested: true,
        id: user.email,
        successed: false,
        error: false,
      },
    });
    axios
      .getInstance()
      .post(`community_service/unfollow_user/`, { following_email: user.email })
      .then(({ data }) => {
        const { status, code, result } = data;
        dispatch({
          type: 'FollowUserRequestLoader',
          payload: {
            requested: false,
            id: '',
            successed: true,
            error: false,
          },
        });
        if (code === 200) {
          _Toast('success', `You are not following @${user.username} anymore!`);
        }
      })
      .catch((error) => {
        dispatch({
          type: 'FollowUserRequestLoader',
          payload: {
            requested: false,
            id: '',
            successed: false,
            error: true,
          },
        });
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
        _Toast('danger', 'Something went wrong. Please try again later');
      });
  };
};
