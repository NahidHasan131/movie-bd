import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faEnvelope, faUserShield, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import { toast } from 'react-toastify'

const HomeNav = () => {
    const categories = ['All', 'Animation', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Crime'];
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
    
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logout())
        toast.success('Logged out successfully!', {
            position: 'top-right',
            autoClose: 1000
        }) 
    }
    
    return (
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-5">
            <div className="container-fluid px-5 py-1 d-flex align-items-center justify-content-between">
              {/* Logo/Brand */}
              <Link to="/" className="navbar-brand fw-bold text-primary fs-4">
                MovieBD
              </Link>

              <div className="d-none d-md-flex  mx-5" >
                {/* Nav Links */}
                <div className="d-flex gap-2">
                  {categories.map((category, index) => (
                    <button  key={index} className={`btn ${index === 0 ? 'btn-primary' : 'btn-outline-primary'}`}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side */}
              <div className="d-flex align-items-center gap-3">
                {/* Show user info and buttons if authenticated */}
                {isAuthenticated && (
                  <>
                     
                    {/* Admin Panel Button */}
                    <Link to="/admin/dashboard" className="btn btn-success">
                      <FontAwesomeIcon icon={faUserShield} className="me-2" />
                      Admin Panel
                    </Link>

                    {/* Logout Button */}
                    <button onClick={handleLogout} className="btn btn-outline-danger">
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Logout
                    </button>
                  </>
                )}

                {/* Notification Icon */}
                <button className="btn btn-link text-dark position-relative p-2">
                  <FontAwesomeIcon icon={faBell} />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    3
                  </span>
                </button>

                {/* Message Icon */}
                <button className="btn btn-link text-dark position-relative p-2">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem' }}>
                    5
                  </span>
                </button>

                {/* Sign In Button - Only show if not authenticated */}
                {!isAuthenticated && (
                  <Link to="/auth/login" className="btn btn-primary">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
            
          </nav>
            
        </div>
    );
};

export default HomeNav;
