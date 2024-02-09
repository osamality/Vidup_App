import axios from '../../utils/axiosCongif';
import { Platform } from 'react-native';
import { _Toast } from '../../../src/components';
import { getDeepLink } from '../../../utilities';
import notification from '../../../src/screens/dashboard/notification';

export const Login = (user) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    dispatch({
      type: 'IS_SIGNUP_COMPLETED',
      payload: true,
    });
    axios
      .getInstance()
      .post('user_service/login/', user)
      .then((res) => {
        const { status, message, data, code } = res.data;
        if (code === 200) {
          axios.init(data.token);
          dispatch({
            type: 'LOGIN',
            payload: data,
          });
        }
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'IS_SIGNUP_COMPLETED',
          payload: true,
        });
      })
      .catch((error) => {
        // debugger;
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        if (error.response?.data?.code === 400) {
          const response = error.response.data;
          dispatch({
            type: 'REGISTER',
            payload: response.data,
          });
          dispatch({
            type: 'REGISTER_TEMP',
            payload: response.data,
          });
        }
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response.data.message) {
          _Toast('danger', error.response.data.message);
        } else {
          _Toast('danger', 'Something went wrong. Please try again later.');
        }
      });
  };
};

export const LoginWithGoogle = (authToken, fcmToken) => {
  return (dispatch) => {
    dispatch({
      type: 'SOCIAL_LOGIN',
      payload: { isRequested: true, isSuccess: false, failed: false },
    });
    dispatch({
      type: 'IS_SIGNUP_COMPLETED',
      payload: true,
    });
    const formData = new FormData();
    formData.append('google_code', authToken);
    formData.append('device_token', fcmToken);

    axios
      .getInstance()
      .post('user_service/google-auth/', formData)
      .then((res) => {
        const { status, message, data, code } = res.data;
        console.log(code, ' response: ', data);
        if (code === 200) {
          if (data.first_time_login) {
            dispatch({
              type: 'SOCIAL_LOGIN',
              payload: {
                isRequested: false,
                isSuccess: true,
                failed: false,
                username: data.username,
                email: data.email,
              },
            });
            dispatch({
              type: 'IS_SOCIAL_LOGIN',
              payload: true,
            });
          } else {
            axios.init(data.token);
            dispatch({
              type: 'LOGIN',
              payload: data,
            });
            dispatch({
              type: 'SOCIAL_LOGIN',
              payload: { isRequested: false, isSuccess: false, failed: false },
            });
            dispatch({
              type: 'IS_SOCIAL_LOGIN',
              payload: true,
            });
          }
        }
        if (code === 201) {
          dispatch({
            type: 'SOCIAL_LOGIN',
            payload: {
              username: data.username,
              email: data.email,
            },
          });
          dispatch({
            type: 'REGISTER_TEMP',
            payload: data,
          });
          dispatch({
            type: 'LOGIN',
            payload: data,
          });
          dispatch({
            type: 'IS_SIGNUP_COMPLETED',
            payload: false,
          });
          dispatch({
            type: 'IS_SOCIAL_LOGIN',
            payload: true,
          });
        } else {
          dispatch({
            type: 'IS_SIGNUP_COMPLETED',
            payload: true,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'SOCIAL_LOGIN',
          payload: { isRequested: false, isSuccess: false, failed: true },
        });
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        error?.response?.data?.message === undefined
          ? _Toast('danger', 'Something went wrong.')
          : _Toast('danger', error?.response?.data?.message);
      });
  };
};

export const LoginWithFacebook = (authToken, email, fcmToken) => {
  return (dispatch) => {
    dispatch({
      type: 'SOCIAL_LOGIN',
      payload: { isRequested: true, isSuccess: false, failed: false },
    });
    dispatch({
      type: 'IS_SIGNUP_COMPLETED',
      payload: true,
    });
    const formData = new FormData();
    formData.append('access_token', authToken);
    formData.append('email', email);
    formData.append('device_token', fcmToken);
    axios
      .getInstance()
      .post('user_service/facebook-auth/', formData)
      .then((res) => {
        const { status, message, data, code } = res.data;
        if (code === 200) {
          if (data?.first_time_login) {
            dispatch({
              type: 'SOCIAL_LOGIN',
              payload: {
                isRequested: false,
                isSuccess: true,
                failed: false,
                username: data.username,
                email: data.email,
              },
            });
            dispatch({
              type: 'IS_SOCIAL_LOGIN',
              payload: true,
            });
          } else {
            axios.init(data.token);
            dispatch({
              type: 'LOGIN',
              payload: data,
            });
            dispatch({
              type: 'SOCIAL_LOGIN',
              payload: { isRequested: false, isSuccess: false, failed: false },
            });
            dispatch({
              type: 'IS_SOCIAL_LOGIN',
              payload: true,
            });
          }
        }
        if (code === 201) {
          dispatch({
            type: 'SOCIAL_LOGIN',
            payload: {
              username: data.username,
              email: data.email,
            },
          });
          dispatch({
            type: 'REGISTER_TEMP',
            payload: data,
          });
          dispatch({
            type: 'LOGIN',
            payload: data,
          });
          dispatch({
            type: 'IS_SIGNUP_COMPLETED',
            payload: false,
          });
          dispatch({
            type: 'IS_SOCIAL_LOGIN',
            payload: true,
          });
        } else {
          dispatch({
            type: 'IS_SIGNUP_COMPLETED',
            payload: true,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'SOCIAL_LOGIN',
          payload: { isRequested: false, isSuccess: false, failed: true },
        });
        if (error?.code == 'ECONNABORTED' || error?.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }

        error.response.data.message === undefined
          ? _Toast('danger', 'Something went wrong.')
          : _Toast('danger', error.response.data.message);
      });
  };
};

export const chooseUsername = (username, email) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    axios
      .getInstance()
      .put('user_service/google_user_username/', formData)
      .then((res) => {
        const { status, message, data, code } = res.data;
        if (code === 200) {
          axios.init(data.token);
          dispatch({
            type: 'LOGIN',
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
        _Toast('danger', error?.response?.data?.message);
      });
  };
};

export const signUp = (user) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/register/`, user)
      .then((data) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const status = data.data.code;
        const response = data.data;
        if (status === 200) {
          dispatch({
            type: 'REGISTER',
            payload: response.data,
          });
          dispatch({
            type: 'REGISTER_TEMP',
            payload: response.data,
          });
        } else if (status === 400) {
          const response = data.data;
          dispatch({
            type: 'REGISTER',
            payload: response,
          });
          dispatch({
            type: 'REGISTER_TEMP',
            payload: response,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        if (error.response?.data?.data.signup_status === 4) {
          _Toast('danger', 'This email address is already in use');
          return;
        }
        if (error.response?.data?.code === 400) {
          const response = error.response.data;
          dispatch({
            type: 'REGISTER',
            payload: response.data,
          });
          dispatch({
            type: 'REGISTER_TEMP',
            payload: response.data,
          });
        }
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          throw error;
        }
        if (error.response.data.message) {
          _Toast('danger', error.response.data.message);
        } else {
          _Toast('danger', 'Something went wrong. Please try again later.');
        }
      });
  };
};

export const resendCode = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/resend/verify-code/`, payload)
      .then(({ data }) => {
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const verifyCode = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/verify_code/`, payload)
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const status = data.code;
        const response = data.data;
        dispatch({
          type: 'Verify_Code',
          payload: response,
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const updateUserName = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .put(`user_service/choose_username/${payload.userId}/`, {
        username: payload.username,
      })
      .then(({ data }) => {
        const status = data.code;
        const response = data.data;
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'Update_Username',
          payload: response,
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const updateBirthday = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .put(`user_service/choose_dob/${payload.userId}/`, {
        date_of_birth: payload.dob,
        device_token: payload.device_token,
      })
      .then(({ data }) => {
        const status = data.code;
        const response = data.data;
        axios.init(response.token);
        dispatch({
          type: 'LOGIN',
          payload: response,
        });
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        _Toast('success', 'Your account has been created. Enjoy the VIDUP!');
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const forgotPassword = (email) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/forget_password/`, { email })
      .then(({ data }) => {
        const response = data.data;

        _Toast('success', response.message);
        _Toast('success', 'The 6 digit code has been sent to your email address.');
        dispatch({
          type: 'Forgot_Password',
          payload: { isCodeSent: true, ...response },
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const resetPassword = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/password_reset/`, payload)
      .then(({ data }) => {
        const response = data.data;
        dispatch({
          type: 'Reset_Password',
          payload: { isPasswordChanged: true, ...response },
        });
        dispatch({
          type: 'Clear_Auth',
          payload: {},
        });
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        _Toast('success', 'Your password is changed!');
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const changePassword = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/change_password/`, payload)
      .then(({ data }) => {
        const response = data.data;
        dispatch({
          type: 'Change_Password',
          payload: { isPasswordChanged: true, ...response },
        });
        dispatch({
          type: 'Clear_Auth',
          payload: {},
        });
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        _Toast('success', 'Your password is changed!');
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const fetchUserById = (userId) => {
  return (dispatch) => {
    axios
      .getInstance()
      .get(`user_service/get_users/${userId}/`)
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          dispatch({
            type: 'Fetch_Single_User',
            payload: data,
          });
          dispatch({
            type: 'Visiting_User',
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

export const fetchUser = (username) => {
  return axios.getInstance().get(`user_service/get_users/?user=${username}`);
};
export const getUserById = (id) => {
  return axios.getInstance().get(`user_service/get_users/${id}/`);
};

// getAllUsers

export const getAllUsers = (uname, pageNo, keyWord = '') => {
  return (dispatch, getState) => {
    const state = getState();
    const previousUsers = state.user.users;
    dispatch({
      type: 'LOADING',
      payload: true,
    });

    uname && uname.startsWith('#')
      ? axios
          .getInstance()
          .get(`social_service/search/user/hashtag/?q=${uname.replace('#', '%23')}`)
          .then((response) => {
            dispatch({
              type: 'LOADING',
              payload: false,
            });
            const { status, code, data } = response.data;

            if (code === 200) {
              dispatch({
                type: 'Users',
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
          })
      : axios
          .getInstance()
          .get(`user_service/get_users/?q=${uname || ''}&page=${pageNo}`)
          .then((response) => {
            dispatch({
              type: 'LOADING',
              payload: false,
            });
            const { status, code, data } = response.data;
            let tempData = data;
            let oldUsers = previousUsers;
            if (code === 200) {
              if (pageNo < 2) {
                dispatch({
                  type: 'Users',
                  payload: [...tempData],
                });
              } else {
                let finalUsers = oldUsers.concat(tempData);
                dispatch({
                  type: 'Users',
                  payload: [...finalUsers],
                });
              }
              dispatch({
                type: 'Search_Users_Extra',
                payload: response.data.extra_data,
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

export const updateUser = (user, previousUser) => {
  let userCopy = {
    name: user.name.trim(' '),
    gender: user.gender,
    bio: user.bio,
    username: user.username,
    phone_number: user.phone_number ? user.phone_number : '',
    email: user.email,
    country_code: user.phone_number ? user.country_code : '',
    calling_Code: user.phone_number ? user.calling_Code : '',
    is_private: user.is_private,
    date_of_birth: user.date_of_birth,
  };
  if (user.email == previousUser.email) {
    delete userCopy.email;
  }
  if (user.username == previousUser.username) {
    delete userCopy.username;
  }

  return (dispatch) => {
    axios
      .getInstance()
      .put(`user_service/manage_profile/`, userCopy)
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          if (data.email != previousUser.email && previousUser.email != undefined) {
            dispatch({
              type: 'Clear_Auth',
              payload: {},
            });
          }
          dispatch({
            type: 'Update_User',
            payload: {
              user: data,
              status: {
                isSuccess: true,
                isError: false,
                isRequested: false,
              },
            },
          });
          dispatch({
            type: 'Visiting_User',
            payload: data,
          });
          _Toast('success', 'Your profile is updated!');
        }
      })
      .catch((error) => {
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response?.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
        if (error.response.data.message) {
          _Toast('danger', error.response.data.message);
          return;
        }
        if (error.response.data.message.name[0]) {
          _Toast('danger', error.response.data.message.name[0]);
          return;
        }
        _Toast('danger', 'Something Went Wrong. Please try again later');
      });
  };
};

export const updatePrivateMode = (user, previousUser) => {
  let userCopy = {
    // name: user.name.trim(' '),
    gender: user.gender,
    bio: user.bio,
    username: user.username,
    phone_number: user.phone_number,
    email: user.email,
    country_code: user.country_code,
    calling_Code: user.calling_Code,
    is_private: user.is_private,
    is_video_view_count: user.is_video_view_count,
    tag_in_post: user.tag_in_post,
  };
  if (user.email == previousUser.email) {
    delete userCopy.email;
  }
  if (user.username == previousUser.username) {
    delete userCopy.username;
  }

  return (dispatch) => {
    axios
      .getInstance()
      .put(`user_service/manage_profile/`, userCopy)
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          if (data.email != previousUser.email && previousUser.email != undefined) {
            dispatch({
              type: 'Clear_Auth',
              payload: {},
            });
          }
          dispatch({
            type: 'Update_User',
            payload: {
              user: data,
              status: {
                isSuccess: true,
                isError: false,
                isRequested: false,
              },
            },
          });
          dispatch({
            type: 'Visiting_User',
            payload: data,
          });
          _Toast('success', 'Your profile private mode updated');
        }
      })
      .catch((error) => {
        if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
          _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
          return;
        }
        if (error.response?.status == '401') {
          _Toast('danger', 'Session expired, Please sign in again');
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
        }
        if (error.response?.data?.code == '400') {
          _Toast('danger', error.response.data.message.name[0]);
          return;
        }
        _Toast('danger', 'Something Went Wrong.Please try again later');
      });
  };
};

export const updateProfilePic = (payload) => {
  let imgFormat = payload.path.substring(payload.path.lastIndexOf('.') + 1);
  const formData = new FormData();
  formData.append('profile_pic', {
    uri: Platform.OS == 'ios' ? payload.uri : 'file://' + payload.path,
    name: Platform.OS == 'ios' ? payload.name.toLowerCase() : payload.name.toLowerCase(),
    type: 'image/' + imgFormat,
  });
  return (dispatch, getState) => {
    const state = getState();
    const user = state.user.user;
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .put(`user_service/profile_pic/`, formData)
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { status, code, result } = data;
        if (code === 200) {
          let temp = user;
          temp = {
            ...temp,
            profile_pic: Platform.OS == 'ios' ? payload.uri : 'file://' + payload.path,
          };
          dispatch({
            type: 'LOGIN',
            payload: temp,
          });
          _Toast('success', 'Your profile picture is updated!');
          // dispatch({
          //   type: 'Update_User',
          //   payload: {
          //     user: result,
          //     status: {
          //       isSuccess: true,
          //       isError: false,
          //       isRequested: false,
          //     },
          //   },
          // });
        }
      })
      .catch((error) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        if (error.response.data && error.response.data.message) {
          _Toast('danger', error.response.data.message);
          return;
        }
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

export const createPost = (uri, caption, privacy, commentsPrivacy, allowSharing) => {
  const formData = new FormData();
  formData.append('user_medias[0].media_file', {
    uri: uri,
    name: 'postImage',
    type: 'images/jpg',
  });
  formData.append('description', caption);
  formData.append('privacy_status', privacy);
  formData.append('allow_comments', commentsPrivacy);
  formData.append('allow_sharing', allowSharing);
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`social_service/create_post/`, formData)
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { status, code, result } = data;
        if (code === 200) {
          _Toast('success', 'Your video has been uploaded!');
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

export const getFeedPosts = () => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_post/`)
      .then((response) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { status, code, data } = response.data;
        dispatch({
          type: 'Get_Feed_Posts',
          payload: data,
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

export const fetchUserNotifications = (notificationType) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    let requestParams = {};
    if (notificationType) {
      requestParams = {
        type: notificationType,
      };
    }
    axios
      .getInstance()
      .get(`notification_service/notifications_history/`, {
        params: requestParams,
      })
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          dispatch({
            type: 'Fetch_User_Notifications',
            payload: data,
          });
          dispatch({
            type: 'LOADING',
            payload: false,
          });
          dispatch({
            type: 'Update_Weekly_Videos',
            payload: false,
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
export const fetchUserNotificationsCount = () => {
  return (dispatch) => {
    axios
      .getInstance()
      .get(`notification_service/notifications_count/`)
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          dispatch({
            type: 'Notification_Count',
            payload: data.count ? data.count : 0,
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
export const setNotificationCount = () => {
  return (dispatch) => {
    axios
      .getInstance()
      .post(`notification_service/notifications_count_reset/`, { count: 0 })
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          dispatch({
            type: 'Notification_Count',
            payload: data.count ? data.count : 0,
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

export const getWeeklyVideos = () => {
  return (dispatch) => {
    dispatch({
      type: 'WEEKLY_LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`social_service/get_weekly_video/`, {})
      .then((response) => {
        dispatch({
          type: 'WEEKLY_LOADING',
          payload: false,
        });
        let tempObj = {
          weeklyVideos: response.data.data,
          weekly_video_creation: response.data.weekly_video_creation,
          message: '',
        };
        dispatch({
          type: 'Fetch_Weekly_Videos',
          payload: { weeklyVideo: tempObj },
        });
        dispatch({
          type: 'Update_Weekly_Videos',
          payload: false,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'WEEKLY_LOADING',
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
export const updateWeeklyVideoStatus = (status, postId) => {
  return (dispatch) => {
    dispatch({
      type: 'WEEKLY_LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`social_service/post_or_discard/`, {
        choice: status,
        weekly_post_id: postId,
      })
      .then(({ data }) => {
        const response = data.data;
        dispatch({
          type: 'WEEKLY_LOADING',
          payload: false,
        });
        _Toast('success', `Your weekly video is ${status}ed!`);
      })
      .catch((error) => {
        dispatch({
          type: 'WEEKLY_LOADING',
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

export const generateWeeklyVideo = () => {
  return (dispatch) => {
    dispatch({
      type: 'GENERATE_WEEKLY_LOADING',
      payload: true,
    });
    dispatch({
      type: 'GENERATING_WEEKLY_LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`social_service/generate/weekly-video/temp`)
      .then((response) => {
        dispatch({
          type: 'GENERATE_WEEKLY_LOADING',
          payload: false,
        });
        _Toast('success', `${response.data.message}`);
        axios
          .getInstance()
          .post(`social_service/generate/weekly-video/`)
          .then((response) => {
            dispatch({
              type: 'GENERATING_WEEKLY_LOADING',
              payload: false,
            });
          })
          .catch((error) => {
            dispatch({
              type: 'GENERATE_WEEKLY_LOADING',
              payload: false,
            });
          });
      })
      .catch((error) => {
        dispatch({
          type: 'GENERATE_WEEKLY_LOADING',
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

export const acceptTerms = () => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .put(`user_service/update_privacy_policy/`, { terms_and_condition: true })
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'Accept_Terms',
          payload: true,
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const verifyAccountRequest = (payload) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/account/verification/`, payload)
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'Verify_Account',
          payload: data,
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const changeEmailRequest = (payload) => {
  const formData = new FormData();
  formData.append('email', payload.email);
  formData.append('password', payload.password);

  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .put(`user_service/account/email/edit/`, formData)
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'CHANGE_EMAIL_REQUEST',
          payload: true,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'CHANGE_EMAIL_REQUEST',
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const verifyEmailCode = (payload, user) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/verify_code/`, payload)
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });

        let userCopy = {
          name: user.name.trim(' '),
          gender: user.gender,
          bio: user.bio,
          username: user.username,
          phone_number: user.phone_number ? user.phone_number : null,
          email: user.email,
          country_code: user.phone_number ? user.country_code : null,
          calling_Code: user.phone_number ? user.calling_Code : null,
          is_private: user.is_private,
          date_of_birth: user.date_of_birth,
        };
        delete userCopy.username;
        axios
          .getInstance()
          .put(`user_service/manage_profile/`, userCopy)
          .then((response) => {
            const { status, code, data } = response.data;
            if (code === 200) {
              dispatch({
                type: 'Update_User',
                payload: {
                  user: data,
                  status: {
                    isSuccess: true,
                    isError: false,
                    isRequested: false,
                  },
                },
              });
              dispatch({
                type: 'Visiting_User',
                payload: data,
              });
              dispatch({
                type: 'CHANGE_EMAIL_REQUEST',
                payload: false,
              });
              _Toast('success', 'Your profile is updated!');
            }
          })
          .catch((error) => {
            if (error.code == 'ECONNABORTED' || error.message == 'Network Error') {
              _Toast('danger', 'Error connecting to VIDUP Server. Please try again!');
              return;
            }
            if (error.response?.status == '401') {
              _Toast('danger', 'Session expired, Please sign in again');
              dispatch({
                type: 'Clear_Auth',
                payload: {},
              });
            }
            if (error.response.data.message) {
              _Toast('danger', error.response.data.message);
              return;
            }
            if (error.response.data.message.name[0]) {
              _Toast('danger', error.response.data.message.name[0]);
              return;
            }
            _Toast('danger', 'Something Went Wrong. Please try again later');
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
        _Toast('danger', error.response.data.message);
      });
  };
};

export const verifyAccountCheck = () => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .get(`user_service/account/verification/`)
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'Verify_Account',
          payload: data,
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
        // _Toast('danger', error.response.data.message);
      });
  };
};

export const deActivateAccount = (password) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .patch(`user_service/account/de-active/`, { password })
      .then((response) => {
        const { status, code, data } = response.data;
        if (code === 200) {
          dispatch({
            type: 'LOADING',
            payload: false,
          });
          dispatch({
            type: 'Clear_Auth',
            payload: {},
          });
          _Toast('success', response.data.message);
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
        setTimeout(() => {
          _Toast('danger', error.response.data.message);
        }, 1200);
      });
  };
};

export const getTopUsers = (keyWord) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });

    axios
      .getInstance()
      .get(`community_service/top-users/?q=${keyWord ? keyWord : ''}`, {})
      .then((response) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data } = response.data;
        dispatch({
          type: 'Fetch_Top_Users',
          payload: data,
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

export const getAllTopUsers = () => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });

    axios
      .getInstance()
      .get(`community_service/top-users/`, {})
      .then((response) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data } = response.data;
        dispatch({
          type: 'Fetch_Top_Users',
          payload: data,
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

export const getNotificationSettings = () => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });

    axios
      .getInstance()
      .get(`notification_service/push-notifications/settings/`, {})
      .then((response) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        const { data } = response.data;
        dispatch({
          type: 'Notification_Settings',
          payload: data,
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

export const readAllNotifications = () => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .put(`notification_service/read_all_notification/`, {})
      .then((res) => {
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

export const updateNotificationSettings = (settings) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });

    axios
      .getInstance()
      .post(`notification_service/push-notifications/settings/`, settings)
      .then((response) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        _Toast('danger', response.data.message);
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
export const updateNotificationStatus = (notificationId) => {
  return (dispatch) => {
    axios
      .getInstance()
      .put(`notification_service/read_notification/`, {
        notification_id: notificationId,
        status: 'read',
      })
      .then((response) => {})
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

export const saveSupportTicket = (supportInformation, callback) => {
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`support_service/support/`, supportInformation)
      .then((response) => {
        callback();
        _Toast('danger', response.data.message);
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
        if (error.response.data.message) {
          _Toast('danger', error.response.data.message);
        }
      });
  };
};

export const validateUserName = (payload) => {
  return axios.getInstance().put(`user_service/choose_username/${payload.userId}/`, {
    username: payload.username,
  });
};
export const validateSocialUsername = (username, email) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  return axios
    .getInstance()
    .put('user_service/google_user_username/?social_username_given=True', formData);
};
export const fetchUserNameSuggestions = (username) => {
  return axios.getInstance().post(`user_service/suggest/username/`, { user_name: username });
};

export const _Logout = (payload) => {
  const formData = new FormData();
  formData.append('device_token', payload);
  return (dispatch) => {
    dispatch({
      type: 'LOADING',
      payload: true,
    });
    axios
      .getInstance()
      .post(`user_service/logout/`, formData)
      .then(({ data }) => {
        dispatch({
          type: 'LOADING',
          payload: false,
        });
        dispatch({
          type: 'Clear_Auth',
          payload: {},
        });
        dispatch({
          type: 'CLEAR_POSTS',
          payload: {},
        });
        dispatch({
          type: 'CLEAR_SEARCH',
          payload: {},
        });
        dispatch({
          type: 'CLEAR_FOLLOWING_FOLLOWERS',
          payload: {},
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
        _Toast('danger', error.response.data.message);
      });
  };
};
