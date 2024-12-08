// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { combinedApi } from '../api/index';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
  reducer: {
    [combinedApi.authApi.reducerPath]: combinedApi.authApi.reducer,
    [combinedApi.chatApi.reducerPath]: combinedApi.chatApi.reducer,
    [combinedApi.propertyApi.reducerPath]: combinedApi.propertyApi.reducer,
    [combinedApi.residentApi.reducerPath]: combinedApi.residentApi.reducer,
    [combinedApi.serviceApi.reducerPath]: combinedApi.serviceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(combinedApi.authApi.middleware)
      .concat(combinedApi.chatApi.middleware)
      .concat(combinedApi.propertyApi.middleware)
      .concat(combinedApi.residentApi.middleware)
      .concat(combinedApi.serviceApi.middleware),
  devTools: process.env.NODE_ENV !== 'production', // Optional: disable devtools in production
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Optional: Export hooks for typing
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
