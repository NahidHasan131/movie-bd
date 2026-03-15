import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faFilm, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useAddMovieMutation, useUploadFileMutation } from '../store/moviesApi'
import { useGetCategoriesQuery } from '../store/categoryApi'
import { useGetGenresQuery } from '../store/categoryApi'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const movieSchema = yup.object({
  title: yup.string().required('Movie title is required').min(2, 'Title must be at least 2 characters'),
  subtitle: yup.string(),
  categoryId: yup.string().required('Category is required'),
  description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
  country: yup.string(), director: yup.string(), writer: yup.string(),
  trailerLink: yup.string().url('Must be a valid URL'),
  releaseDate: yup.date().required('Release date is required'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  isFeatured: yup.boolean(),
  cast: yup.array().of(yup.object({ value: yup.string() })),
  languages: yup.array().of(yup.object({ value: yup.string() })),
  tags: yup.array().of(yup.object({ value: yup.string() })),
  links: yup.array().of(yup.object({
    quality: yup.string(),
    url: yup.string(),
    language: yup.string(),
    size: yup.string(),
  })),
}).required()

const UploadMovie = () => {
  const navigate = useNavigate()
  const [addMovie, { isLoading }] = useAddMovieMutation()
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation()
  const { data: categoriesData } = useGetCategoriesQuery()
  const { data: genresData } = useGetGenresQuery()

  const [posterFile, setPosterFile] = useState(null)
  const [posterPreview, setPosterPreview] = useState('')
  const [thumbnailFiles, setThumbnailFiles] = useState([])
  const [screenshotFiles, setScreenshotFiles] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(movieSchema),
    defaultValues: {
      title: '', subtitle: '', categoryId: '', description: '', country: '',
      director: '', writer: '', trailerLink: '',
      releaseDate: new Date().toISOString().split('T')[0],
      slug: '', isFeatured: false,
      cast: [{ value: '' }],
      languages: [{ value: '' }],
      tags: [{ value: '' }],
      links: [{ quality: '', url: '', language: '', size: '' }],
    }
  })

  const { fields: castFields, append: appendCast, remove: removeCast } = useFieldArray({ control, name: 'cast' })
  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control, name: 'languages' })
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: 'tags' })
  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: 'links' })


  const handlePosterChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPosterFile(file)
      setPosterPreview(URL.createObjectURL(file))
    }
  }

  const handleThumbnailsChange = (e) => {
    const files = Array.from(e.target.files)
    setThumbnailFiles(files)
  }

  const handleScreenshotsChange = (e) => {
    const files = Array.from(e.target.files)
    setScreenshotFiles(files)
  }

  const uploadFileToServer = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const result = await uploadFile(formData).unwrap()
      console.log("Upload result:", result)
      
      // Different possible response
      const url = result?.data?.data?.directViewLink || result?.data?.directViewLink || result?.directViewLink ||
                  result?.data?.url || result?.url || result?.data?.data?.url 
      if (!url) {
        console.error('Could not find URL in response:', result)
        throw new Error('File uploaded but URL not found in response')
      }
      console.log("Extracted URL:", url)
      return url
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }

  const onSubmit = async (data) => {
    try {
      // Upload poster
      let posterUrl = ''
      if (posterFile) {
        toast.info('Uploading poster...', { autoClose: 1000 })
        posterUrl = await uploadFileToServer(posterFile)
      }

      // Upload thumbnails
      const thumbnailUrls = []
      if (thumbnailFiles.length > 0) {
        toast.info('Uploading thumbnails...', { autoClose: 1000 })
        for (const file of thumbnailFiles) {
          try {
            const url = await uploadFileToServer(file)
            if (url) thumbnailUrls.push(url)
          } catch (error) {
            console.error('Failed to upload thumbnail:', error)
          }
        }
      }

      // Upload screenshots
      const screenshotUrls = []
      if (screenshotFiles.length > 0) {
        toast.info('Uploading screenshots...', { autoClose: 1000 })
        for (const file of screenshotFiles) {
          try {
            const url = await uploadFileToServer(file)
            if (url) screenshotUrls.push(url)
          } catch (error) {
            console.error('Failed to upload screenshot:', error)
          }
        }
      }

      // Prepare movie data - only include arrays if they have valid values
      const movieData = {
        ...data,
        cast: data.cast.map(c => c.value).filter(Boolean),
        languages: data.languages.map(l => l.value).filter(Boolean),
        tags: data.tags.map(t => t.value).filter(Boolean),
        genresId: selectedGenres,
        links: data.links.filter(link => link.url && link.quality),
        trailerLink: data.trailerLink ? [data.trailerLink] : []
      }

      // Only add these fields if they have values
      if (posterUrl) movieData.posterUrl = posterUrl
      if (thumbnailUrls.length > 0) movieData.thumbnails = thumbnailUrls
      if (screenshotUrls.length > 0) movieData.screenshots = screenshotUrls

      console.log('Submitting movie data:', movieData)

      await addMovie(movieData).unwrap()
      
      toast.success('Movie uploaded successfully!', {
        position: 'top-right',
        autoClose: 1000
      })
      navigate('/admin/movie-list')
    } catch (error) {
      console.error('Movie upload error:', error)
      toast.error('Failed to upload movie: ' + (error?.data?.message || error.message), {
        position: 'top-right',
        autoClose: 1000
      })
    }
  }


  const categories = categoriesData || []
  const genres = genresData || []

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="fw-bold mb-2 fs-1 text-primary">
          <FontAwesomeIcon icon={faUpload} className="me-2" />
          Upload Movie
        </h2>
        <p className="text-muted">Add a new movie to the database</p>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              {/* Title */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Movie Title *</label>
                <input type="text" {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`} placeholder="Enter movie title"/>
                {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
              </div>

              {/* Subtitle */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Subtitle</label>
                <input type="text" {...register('subtitle')} className="form-control" placeholder="Enter Movie Subtitle"/>
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Category *</label>
                <select {...register('categoryId')} className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}>
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.categoryId && <div className="invalid-feedback">{errors.categoryId.message}</div>}
              </div>

              {/* Slug */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Slug *</label>
                <input type="text" {...register('slug')} className={`form-control ${errors.slug ? 'is-invalid' : ''}`} placeholder="Enter movie slug"/>
                {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
              </div>

              {/* Country */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Country</label>
                <input type="text" {...register('country')} className="form-control" placeholder="Bangladesh"/>
              </div>

              {/* Director */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Director</label>
                <input type="text" {...register('director')} className="form-control" placeholder="Director name"/>
              </div>

              {/* Writer */}
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Writer</label>
                <input type="text" {...register('writer')} className="form-control" placeholder="Writer name"/>
              </div>

              {/* Release Date */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Release Date *</label>
                <input type="date" {...register('releaseDate')} className={`form-control ${errors.releaseDate ? 'is-invalid' : ''}`}/>
                {errors.releaseDate && <div className="invalid-feedback">{errors.releaseDate.message}</div>}
              </div>

              {/* Trailer Link */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Trailer Link (YouTube)</label>
                <input type="url" {...register('trailerLink')} className={`form-control ${errors.trailerLink ? 'is-invalid' : ''}`} placeholder="https://www.youtube.com/watch?v=..."/>
                {errors.trailerLink && <div className="invalid-feedback">{errors.trailerLink.message}</div>}
              </div>

              {/* Poster Upload */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Movie Poster *</label>
                <input type="file" accept="image/*" onChange={handlePosterChange} className="form-control"/>
                {posterPreview && (
                  <img src={posterPreview} alt="Poster preview" className="mt-2" style={{ maxHeight: '150px' }} />
                )}
              </div>

              {/* Thumbnails Upload */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Thumbnails (Multiple)</label>
                <input type="file" accept="image/*" multiple onChange={handleThumbnailsChange} className="form-control"/>
                <small className="text-muted">{thumbnailFiles.length} file(s) selected</small>
              </div>

              {/* Screenshots Upload */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Screenshots (Multiple)</label>
                <input type="file" accept="image/*" multiple onChange={handleScreenshotsChange} className="form-control"/>
                <small className="text-muted">{screenshotFiles.length} file(s) selected</small>
              </div>

              {/* Genres */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Genres</label>
                <div className="d-flex flex-wrap gap-2">
                  {genres.map(genre => (
                    <div key={genre._id} className="form-check">
                      <input type="checkbox" className="form-check-input" id={`genre-${genre._id}`} checked={selectedGenres.includes(genre._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGenres([...selectedGenres, genre._id])
                          } else {
                            setSelectedGenres(selectedGenres.filter(id => id !== genre._id))
                          }
                        }}/>
                      <label className="form-check-label" htmlFor={`genre-${genre._id}`}> {genre.name}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cast */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Cast</label>
                {castFields.map((field, index) => (
                  <div key={field.id} className="input-group mb-2">
                    <input type="text" {...register(`cast.${index}.value`)} className="form-control" placeholder="Actor name"/>
                    <button type="button" className="btn btn-outline-danger" onClick={() => removeCast(index)}>
                      <FontAwesomeIcon icon={faTrash}/>
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => appendCast({ value: '' })}>
                  + Add Cast Member
                </button>
              </div>

              {/* Languages */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Languages</label>
                {langFields.map((field, index) => (
                  <div key={field.id} className="input-group mb-2">
                    <input type="text" {...register(`languages.${index}.value`)} className="form-control" placeholder="Bangla"/>
                    <button type="button" className="btn btn-outline-danger" onClick={() => removeLang(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => appendLang({ value: '' })}>
                  + Add Language
                </button>
              </div>

              {/* Tags */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Tags</label>
                {tagFields.map((field, index) => (
                  <div key={field.id} className="input-group mb-2">
                    <input type="text" {...register(`tags.${index}.value`)} className="form-control" placeholder="action"/>
                    <button type="button" className="btn btn-outline-danger" onClick={() => removeTag(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => appendTag({ value: '' })}>
                  + Add Tag
                </button>
              </div>

              {/* Download Links */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Download Links</label>
                {linkFields.map((field, index) => (
                  <div key={field.id} className="card mb-2 p-3">
                    <div className="row">
                      <div className="col-md-3 mb-2">
                        <input type="text" {...register(`links.${index}.quality`)} className="form-control" placeholder="Movie Quality"/>
                      </div>
                      <div className="col-md-3 mb-2">
                        <input type="text" {...register(`links.${index}.language`)} className="form-control" placeholder="English"/>
                      </div>
                      <div className="col-md-2 mb-2">
                        <input type="text" {...register(`links.${index}.size`)} className="form-control" placeholder="Movie Size"/>
                      </div>
                      <div className="col-md-3 mb-2">
                        <input type="url" {...register(`links.${index}.url`)} className="form-control" placeholder="Download URL"/>
                      </div>
                      <div className="col-md-1">
                        <button type="button" className="btn btn-outline-danger" onClick={() => removeLink(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-primary"
                  onClick={() => appendLink({ quality: '', url: '', language: '', size: '' })}>
                  + Add Download Link
                </button>
              </div>

              {/* Description */}
              <div className="col-12 mb-3">
                <label className="form-label fw-semibold">Description *</label>
                <textarea {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  rows="4" placeholder="Enter movie description..."></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
              </div>

              {/* Featured */}
              <div className="col-12 mb-3">
                <div className="form-check form-switch">
                  <input type="checkbox" {...register('isFeatured')} className="form-check-input" id="isFeatured"/>
                  <label className="form-check-label" htmlFor="isFeatured">
                    Featured Movie
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary px-5" disabled={isLoading || isUploading}>
                  <FontAwesomeIcon icon={faFilm} className="me-2" />
                  {isLoading || isUploading ? 'Uploading...' : 'Upload Movie'}
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
