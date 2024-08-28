import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import { loggerMiddleware } from './middleware/loggerMiddleware';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'game'] // only auth and game will be persisted
};

const rootReducer = combineReducers({
  auth: authReducer,
  game: gameReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(loggerMiddleware),
});

export const persistor = persistStore(store);