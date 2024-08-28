import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import { loggerMiddleware } from './middleware/loggerMiddleware';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(loggerMiddleware),
});