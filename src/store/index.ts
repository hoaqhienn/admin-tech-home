// store/index.ts
import { configureStore, Middleware } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { apis } from '../api';

// Create middleware array with proper typing
const apiMiddlewares = Object.values(apis)
  .filter((api): api is (typeof apis)[keyof typeof apis] => Boolean(api?.middleware))
  .map((api) => api.middleware);

// Create reducer object
const apiReducers = Object.entries(apis).reduce(
  (acc, [, api]) => ({
    ...acc,
    [api.reducerPath]: api.reducer,
  }),
  {},
);

export const store = configureStore({
  reducer: apiReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddlewares as Middleware[]),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
