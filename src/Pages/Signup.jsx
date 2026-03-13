import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faUser, faFilm, faPhone } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useSignupMutation } from '../store/authApi'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import './Login.css'

const signupSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  gender: yup.string()
    .required('Gender is required')
    .oneOf(['MALE', 'FEMALE'], 'Invalid gender'),
  mobile: yup.string()
    .required('Mobile number is required')
    .matches(/^01[0-9]{9}$/, 'Mobile number must be 11 digits starting with 01'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match')
}).required()

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: '',
      gender: 'MALE',
      mobile: '',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (data) => {
    const { ...signupData } = data
    signupData.status = 'ACTIVE'

    console.log('Signup request data:', signupData)

    try {
      const result = await signup(signupData).unwrap()
      
      console.log('Signup response:', result)
      
      if (result.code === 200 || result.code === 201) {
        if (result.data && result.data.accessToken) {
          dispatch(setCredentials({
            accessToken: result.data.accessToken
          }))
          
          toast.success(result.message || 'Account created successfully!', {
            position: 'top-right',
            autoClose: 1000
          })
          
          navigate('/')
        } else {
          toast.error('Signup successful but no token received. Please login.', {
            position: 'top-right',
            autoClose: 1000
          })
          navigate('/auth/login')
        }
      } else {
        toast.error(result.message || 'Signup failed', {
          position: 'top-right',
          autoClose: 1000
        })
      }
    } catch (err) {
      console.error('Signup error:', err)
      const errorMessage = err?.data?.message || err?.message || 'Failed to create account'
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 1000
      })
    }
  }

  return (
    <div className="login-container d-flex align-items-center justify-content-center py-4">
      <div className="card shadow-lg border-0" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body p-5">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                 style={{ width: '70px', height: '70px' }}>
              <FontAwesomeIcon icon={faFilm} size="2x" />
            </div>
            <h2 className="fw-bold">MovieBD</h2>
            <p className="text-muted">Create your account</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="name">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faUser} className="text-muted" />
                </span>
                <input type="text" id='name' {...register('name')} className={`form-control shadow-none ${errors.name ? 'is-invalid' : ''}`} placeholder="Enter your name"/>
              </div>
              {errors.name && (
                <div className="text-danger small mt-1">{errors.name.message}</div>
              )}
            </div>

            {/* Gender Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="gender">Gender</label>
              <select id='gender' {...register('gender')} className={`form-select shadow-none ${errors.gender ? 'is-invalid' : ''}`}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.gender && (
                <div className="text-danger small mt-1">{errors.gender.message}</div>
              )}
            </div>

            {/* Mobile Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="mobile">Mobile Number</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faPhone} className="text-muted" />
                </span>
                <input type="text" id='mobile' {...register('mobile')} className={`form-control shadow-none ${errors.mobile ? 'is-invalid' : ''}`} placeholder="Enter Mobile Number"/>
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
                <input type="password" id='password' {...register('password')} className={`form-control shadow-none ${errors.password ? 'is-invalid' : ''}`} placeholder="Enter your password"/>
              </div>
              {errors.password && (
                <div className="text-danger small mt-1">{errors.password.message}</div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faLock} className="text-muted" />
                </span>
                <input type="password" id='confirmPassword' {...register('confirmPassword')} className={`form-control shadow-none ${errors.confirmPassword ? 'is-invalid' : ''}`} placeholder="Confirm your password"/>
              </div>
              {errors.confirmPassword && (
                <div className="text-danger small mt-1">{errors.confirmPassword.message}</div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-muted mt-4 mb-0">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-decoration-none fw-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
