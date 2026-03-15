import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBell, faEnvelope, faHome, faSignOutAlt, faUser, faCircleUser } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import { useProfileQuery } from '../../store/authApi'
import { toast } from 'react-toastify'
import { useState } from 'react'
import { Modal, Button, Dropdown } from 'react-bootstrap'

const NavMenu = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  // Fetch user profile
  const { data: profileData, isLoading: isLoadingProfile } = useProfileQuery()

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleConfirmLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!', {
      position: 'top-right',
      autoClose: 1000
    })
    setShowLogoutModal(false)
    navigate('/')
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid px-4 py-2">
        {/* Logo/Brand */}
        <Link to="/admin/dashboard" className="navbar-brand fw-bold text-primary fs-4">
          MovieBD Admin
        </Link>

        {/* Search Bar */}
        <div className="d-none d-md-flex flex-grow-1 mx-5" style={{ maxWidth: '500px' }}>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <FontAwesomeIcon icon={faSearch} className="text-muted" />
            </span>
            <input type="text" className="form-control shadow-none border-start-0" placeholder="Search movies..."/>
          </div>
        </div>

        {/* Right Side */}
        <div className="d-flex align-items-center gap-3">
          
          {/* Home Link */}
          <Link to="/" className="btn btn-outline-primary">
            <FontAwesomeIcon icon={faHome} className="me-2" />
            Home
          </Link>
          
          {/* Logout Button */}
          <button onClick={handleLogoutClick} className="btn btn-outline-danger">
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
            Logout
          </button>
          
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

          {/* User Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle   className="text-decoration-none p-0 border-0 shadow-none d-flex align-items-center justify-content-center" style={{ background: 'none' }}>
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="shadow-lg border-0" style={{ minWidth: '280px' }}>
              {isLoadingProfile ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : profileData ? (
                <>
                  <div className="px-3 py-3 border-bottom">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <FontAwesomeIcon icon={faCircleUser} size="2x" />
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">{profileData.name}</h6>
                        <small className="text-muted">{profileData.mobile}</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-3 py-2">
                    <div className="mb-2 d-flex justify-content-between border-bottom py-2">
                      <small className="text-muted">Role:</small>
                      <span className="fw-semibold badge bg-primary">{profileData.role}</span>
                    </div>
                    <div className="mb-2 d-flex justify-content-between border-bottom py-2">
                      <small className="text-muted">Gender:</small>
                      <span className="fw-semibold badge bg-primary">{profileData.gender}</span>
                    </div>
                    <div className="mb-2 d-flex justify-content-between">
                      <small className="text-muted">Status:</small>
                      <div className="fw-semibold">
                        <span className={`badge ${profileData.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                          {profileData.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Dropdown.Item disabled>No user data</Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleCancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Are you sure you want to logout?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelLogout}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </nav>
  )
}

export default NavMenu
