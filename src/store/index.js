import { configureStore } from '@reduxjs/toolkit'
import { moviesApi } from './moviesApi'
import { authApi } from './authApi'
import { categoryApi } from './categoryApi'
import authReducer from './authSlice'

export const store = configureStore({
  reducer: {
    [moviesApi.reducerPath]: moviesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      moviesApi.middleware, 
      authApi.middleware,
      categoryApi.middleware
    ),
})
