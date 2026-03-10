import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faFilm } from '@fortawesome/free-solid-svg-icons'
import { useAddMovieMutation } from '../store/moviesApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const UploadMovie = () => {
  const navigate = useNavigate()
  const [addMovie, { isLoading }] = useAddMovieMutation()
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    year: new Date().getFullYear(),
    category: '',
    quality: '',
    type: 'Full Movie Download',
    badge: 'BluRay',
    image: '',
    rating: '',
    views: '0',
    time: 'Just now',
    description: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()  
    try {
      await addMovie({
        ...formData,
        year: parseInt(formData.year),
        rating: parseFloat(formData.rating),
      }).unwrap()
      
      toast.success('Movie uploaded successfully!', {
        position: 'top-right',
        autoClose: 3000
      })
      navigate('/admin/movie-list')
    } catch (error) {
      toast.error('Failed to upload movie: ' + error.message, {
        position: 'top-right',
        autoClose: 3000
      })
    }
  }
  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="fw-bold mb-2 fs-1 text-primary">
          <FontAwesomeIcon icon={faUpload} className="me-2" />
          Upload Movie
        </h2>
        <p className="text-muted">Add a new movie to the database</p>
      </div>

      {/* Upload Form */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Movie Title */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Movie Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" placeholder="Enter movie title" required/>
              </div>

              {/* Subtitle */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Subtitle</label>
                <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="form-control" placeholder="[Hindi Dubbed & English]" />
              </div>

              {/* Release Year */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Release Year</label>
                <input type="number" name="year"  value={formData.year} onChange={handleChange} className="form-control"  placeholder="2024" required />
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-select" required>
                  <option value="">Select Category</option>
                  <option value="Animation">Animation</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Crime">Crime</option>
                </select>
              </div>

              {/* Quality */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Quality</label>
                <input type="text" name="quality" value={formData.quality} onChange={handleChange} className="form-control" placeholder="BluRay 480p, 720p & 1080p" required/>
              </div>

              {/* Rating */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Rating</label>
                <input type="number"  name="rating" value={formData.rating} onChange={handleChange} step="0.1"  max="10" className="form-control"  placeholder="8.5" required/>
              </div>

              {/* Movie Poster URL */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Movie Poster URL</label>
                <input type="url"  name="image" value={formData.image} onChange={handleChange} className="form-control"  placeholder="https://example.com/poster.jpg" required/>
              </div>

              {/* Description */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea  name="description" value={formData.description} onChange={handleChange} className="form-control"  rows="4"  placeholder="Enter movie description..." required></textarea>
              </div>

              {/* Submit Button */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary px-5" disabled={isLoading}>
                  <FontAwesomeIcon icon={faFilm} className="me-2" />
                  {isLoading ? 'Uploading...' : 'Upload Movie'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UploadMovie
