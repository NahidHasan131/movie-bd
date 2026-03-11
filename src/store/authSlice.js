import { createSlice } from '@reduxjs/toolkit'

const getInitialAuthState = () => {
  const token = localStorage.getItem('moviebd_token')
  
  if (token) {
    return {
      isAuthenticated: true,
      token
    }
  }
  return {
    isAuthenticated: false,
    token: null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken } = action.payload
      
      state.isAuthenticated = true
      state.token = accessToken
      
      // Only store token in localStorage
      localStorage.setItem('moviebd_token', accessToken)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      localStorage.removeItem('moviebd_token')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
