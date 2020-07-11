import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer, { AppRootState } from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware<AppRootState>()] as const,
  devTools: process.env.NODE_ENV === 'development',
});

export default store;
