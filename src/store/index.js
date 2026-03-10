import { configureStore } from '@reduxjs/toolkit'
import { moviesApi } from './moviesApi'
import { authApi } from './authApi'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    [moviesApi.reducerPath]: moviesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(moviesApi.middleware, authApi.middleware),
})
