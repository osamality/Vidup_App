import axios from '../../utils/axiosCongif';
import { _Toast } from '../../../src/components';
import videos from '../../../src/screens/dashboard/search/videos';
// import store from '../../configureStore';

export const createPost = (
  uri,
  caption,
  privacy,
  commentsPrivacy,
  allowSharing,
  hasAudio,
  mentionsList,
  vidup_platform,
  weeklyVideo,
) => {
  return (dispatch) => {
    dispatch({
      type: 'Create_Post',
      payload: {
        isRequested: true,
        isSuccess: false,
        isError: false,
      },
    });
    const mediaData = new FormData();
    mediaData.append('media_file', {
      uri: uri,
      name: 'postVideo.mp4',
      type: 'video/mp4',
    });
    mediaData.append('has_audio', hasAudio);
    mediaData.append('vidup_platform', vidup_platform);
    // mediaData.append('user_post', 0);
    axios
      .getInstance()
      .post(`social_service/upload_media/`, mediaData)
      .then(({ data }) => {
        const { code } = data;
        if (code === 200) {
          const formData = new FormData();
          formData.append('description', caption);
          formData.append('vidup_platform', vidup_platform);
          formData.append('privacy_status', privacy);
          formData.append('allow_comments', commentsPrivacy);
          formData.append('allow_sharing', allowSharing);
          formData.append('media_list[0]', data.data.id);
          formData.append('object_name', data.data.object_name);
          if (mentionsList.length > 0) {
            // formData.append(`mentioned_user_list`, mentionsList);
            mentionsList.forEach((i, index) => {
              formData.append(`mentioned_user_list[${index}]`, mentionsList[index]);
            });
          }
          const hashtaglist = caption.match(/#\S+/g) || [];
          if (hashtaglist.length > 0) {
            hashtaglist.forEach((i, index) => {
              formData.append(`hashtag_list[${index}]`, hashtaglist[index]);
            });
          }
          axios
            .getInstance()
            .post(`social_service/create_post_temp/`, formData)
            .then(({ data }) => {
              const { code } = data;
              if (code == 200) {
                if (weeklyVideo != 'weeklyVideo') {
                  axios.getInstance().post(`social_service/post_or_discard/`, {
                    choice: 'discard',
                    weekly_post_id: weeklyVideo,
                  });
                }
                dispatch({
                  type: 'Media_Upload_Status',
                  payload: {
                    isRequested: true,
                    isSuccess: false,
                    isError: false,
                    create_at: new Date(),
                  },
                });
                dispatch({
                  type: 'Create_Post',
                  payload: {
                    isRequested: false,
                    isSuccess: true,
                    isError: false,
                  },
                });
                _Toast('danger', data.message);
                axios
                  .getInstance()
                  .post(`social_service/create_post/`, formData)
                  .then(({ data }) => {})
                  .catch((error) => {
                    console.log('create_post Error ::', error);
                  });
              }
            })
            .catch((error) => {
              dispatch({
                type: 'Create_Post',
                payload: {
                  isRequested: false,
                  isSuccess: false,
                  isError: true,
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
              if (error.response.message) {
                _Toast('danger', error.response.message);
              } else {
                _Toast('danger', 'Something went wrong, Try again later.');
              }
            });
        }
      })
      .catch((error) => {
        console.log('POST: ', error);
        dispatch({
          type: 'Create_Post',
          payload: {
            isRequested: false,
            isSuccess: false,
            isError: true,
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
      });
  };
};

export const getFeedPosts = (pageNo, keyWord = '') => {
  return (dispatch, getState) => {
    const state = getState();
    const previousPosts = state.postsReducer.posts;
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_post/?page=${pageNo}&q=${keyWord}`)
      .then((res) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data, code } = res.data;
        let tempData = data;
        let oldPosts = previousPosts;
        for (i = 0; i < tempData.length; i++) {
          tempData[i]['paused'] = false;
          tempData[i]['muted'] = false;
          tempData[i]['currentTime'] = 0;
          tempData[i]['isBuffering'] = 0;
        }
        if (code === 200) {
          if (pageNo < 2) {
            dispatch({
              type: 'Get_Feed_Posts',
              payload: [...tempData],
            });
          } else {
            let finalPosts = oldPosts.concat(tempData);
            dispatch({
              type: 'Get_Feed_Posts',
              payload: [...finalPosts],
            });
          }
          dispatch({
            type: 'HOME_FEED_EXTRA',
            payload: res.data.extra_data,
          });
          dispatch({
            type: 'Accept_Terms',
            payload: res.data.extra_data.terms_and_condition,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const _expoloreVideos = (keyWord = '', pageNo = 1) => {
  return (dispatch, getState) => {
    const state = getState();
    const previousVideos = state.postsReducer.expoloreVideos;
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(
        `social_service/get_post/?q=${
          keyWord && keyWord.startsWith('#') ? keyWord.replace('#', '%23') : keyWord || ''
        }&page=${pageNo}`,
      )
      .then((res) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data, code, extra_data } = res.data;
        // console.log('EXPLORED VIDEOS: ', res.data);
        let tempData = data;
        let oldVideos = previousVideos;
        for (i = 0; i < tempData.length; i++) {
          tempData[i]['paused'] = false;
          tempData[i]['muted'] = false;
          tempData[i]['currentTime'] = 0;
          tempData[i]['isBuffering'] = 0;
        }
        if (code === 200) {
          if (pageNo < 2) {
            dispatch({
              type: 'EXPLORE_VIDEOS',
              payload: [...tempData],
            });
          } else {
            let finalVideos = oldVideos.concat(tempData);
            dispatch({
              type: 'EXPLORE_VIDEOS',
              payload: [...finalVideos],
            });
          }
          dispatch({
            type: 'EXPLORE_VIDEOS_EXTRA',
            payload: res.data.extra_data,
          });
        } else {
          let finalPosts = previouState.concat(tempData);
          dispatch({
            type: 'EXPLORE_VIDEOS',
            payload: [...finalPosts],
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const _hashVideos = (keyWord = '') => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(
        `social_service/get_post/?q=${
          keyWord?.charCodeAt(0) == 35 ? keyWord.replace('#', '%23') : keyWord
        }`,
      )
      .then((res) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data, code } = res.data;
        let tempData = data;
        for (i = 0; i < tempData.length; i++) {
          tempData[i]['paused'] = false;
          tempData[i]['muted'] = false;
          tempData[i]['currentTime'] = 0;
          tempData[i]['isBuffering'] = 0;
        }
        if (code === 200) {
          keyWord?.charCodeAt(0) == 35 &&
            dispatch({
              type: 'HASH_VIDEOS',
              payload: [...tempData],
            });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const getPersonalPosts = (pageNo, keyWord = '') => {
  return (dispatch, getState) => {
    const state = getState();
    const previousPosts = state.postsReducer.personalPosts;
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_personal_feed/?page=${pageNo}&q=${keyWord}`)
      .then((res) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data, code } = res.data;
        let tempData = data;
        let oldPosts = previousPosts;
        for (i = 0; i < tempData.length; i++) {
          tempData[i]['paused'] = false;
          tempData[i]['muted'] = false;
          tempData[i]['currentTime'] = 0;
          tempData[i]['isBuffering'] = 0;
        }
        if (code === 200) {
          if (pageNo < 2) {
            dispatch({
              type: 'Get_Personal_Posts',
              payload: [...tempData],
            });
          } else {
            let finalPosts = oldPosts.concat(tempData);
            dispatch({
              type: 'Get_Personal_Posts',
              payload: [...finalPosts],
            });
          }
          dispatch({
            type: 'PERSONAL_POSTS_EXTRA',
            payload: res.data.extra_data,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const getUserPosts = (userId) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_personal_feed_other_person/?userId=${userId}`)
      .then((res) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data, code } = res.data;
        let tempData = data;
        for (i = 0; i < tempData.length; i++) {
          tempData[i]['paused'] = false;
          tempData[i]['muted'] = false;
          tempData[i]['currentTime'] = 0;
          tempData[i]['isBuffering'] = 0;
        }
        if (code === 200) {
          dispatch({
            type: 'Get_Personal_Posts',
            payload: data,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const getUserPostsByUserId = (userId) => {
  return axios.getInstance().get(`social_service/get_personal_feed_other_person/?userId=${userId}`);
};

export const getOtherUserProfile = (userId, response) => {
  axios
    .getInstance()
    .get(`social_service/get_personal_feed_other_person/?userId=${userId}`)
    .then((res) => {
      const { data, code } = res.data;
      let tempData = data;
      for (i = 0; i < tempData.length; i++) {
        tempData[i]['paused'] = false;
        tempData[i]['muted'] = false;
        tempData[i]['currentTime'] = 0;
        tempData[i]['isBuffering'] = 0;
      }
      if (code === 200) {
        response(tempData);
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

export const getSavedPosts = () => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_saved_post/`)
      .then((res) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data, code } = res.data;
        let tempData = data;
        for (i = 0; i < tempData.length; i++) {
          tempData[i].post['paused'] = false;
          tempData[i].post['muted'] = false;
          tempData[i].post['currentTime'] = 0;
          tempData[i].post['isBuffering'] = 0;
        }
        if (code === 200) {
          dispatch({
            type: 'Saved_Videos',
            payload: data,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const createPostStatus = (isRequested, isSuccess, isError) => {
  return (dispatch) => {
    dispatch({
      type: 'Create_Post',
      payload: {
        isRequested,
        isSuccess,
        isError,
      },
    });
  };
};

export const mediaUploadStatus = (isRequested, isSuccess, isError) => {
  return (dispatch) => {
    dispatch({
      type: 'Media_Upload_Status',
      payload: {
        isRequested,
        isSuccess,
        isError,
      },
    });
  };
};

export const likePost = (postId) => {
  const formData = new FormData();
  formData.append('post', postId);
  return (dispatch) => {
    axios
      .getInstance()
      .post(`social_service/post_like/`, formData)
      .then(() => {})
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

export const savePost = (postId) => {
  const formData = new FormData();
  formData.append('post', postId);
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`social_service/save_post/`, formData)
      .then((res) => {
        if (res.data.code == '200') {
          _Toast('success', res.data.message);
        }
        dispatch({
          type: 'LOADING',
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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
        _Toast('danger', 'Error saving this video');
      });
  };
};

export const UnsavePost = (postId) => {
  return (dispatch) => {
    let requestParams = {};
    if (postId) {
      requestParams = {
        post: postId,
      };
    }
    dispatch({
      type: 'UnSaved_Videos',
      payload: false,
    });
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .delete(`social_service/unsave_post/`, { params: requestParams })
      .then((res) => {
        if (res.data.code == '200') {
          _Toast('success', res.data.message);
        }
        dispatch({
          type: 'UnSaved_Videos',
          payload: true,
        });
        dispatch({
          type: 'LOADING',
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'UnSaved_Videos',
          payload: false,
        });
        dispatch({
          type: 'LOADING',
          payload: false,
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const reportPost = (postId, reason) => {
  const formData = new FormData();
  formData.append('post', postId);
  formData.append('reason', reason);
  return (dispatch) => {
    axios
      .getInstance()
      .post(`report_service/report_post/`, formData)
      .then((res) => {
        if (res.data.code == '200') {
          _Toast('success', res.data.message);
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
        _Toast('danger', 'Error reporting this video');
      });
  };
};

export const addViewCount = (postId, postIndex) => {
  const formData = new FormData();
  formData.append('post', postId);
  return (dispatch) => {
    axios
      .getInstance()
      .post(`social_service/post_viewed/`, formData)
      .then((res) => {
        if (!res.data.message) {
          dispatch({
            type: 'IS_VIEW_COUNT_UPDATED',
            payload: {
              postId: postId,
              postIndex: postIndex,
              isCountUpdated: true,
            },
          });
        } else {
          dispatch({
            type: 'IS_VIEW_COUNT_UPDATED',
            payload: {
              postId: postId,
              postIndex: postIndex,
              isCountUpdated: false,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'IS_VIEW_COUNT_UPDATED',
          payload: {},
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

export const sharePost = (post) => {
  const formData = new FormData();
  formData.append('post', post.id);
  formData.append('description', post.description);
  formData.append('privacy_status', post.privacy_status);
  formData.append('allow_comments', post.allow_comments);
  formData.append('allow_sharing', post.allow_sharing);
  return (dispatch) => {
    dispatch({
      type: 'Create_Post',
      payload: {
        isRequested: true,
        isSuccess: false,
        isError: false,
      },
    });
    axios
      .getInstance()
      .post(`social_service/share_post/`, formData)
      .then((res) => {
        if (res.data.code == '200') {
          _Toast('success', res.data.message);
          dispatch({
            type: 'Create_Post',
            payload: {
              isRequested: false,
              isSuccess: true,
              isError: false,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'Create_Post',
          payload: {
            isRequested: false,
            isSuccess: false,
            isError: true,
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
      });
  };
};

export const editPost = (post) => {
  const formData = new FormData();
  formData.append('post_id', post.id);
  formData.append('description', post.description);
  formData.append('privacy_status', post.privacy_status);
  formData.append('allow_comments', post.allow_comments);
  formData.append('allow_sharing', post.allow_sharing);
  if (post.mentioned_user_list.length > 0) {
    // formData.append(`mentioned_user_list`, post.mentioned_user_list);
    post.mentioned_user_list.forEach((i, index) => {
      formData.append(`mentioned_user_list[${index}]`, post.mentioned_user_list[index]);
    });
  }
  if (post.remove_hashtag_list.length > 0) {
    post.remove_hashtag_list.forEach((i, index) => {
      formData.append(`remove_hashtag_list[${index}]`, post.remove_hashtag_list[index]);
    });
  }
  if (post.remove_mentioned_user_list.length > 0) {
    post.remove_mentioned_user_list.forEach((i, index) => {
      formData.append(
        `remove_mentioned_user_list[${index}]`,
        post.remove_mentioned_user_list[index],
      );
    });
  }
  const hashtaglist = post.description.match(/#\S+/g) || [];
  if (hashtaglist.length > 0) {
    hashtaglist.forEach((i, index) => {
      formData.append(`hashtag_list[${index}]`, hashtaglist[index]);
    });
  }

  return (dispatch) => {
    dispatch({
      type: 'Create_Post',
      payload: {
        isRequested: true,
        isSuccess: false,
        isError: false,
      },
    });
    axios
      .getInstance()
      .put(`social_service/edit_post/`, formData)
      .then((res) => {
        if (res.data.code == '200') {
          _Toast('success', res.data.message);
          dispatch({
            type: 'Create_Post',
            payload: {
              isRequested: false,
              isSuccess: true,
              isError: false,
            },
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'Create_Post',
          payload: {
            isRequested: false,
            isSuccess: false,
            isError: true,
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
      });
  };
};
export const deletePost = (postId) => {
  return (dispatch) => {
    axios
      .getInstance()
      .delete(`social_service/del_post/?post_id=${postId}`)
      .then((res) => {
        _Toast('danger', `${res.data.message}`);
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
export const getLikedUsersOfPost = (postId) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_post_liked_by/?post=${postId}`)
      .then((res) => {
        let tempArray = [];
        res.data.data.map((elem) => {
          tempArray.push(elem.user);
        });
        dispatch({
          type: 'GET_LIKED_POST_USERS',
          payload: tempArray,
        });
        dispatch({
          type: 'LOADING',
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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
export const getTopVideos = (keyWord) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_top_videos/?q=${keyWord ? keyWord : ''}`)
      .then((res) => {
        const { data, code } = res.data;
        let tempData = data;
        for (i = 0; i < tempData.length; i++) {
          tempData[i]['paused'] = false;
          tempData[i]['muted'] = false;
          tempData[i]['currentTime'] = 0;
          tempData[i]['isBuffering'] = 0;
        }
        if (code === 200) {
          dispatch({
            type: 'Top_Videos',
            payload: data,
          });
        }
        dispatch({
          type: 'LOADING',
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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
export const getTopHashtags = (keyWord) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/top/hashtags/?q=${keyWord.replace('#', '%23')}`)
      .then((res) => {
        const { data, code } = res.data;

        if (code === 200) {
          dispatch({
            type: 'Top_Hashtags',
            payload: data,
          });
        }
        dispatch({
          type: 'LOADING',
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const getHashTags = () => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get('social_service/top/hashtags/')
      .then((res) => {
        const { data, message, status, code } = res.data;
        if (code === 200) {
          dispatch({
            type: 'Hash_tags',
            payload: data,
          });
        }
        dispatch({
          type: 'LOADING',
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const updateFeedPosts = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'Get_Feed_Posts',
      payload: payload,
    });
  };
};

export const unlikePost = (postId) => {
  return (dispatch) => {
    axios
      .getInstance()
      .delete(`social_service/post_like/?post=${postId}`)
      .then(() => {})
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

export const likeComment = (commentId) => {
  const formData = new FormData();
  formData.append('comment', commentId);
  return (dispatch) => {
    axios
      .getInstance()
      .post(`social_service/comment_like/`, formData)
      .then(() => {})
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

export const unlikeComment = (commentId) => {
  return (dispatch) => {
    axios
      .getInstance()
      .delete(`social_service/comment_like/?comment=${commentId}`)

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

export const likeReply = (replyId) => {
  const formData = new FormData();
  formData.append('reply', replyId);
  return (dispatch) => {
    axios
      .getInstance()
      .post(`social_service/reply_like/`, formData)

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

export const unlikeReply = (replyId) => {
  return (dispatch) => {
    axios
      .getInstance()
      .delete(`social_service/reply_like/?reply=${replyId}`)
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

export const commentOnPost = (postId, comment, mentionsList) => {
  const formData = new FormData();
  formData.append('post', postId);
  formData.append('comment', comment);
  if (mentionsList.length > 0) {
    // formData.append(`mentioned_user_list`, mentionsList);
    mentionsList.forEach((i, index) => {
      formData.append(`mentioned_user_list[${index}]`, mentionsList[index]);
    });
  }
  return (dispatch) => {
    dispatch({
      type: 'COMMENT_STATUS',
      payload: false,
    });
    axios
      .getInstance()
      .post(`social_service/post_comment/`, formData)
      .then(() => {
        dispatch({
          type: 'COMMENT_STATUS',
          payload: true,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'COMMENT_STATUS',
          payload: false,
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

export const replyOnComment = (commentId, reply, mentionsList) => {
  const formData = new FormData();
  formData.append('comment', commentId);
  formData.append('reply', reply);
  if (mentionsList.length > 0) {
    // formData.append(`mentioned_user_list`, mentionsList);
    mentionsList.forEach((i, index) => {
      formData.append(`mentioned_user_list[${index}]`, mentionsList[index]);
    });
  }
  return (dispatch) => {
    dispatch({
      type: 'COMMENT_STATUS',
      payload: false,
    });
    axios
      .getInstance()
      .post(`social_service/comment_reply/`, formData)
      .then(() => {
        dispatch({
          type: 'COMMENT_STATUS',
          payload: true,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'COMMENT_STATUS',
          payload: false,
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

export const getRepliesOnComment = (commentId, index) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_reply/?comment=${commentId}`)
      .then((res) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data } = res.data;
        let tempArr = [];
        var a = { id: index };
        var b = { isInvisible: true };
        var c = { repliesData: data };
        var finalObject = Object.assign(a, b, c);
        tempArr.push(finalObject);
        dispatch({
          type: 'Get_Replies_On_Comment',
          payload: tempArr,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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

export const updateReplies = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'Get_Replies_On_Comment',
      payload: payload,
    });
  };
};

export const updateComments = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'Get_Comments_On_Post',
      payload: payload,
    });
  };
};

export const getCommentsOnPost = (postId, pageNo) => {
  console.log('---==', pageNo);
  return (dispatch, getState) => {
    const state = getState();
    const previousComments = state.postsReducer.comments;
    axios
      .getInstance()
      .get(`social_service/get_comment/?post=${postId}&page=${pageNo}`)
      .then((res) => {
        dispatch({
          type: 'COMMENT_STATUS',
          payload: false,
        });
        const { data } = res.data;
        let tempData = data;
        let oldComments = previousComments;
        // dispatch({
        //   type: 'Get_Comments_On_Post',
        //   payload: data,
        // });
        if (pageNo < 2) {
          dispatch({
            type: 'Get_Comments_On_Post',
            payload: [...tempData],
          });
        } else {
          let finalComments = oldComments.concat(tempData);
          dispatch({
            type: 'Get_Comments_On_Post',
            payload: [...finalComments],
          });
        }
        dispatch({
          type: 'GET_COMMENTS_EXTRA',
          payload: res.data.extra_data,
        });
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

export const editComment = (post, type) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    dispatch({
      type: 'COMMENT_STATUS',
      payload: false,
    });
    var promise;
    if (type == 'edit-comment') {
      promise = axios.getInstance().put(`social_service/edit_comment/`, post);
    } else {
      promise = axios.getInstance().put(`social_service/edit/comment_reply/`, post);
    }
    promise
      .then((res) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'COMMENT_STATUS',
          payload: true,
        });
        _Toast('danger', res.data.message);
      })
      .catch((error) => {
        dispatch({
          type: 'COMMENT_STATUS',
          payload: false,
        });
        dispatch({
          type: 'LOADING',
          payload: false,
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
export const deleteComment = (commentId, type) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    dispatch({
      type: 'COMMENT_STATUS',
      payload: false,
    });
    var promise;
    if (type == 'comment') {
      promise = axios.getInstance().delete(`social_service/del/comment/?comment-id=${commentId}`);
    } else {
      promise = axios
        .getInstance()
        .delete(`social_service/del/comment_reply/?comment-reply-id=${commentId}`);
    }
    promise
      .then((res) => {
        dispatch({
          type: 'COMMENT_STATUS',
          payload: true,
        });
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        _Toast('danger', res.data.message);
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'COMMENT_STATUS',
          payload: false,
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

export const fetchPostById = (id) => {
  return axios.getInstance().get(`social_service/get_post/${id}/`);
};

export const getSinglePost = (id) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });

    axios
      .getInstance()
      .get(`social_service/get_post/${id}/`)
      .then((res) => {
        dispatch({
          type: 'Single_Post',
          payload: res.data.data,
        });
        dispatch({
          type: 'LOADING',
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
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
