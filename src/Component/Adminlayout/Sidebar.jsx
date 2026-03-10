import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, 
  faUpload, 
  faList, 
  faUsers, 
  faTags, 
  faCog,
  faChevronLeft,
  faChevronRight,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import './Sidebar.css'

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  const menuItems = [
    { icon: faHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: faUpload, label: 'Upload Movie', path: '/admin/upload-movie' },
    { icon: faList, label: 'All Movie List', path: '/admin/movie-list' },
    { icon: faUsers, label: 'Authors', path: '/admin/authors' },
    { icon: faTags, label: 'Categories', path: '/admin/categories' },
    { icon: faCog, label: 'Settings', path: '/admin/settings' },
  ]

  return (
    <aside 
      className="sidebar bg-white shadow-lg"
      style={{ 
        width: isExpanded ? '250px' : '80px',
        transition: 'width 0.3s ease'
      }}>
      <div className="p-3">
        {/* Header with Toggle */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className={`mb-0 fw-bold ${!isExpanded && 'd-none'}`}>
            Menu
          </h5>
          <button onClick={toggleSidebar} className="btn btn-link text-secondary p-0">
            <FontAwesomeIcon  icon={isExpanded ? faChevronLeft : faChevronRight} />
          </button>
        </div>

        {/* Menu Items */}
        <nav>
          {menuItems.map((item, index) => (
            <Link key={index} to={item.path} className="sidebar-item d-flex align-items-center text-decoration-none text-dark p-3 rounded mb-2">
              <FontAwesomeIcon icon={item.icon}  className="sidebar-icon"/>
              <span className={`ms-3 ${!isExpanded && 'd-none'}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="user-section">
          <div className={`bg-light p-3 rounded d-flex align-items-center ${
            !isExpanded && 'justify-content-center'
          }`}>
            <div className="user-avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className={`ms-3 ${!isExpanded && 'd-none'}`}>
              <p className="mb-0 fw-semibold small">Admin User</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>admin@moviebd.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
