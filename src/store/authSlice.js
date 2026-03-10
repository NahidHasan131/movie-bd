import { createSlice } from '@reduxjs/toolkit'

// Decode JWT token to get user info
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

const getInitialAuthState = () => {
  const token = localStorage.getItem('moviebd_token')
  
  if (token) {
    const decoded = decodeToken(token)
    if (decoded && decoded.exp && decoded.exp * 1000 > Date.now()) {
      return {
        isAuthenticated: true,
        user: decoded,
        token
      }
    }
    localStorage.removeItem('moviebd_token')
  }
  return {
    isAuthenticated: false,
    user: null,
    token: null
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuthState(),
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload
      const token = accessToken
      
      state.isAuthenticated = true
      state.user = user
      state.token = token
      
      localStorage.setItem('moviebd_token', token)
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
      localStorage.removeItem('moviebd_token')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
