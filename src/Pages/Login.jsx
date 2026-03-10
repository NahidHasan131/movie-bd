import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faFilm } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useLoginMutation } from '../store/authApi'
import { toast } from 'react-toastify'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('') 
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const result = await login({
        mobile: formData.mobile,
        password: formData.password
      }).unwrap()
      
      console.log('Login response:', result)
      
      // API response: { data: { accessToken, user }, code, message }
      dispatch(setCredentials({
        accessToken: result.data.accessToken,
        user: result.data.user
      }))
      
      toast.success(result.message || 'Login successful! Welcome back.', {
        position: 'top-right',
        autoClose: 1000
      })
      navigate('/admin/dashboard') 
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err?.data?.message || err?.message || 'Invalid mobile or password'
      setError(errorMessage)
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 1000
      })
    }
  }
  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="card shadow-lg border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-5">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px' }}>
              <FontAwesomeIcon icon={faFilm} size="2x" />
            </div>
            <h2 className="fw-bold">MovieBD</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* Mobile Input */}   
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="mobile">Mobile Number</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faEnvelope} className="text-muted" />
                </span>
                <input type="text" id='mobile' name="mobile" value={formData.mobile} onChange={handleChange} className="form-control shadow-none"  placeholder="01899999990" required/>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="password">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faLock} className="text-muted" />
                </span>
                <input type="password" id='password' name="password" value={formData.password} onChange={handleChange} className="form-control shadow-none" placeholder="asdfasdf" required />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label" htmlFor="remember">Remember me</label>
              </div>
              <Link to="/auth/forgot-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-muted mt-4 mb-0">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-decoration-none fw-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
