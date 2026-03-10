import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faLock, faUser, faFilm, faPhone } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { useSignupMutation } from '../store/authApi'
import { toast } from 'react-toastify'
import './Login.css'

const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [signup, { isLoading }] = useSignupMutation()
  
  const [formData, setFormData] = useState({
    name: '',
    gender: 'MALE',
    mobile: '',
    password: '',
    confirmPassword: '',
    status: 'ACTIVE'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        position: 'top-right',
        autoClose: 1000
      })
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters', {
        position: 'top-right',
        autoClose: 1000
      })
      return
    }

    try {
      const result = await signup({
        name: formData.name,
        gender: formData.gender,
        mobile: formData.mobile,
        password: formData.password,
        status: formData.status
      }).unwrap()
      
      console.log('Signup response:', result)
      
      // API response: { data: { accessToken, user }, code, message }
      dispatch(setCredentials({
        accessToken: result.data.accessToken,
        user: result.data.user
      }))
      
      toast.success(result.message || 'Account created successfully!', {
        position: 'top-right',
        autoClose: 1000
      }) 
      navigate('/')
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
          <form onSubmit={handleSubmit}>
            {/* Name Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="name">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faUser} className="text-muted" />
                </span>
                <input type="text" id='name' name='name' value={formData.name} onChange={handleChange} className="form-control shadow-none" placeholder="Enter your name" required />
              </div>
            </div>

            {/* Gender Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="gender">Gender</label>
              <select id='gender' name='gender' value={formData.gender} onChange={handleChange} className="form-select shadow-none" required>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            {/* Mobile Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="mobile">Mobile Number</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faPhone} className="text-muted" />
                </span>
                <input type="text" id='mobile' name='mobile' value={formData.mobile} onChange={handleChange} className="form-control shadow-none" placeholder="01899999991" required />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="password">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faLock} className="text-muted" />
                </span>
                <input type="password" id='password' name='password' value={formData.password} onChange={handleChange} className="form-control shadow-none" placeholder="Enter your password" required />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-3">
              <label className="form-label fw-semibold" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FontAwesomeIcon icon={faLock} className="text-muted" />
                </span>
                <input type="password" id='confirmPassword' name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} className="form-control shadow-none" placeholder="Confirm your password" required />
              </div>
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
