import userReducer from './userReducer';
import followFollowingReducer from './followFollowingReducer';
import postReducer from './postsReducer';
import searchReducer from './searchReducer';
import globalCheckReducer from './global-checks';
import weeklyReducer from './weeklyReducer';
import requestLoaders from './loaders';

export const user = userReducer;
export const followFollowing = followFollowingReducer;
export const postsReducer = postReducer;
export const SearchReducer = searchReducer;
export const GlobalCheckReducer = globalCheckReducer;
export const weekly = weeklyReducer;
export const RequestLoaders = requestLoaders;
