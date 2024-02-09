import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import AsyncStorage from '@react-native-community/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import {
  user,
  followFollowing,
  postsReducer,
  SearchReducer,
  GlobalCheckReducer,
  weekly,
  RequestLoaders,
} from './reducers';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  user,
  followFollowing,
  postsReducer,
  SearchReducer,
  GlobalCheckReducer,
  weekly,
  RequestLoaders,
});

/*
 * Persistant storage configuration
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['weekly', 'RequestLoaders'],
};
/* Persist reducer using root reducer
 * */

const persistedReducer = persistReducer(persistConfig, rootReducer);

const configureStore = () => {
  const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));
  const persistor = persistStore(store);
  return { store };
};

// const configureStore = () => {
//   const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
//   // const persistor = persistStore(store);
//   return { store };
// };

export default configureStore;
