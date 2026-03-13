import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faFilm } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useLoginMutation } from '../store/authApi'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import './Login.css'

const loginSchema = yup.object({
  mobile: yup.string()
    .required('Mobile number is required')
    .matches(/^01[0-9]{9}$/, 'Mobile number must be 11 digits starting with 01'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
}).required()

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { isLoading }] = useLoginMutation()
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      mobile: '',
      password: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap()
      console.log('Login response:', result)
      
      dispatch(setCredentials({
        accessToken: result.data.accessToken
      }))
      
      toast.success(result.message || 'Login successful! Welcome back.', {
        position: 'top-right',
        autoClose: 1000
      })
      navigate('/admin/dashboard') 
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err?.data?.message || err?.message || 'Invalid mobile or password'
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
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Mobile Input */}   
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="mobile">Mobile Number</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faEnvelope} className="text-muted" />
                </span>
                <input type="text" id='mobile' {...register('mobile')} className={`form-control shadow-none ${errors.mobile ? 'is-invalid' : ''}`} placeholder="Enter mobile number"/>
              </div>
              {errors.mobile && (
                <div className="text-danger small mt-1">{errors.mobile.message}</div>
              )}
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="password">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faLock} className="text-muted" />
                </span>
                <input type="password" id='password' {...register('password')} className={`form-control shadow-none ${errors.password ? 'is-invalid' : ''}`} placeholder="Enter password"/>
              </div>
              {errors.password && (
                <div className="text-danger small mt-1">{errors.password.message}</div>
              )}
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
