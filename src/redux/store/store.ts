import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from '../slice/authSlice';
import messageReducer from '../slice/messageSlice';
import profileReducer from '../slice/profileSlice';
import socketReducer from '../slice/socketSlice';
import userReducer from '../slice/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  message: messageReducer,
  profile: profileReducer,
  socket: socketReducer,
  user: userReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['auth', 'profile', 'user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

