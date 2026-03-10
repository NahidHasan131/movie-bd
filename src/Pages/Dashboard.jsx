import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faUsers, faStar, faEye } from '@fortawesome/free-solid-svg-icons'

const Dashboard = () => {
  const stats = [
    { icon: faFilm, label: 'Total Movies', value: '1,234', color: 'primary' },
    { icon: faUsers, label: 'Total Users', value: '5,678', color: 'success' },
    { icon: faStar, label: 'Top Rated', value: '890', color: 'warning' },
    { icon: faEye, label: 'Total Views', value: '45.2K', color: 'info' },
  ]

  const recentMovies = [
    { id: 1, title: 'The Dark Knight', rating: 9.0, year: 2008 },
    { id: 2, title: 'Inception', rating: 8.8, year: 2010 },
    { id: 3, title: 'Interstellar', rating: 8.6, year: 2014 },
    { id: 4, title: 'The Matrix', rating: 8.7, year: 1999 },
    { id: 5, title: 'Pulp Fiction', rating: 8.9, year: 1994 },
  ]

  return (
    <div>
      <div className="mb-2 pb-4 text-center">
        <h2 className="fw-bold mb-2 fs-1 text-primary">Dashboard</h2>
        <p className="text-muted">Welcome back! Here's what's happening with your movies.</p>
      </div>

      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted small mb-1">{stat.label}</p>
                  <h3 className="fw-bold mb-0">{stat.value}</h3>
                </div>
                <div  className={`bg-${stat.color} text-white rounded-circle d-flex align-items-center justify-content-center`}
                  style={{ width: '56px', height: '56px' }}>
                  <FontAwesomeIcon icon={stat.icon} size="lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Movies */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h4 className="card-title fw-bold mb-4">Recent Movies</h4>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Rating</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td>{movie.id}</td>
                    <td className="fw-semibold">{movie.title}</td>
                    <td>{movie.year}</td>
                    <td>
                      <span className="badge bg-warning text-dark">
                        <FontAwesomeIcon icon={faStar} className="me-1" />
                        {movie.rating}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-link btn-sm text-primary p-0">View Details →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
