import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faDownload, faPlay } from '@fortawesome/free-solid-svg-icons'
import { useGetMoviesQuery } from '../store/moviesApi'
import './AllMovies.css'


const AllMovies = () => {
  const { data: response, isLoading, isError, error } = useGetMoviesQuery()

  const movies = response?.data

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        <h4 className="alert-heading">Error!</h4>
        <p>{error?.data?.message || error?.message || 'Failed to load movies. Please try again later.'}</p>
      </div>
    )
  }

  if (movies.length === 0) {
    return (
      <div className="alert alert-info m-5" role="alert">
        <h4 className="alert-heading">No Movies Found</h4>
        <p>There are no movies available at the moment.</p>
      </div>
    )
  }

  
  return (
    <div className='px-5 mt-3'>
      {/* Header */}
      <div className="mb-2 pb-2 text-center">
        <h2 className="fw-bold mb-2 fs-1 text-primary">All Movies</h2>
        <p className="text-muted">Browse and download your favorite movies</p>
      </div>

      {/* Category Filter */}
      {/* <div className="mb-4">
        <div className="d-flex gap-2 flex-wrap">
          {categories.map((category, index) => (
            <button  key={index} className={`btn ${index === 0 ? 'btn-primary' : 'btn-outline-primary'}`}>
              {category}
            </button>
          ))}
        </div>
      </div> */}

      {/* Movies Grid */}
      <div className="row g-4 px-5">
        {movies.map((movie) => (
          <div key={movie._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="movie-card card border-0 shadow-sm h-100">
              <div className="movie-image-wrapper position-relative">
                <img src={movie.posterUrl || movie.thumbnails?.[0]} alt={movie.title} className="card-img-top"/>
                {movie.isFeatured && (
                  <span className="badge bg-warning position-absolute top-0 end-0 m-2">
                    Featured
                  </span>
                )}
                <div className="movie-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                  <button className="btn btn-light rounded-circle play-btn">
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                </div>
              </div>
              
              <div className="card-body">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-muted small" />
                  <span className="text-muted small">
                    {movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A'}
                  </span>
                  <span className="badge bg-danger ms-auto small">
                    {movie.country || 'Movie'}
                  </span>
                </div>
                
                <h6 className="card-title fw-bold mb-1">{movie.title}</h6>
                <p className="text-muted small mb-2">{movie.subtitle}</p>
                <div className="d-flex gap-1 mb-2 flex-wrap">
                  {movie.languages?.slice(0, 2).map((lang, idx) => (
                    <span key={idx} className="badge bg-info small">{lang}</span>
                  ))}
                </div>
                <p className="text-muted small mb-3" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                  {movie.description}
                </p>
                
                <button className="btn btn-primary btn-sm w-100">
                  <FontAwesomeIcon icon={faDownload} className="me-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-5 mb-4">
        <nav>
          <ul className="pagination">
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex="-1">
                <span>&laquo;</span> Previous
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">2</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">3</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">4</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">5</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next <span>&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default AllMovies
