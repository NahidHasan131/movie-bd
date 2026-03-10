import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faStar, faEye } from '@fortawesome/free-solid-svg-icons'
import { useGetMoviesQuery, useDeleteMovieMutation, useUpdateMovieMutation } from '../store/moviesApi'
import { Modal, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'

const MovieList = () => {
  const { data: movies = [], isLoading, isError } = useGetMoviesQuery()
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation()
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation()
  
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieToDelete, setMovieToDelete] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    year: '',
    category: '',
    quality: '',
    rating: '',
    image: '',
    description: '',
  })

  const handleEdit = (movie) => {
    setSelectedMovie(movie)
    setFormData({
      title: movie.title,
      subtitle: movie.subtitle || '',
      year: movie.year,
      category: movie.category,
      quality: movie.quality,
      rating: movie.rating,
      image: movie.image,
      description: movie.description || '',
    })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelectedMovie(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitUpdate = async (e) => {
    e.preventDefault()
    
    try {
      await updateMovie({
        id: selectedMovie.id,
        ...formData,
        year: parseInt(formData.year),
        rating: parseFloat(formData.rating),
        type: selectedMovie.type,
        badge: selectedMovie.badge,
        time: selectedMovie.time,
        views: selectedMovie.views,
      }).unwrap()
      
      toast.success('Movie updated successfully!', {
        position: 'top-right',
        autoClose: 1000
      })
      handleClose()
    } catch (error) {
      toast.error('Failed to update movie: ' + error.message, {
        position: 'top-right',
        autoClose: 1000
      })
    }
  }

  const handleDeleteClick = (movie) => {
    setMovieToDelete(movie)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteMovie(movieToDelete.id).unwrap()
      toast.success('Movie deleted successfully!', {
        position: 'top-right',
        autoClose: 1000
      })
      setShowDeleteModal(false)
      setMovieToDelete(null)
    } catch (error) {
      toast.error('Failed to delete movie: ' + error.message, {
        position: 'top-right',
        autoClose: 1000
      })
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setMovieToDelete(null)
  }

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
      <div className="alert alert-danger" role="alert">
        Failed to load movies. Please try again later.
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-2 fs-1 text-primary">All Movie List</h2>
          <p className="text-muted mb-0">Manage all uploaded movies</p>
        </div>
        <div>
          <span className="badge bg-primary fs-6">Total: {movies.length} Movies</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Search by title..."/>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">All Categories</option>
                <option value="animation">Animation</option>
                <option value="action">Action</option>
                <option value="sci-fi">Sci-Fi</option>
                <option value="crime">Crime</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">All Quality</option>
                <option value="480p">480p</option>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="4k">4K</option>
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100">Filter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Category</th>
                  <th>Quality</th>
                  <th>Rating</th>
                  <th>Views</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td className="align-middle">{movie.id}</td>
                    <td className="align-middle fw-semibold">{movie.title}</td>
                    <td className="align-middle">{movie.year}</td>
                    <td className="align-middle">
                      <span className="badge bg-info">{movie.category}</span>
                    </td>
                    <td className="align-middle">
                      <span className="badge bg-success">{movie.quality}</span>
                    </td>
                    <td className="align-middle">
                      <span className="badge bg-warning text-dark">
                        <FontAwesomeIcon icon={faStar} className="me-1" />
                        {movie.rating}
                      </span>
                    </td>
                    <td className="align-middle">
                      <FontAwesomeIcon icon={faEye} className="text-muted me-1" />
                      {movie.views}
                    </td>
                    <td className="align-middle">
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(movie)}
                        title="Edit movie">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(movie)}
                        disabled={isDeleting}
                        title="Delete movie"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className="page-item disabled">
              <a className="page-link" href="#">Previous</a>
            </li>
            <li className="page-item active"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item">
              <a className="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Edit Movie Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitUpdate}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Movie Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Subtitle</Form.Label>
                  <Form.Control
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Release Year</Form.Label>
                  <Form.Control
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Animation">Animation</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Crime">Crime</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Quality</Form.Label>
                  <Form.Control
                    type="text"
                    name="quality"
                    value={formData.quality}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    max="10"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-12 mb-3">
                <Form.Group>
                  <Form.Label>Movie Poster URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-12 mb-3">
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Movie'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Are you sure you want to delete <strong>{movieToDelete?.title}</strong>?</p>
          <p className="text-muted small mb-0 mt-2">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default MovieList
