import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import dateReducer from './module/date';
import timerReducer from './module/timer';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['dateReducer'],
};

const rootReducer = combineReducers({
  // date: setReduxDate,
  date: dateReducer,
  timer: timerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
  });
};

// setupListeners(store.dispatch)

// Infer the type of makeStore
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
