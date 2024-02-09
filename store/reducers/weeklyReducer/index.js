const weekly = {
  generateWeeklyLoader: false,
};

const initialState = {
  weekly: weekly,
};

const weeklyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GENERATE_WEEKLY_LOADING':
      return {
        ...state,
        generateWeeklyLoader: action.payload,
      };
    case 'GENERATING_WEEKLY_LOADING':
      return {
        ...state,
        generatingWeeklyLoader: action.payload,
      };
    default:
      return state;
  }
};
export default weeklyReducer;
