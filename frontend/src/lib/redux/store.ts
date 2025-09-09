import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import booksReducer from './slices/booksSlice';
import borrowersReducer from './slices/borrowersSlice';
import borrowingsReducer from './slices/borrowingsSlice';
import authReducer from './slices/authSlice';

export interface RootState {
  books: ReturnType<typeof booksReducer>;
  borrowers: ReturnType<typeof borrowersReducer>;
  borrowings: ReturnType<typeof borrowingsReducer>;
  auth: ReturnType<typeof authReducer>;
}

export const store = configureStore({
  reducer: {
    books: booksReducer,
    borrowers: borrowersReducer,
    borrowings: borrowingsReducer,
    auth: authReducer,
  },
});

export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
