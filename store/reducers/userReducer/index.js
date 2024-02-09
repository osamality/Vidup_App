const user = {
  message: null,
  id: null,
  email: null,
  username: null,
  date_of_birth: null,
  signup_status: 1,
  verified: false,
  token: null,
  bio: null,
  gender: null,
  phone: null,
  profile_pic: null,
  name: null,
  isLoading: false,
  weeklyLoader: false,
  // generateWeeklyLoader: false,
  weeklyVideo: {
    weeklyVideos: [],
    weekly_video_creation: true,
    message: '',
  },
};
const tempUser = {
  message: null,
  id: null,
  email: null,
  username: null,
  date_of_birth: null,
  signup_status: 1,
  verified: false,
  token: null,
  bio: null,
  gender: null,
  phone: null,
  profile_pic: null,
  name: null,
  isLoading: false,
  weeklyLoader: false,
  // generateWeeklyLoader: false,
  weeklyVideo: {
    weeklyVideos: [],
    weekly_video_creation: true,
    message: '',
  },
};
const restPassword = {
  isCodeSent: false,
  email: '',
};
const updateUser = {
  isRequested: false,
  isSuccess: false,
  isError: false,
};

const initialState = {
  user: user,
  tempUser: tempUser,
  visitingUser: {},
  forgotPassword: { isCodeSent: false, isCodeTyped: false, email: '' },
  // loginRequest: { isRequested: false, isSuccess: false, failed: false },
  resetPassword: { isPasswordChanged: false },
  changePassword: { isPasswordChanged: false },
  updateUser: updateUser,
  users: [],
  isSocialLogin: false,
  userVerifiedStatus: {},
  changeEmailRequested: false,
  userAcceptTerms: true,
  userAcceptTermsShowVideos: false,
  // isRequested: false,
  notifications: [],
  isWeeklyVideoUpdated: false,
  topUsers: [],
  notificationSettings: {
    comments: false,
    likes: false,
    mention: false,
    follows: false,
  },
  totalNotifications: 0,
  isSignupCompleted: true,
  searchUsersExtra: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // case 'LOADING':
    //   return {
    //     ...state,
    //     isRequested: action.payload,
    //   };
    case 'WEEKLY_LOADING':
      return {
        ...state,
        weeklyLoader: action.payload,
      };
    // case 'GENERATE_WEEKLY_LOADING':
    //   return {
    //     ...state,
    //     generateWeeklyLoader: action.payload,
    //   };
    case 'IS_SIGNUP_COMPLETED':
      return {
        ...state,
        isSignupCompleted: action.payload,
      };
    // case 'SOCIAL_LOGIN':
    //   return {
    //     ...state,
    //     loginRequest: action.payload,
    //   };
    case 'IS_SOCIAL_LOGIN':
      return {
        ...state,
        isSocialLogin: action.payload,
      };
    case 'LOGIN':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'REGISTER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'REGISTER_TEMP':
      return {
        ...state,
        tempUser: { ...state.tempUser, ...action.payload },
      };
    case 'Users':
      return {
        ...state,
        users: action.payload,
      };
    case 'Verify_Code':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'Verify_Account':
      return {
        ...state,
        userVerifiedStatus: action.payload,
      };
    case 'CHANGE_EMAIL_REQUEST':
      return {
        ...state,
        changeEmailRequested: action.payload,
      };
    case 'Accept_Terms':
      return {
        ...state,
        userAcceptTerms: action.payload,
        userAcceptTermsShowVideos: action.payload,
      };
    case 'Update_Username':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'Update_DOB':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'Forgot_Password':
      return {
        ...state,
        forgotPassword: action.payload,
      };
    case 'Reset_Password':
      return {
        ...state,
        resetPassword: action.payload,
      };
    case 'Change_Password':
      return {
        ...state,
        changePassword: action.payload,
      };
    case 'Fetch_Single_User':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'Fetch_Weekly_Videos':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case 'Update_Weekly_Videos':
      return {
        ...state,
        isWeeklyVideoUpdated: action.payload,
      };
    case 'Update_User':
      return {
        ...state,
        user: { ...state.user, ...action.payload.user },
        updateUser: action.payload.status,
      };
    case 'Visiting_User':
      return {
        ...state,
        visitingUser: action.payload,
      };
    case 'Clear_Update_User_State':
      return {
        ...state,
        updateUser: { ...updateUser },
      };
    case 'Clear_Auth':
      return {
        ...initialState,
      };
    case 'Clear_Auth_Temp':
      return {
        ...state,
        tempUser: tempUser,
      };

    case 'ON_FOLLOW_REQUEST_SUCCESS':
      const { users } = state;
      const { followingEmail } = action.payload;
      const _updatedUsers = users.map((i) => {
        if (i.email === followingEmail) {
          return {
            ...i,
            request_sent: true,
          };
        }
        return i;
      });
      return {
        ...state,
        users: _updatedUsers,
      };
    case 'ON_FOLLOW_SUCCESS':
      const { _users } = state.users;
      const followEmail = action.payload.followingEmail;
      const __updatedUsers = _users.map((i) => {
        if (i.email === followEmail) {
          return {
            ...i,
            follow_back: true,
          };
        }
        return i;
      });
      return {
        ...state,
        users: __updatedUsers,
      };
    case 'Fetch_User_Notifications':
      return {
        ...state,
        notifications: action.payload,
      };
    case 'Fetch_Top_Users':
      return {
        ...state,
        topUsers: action.payload,
      };
    case 'Notification_Settings':
      return {
        ...state,
        notificationSettings: action.payload,
      };
    case 'Notification_Count':
      return {
        ...state,
        totalNotifications: action.payload,
      };
    case 'Search_Users_Extra':
      return {
        ...state,
        searchUsersExtra: action.payload,
      };
    default:
      return state;
  }
};
export default userReducer;
