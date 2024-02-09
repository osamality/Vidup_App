const initialState = {
  isRequested: false,
  loginRequest: { isRequested: false, isSuccess: false, failed: false },
};

const requestLoaders = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        isRequested: action.payload,
      };
    case 'SOCIAL_LOGIN':
      return {
        ...state,
        loginRequest: action.payload,
      };
    default:
      return state;
  }
};
export default requestLoaders;
