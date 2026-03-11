import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faFilm } from '@fortawesome/free-solid-svg-icons'
import { useAddMovieMutation } from '../store/moviesApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const movieSchema = yup.object({
  title: yup.string()
    .required('Movie title is required')
    .min(2, 'Title must be at least 2 characters'),
  subtitle: yup.string(),
  year: yup.number()
    .required('Release year is required')
    .min(1900, 'Year must be after 1900')
    .max(new Date().getFullYear() + 5, 'Year cannot be too far in the future')
    .typeError('Year must be a number'),
  category: yup.string()
    .required('Category is required'),
  quality: yup.string()
    .required('Quality is required'),
  rating: yup.number()
    .required('Rating is required')
    .min(0, 'Rating must be at least 0')
    .max(10, 'Rating cannot exceed 10')
    .typeError('Rating must be a number'),
  image: yup.string()
    .required('Movie poster URL is required')
    .url('Must be a valid URL'),
  description: yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
}).required()

const UploadMovie = () => {
  const navigate = useNavigate()
  const [addMovie, { isLoading }] = useAddMovieMutation()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(movieSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      year: new Date().getFullYear(),
      category: '',
      quality: '',
      rating: '',
      image: '',
      description: ''
    }
  })

  const onSubmit = async (data) => {
    try {
      await addMovie({
        ...data,
        type: 'Full Movie Download',
        badge: 'BluRay',
        views: '0',
        time: 'Just now'
      }).unwrap()
      
      toast.success('Movie uploaded successfully!', {
        position: 'top-right',
        autoClose: 3000
      })
      reset()
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              {/* Movie Title */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Movie Title</label>
                <input 
                  type="text"
                  {...register('title')}
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="Enter movie title"
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              {/* Subtitle */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Subtitle</label>
                <input 
                  type="text"
                  {...register('subtitle')}
                  className="form-control"
                  placeholder="[Hindi Dubbed & English]"
                />
              </div>

              {/* Release Year */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Release Year</label>
                <input 
                  type="number"
                  {...register('year')}
                  className={`form-control ${errors.year ? 'is-invalid' : ''}`}
                  placeholder="2024"
                />
                {errors.year && (
                  <div className="invalid-feedback">{errors.year.message}</div>
                )}
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select 
                  {...register('category')}
                  className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                >
                  <option value="">Select Category</option>
                  <option value="Animation">Animation</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Crime">Crime</option>
                </select>
                {errors.category && (
                  <div className="invalid-feedback">{errors.category.message}</div>
                )}
              </div>

              {/* Quality */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Quality</label>
                <input 
                  type="text"
                  {...register('quality')}
                  className={`form-control ${errors.quality ? 'is-invalid' : ''}`}
                  placeholder="BluRay 480p, 720p & 1080p"
                />
                {errors.quality && (
                  <div className="invalid-feedback">{errors.quality.message}</div>
                )}
              </div>

              {/* Rating */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Rating</label>
                <input 
                  type="number"
                  step="0.1"
                  max="10"
                  {...register('rating')}
                  className={`form-control ${errors.rating ? 'is-invalid' : ''}`}
                  placeholder="8.5"
                />
                {errors.rating && (
                  <div className="invalid-feedback">{errors.rating.message}</div>
                )}
              </div>

              {/* Movie Poster URL */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Movie Poster URL</label>
                <input 
                  type="url"
                  {...register('image')}
                  className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  placeholder="https://example.com/poster.jpg"
                />
                {errors.image && (
                  <div className="invalid-feedback">{errors.image.message}</div>
                )}
              </div>

              {/* Description */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea 
                  {...register('description')}
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  rows="4"
                  placeholder="Enter movie description..."
                ></textarea>
                {errors.description && (
                  <div className="invalid-feedback">{errors.description.message}</div>
                )}
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
