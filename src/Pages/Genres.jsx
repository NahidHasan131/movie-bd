import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useGetGenresQuery, useAddGenreMutation, useUpdateGenreMutation, useDeleteGenreMutation } from '../store/categoryApi'
import { Modal, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const genreSchema = yup.object({
  name: yup.string().required('Genre name is required').min(2, 'Name must be at least 2 characters')
}).required()

const Genres = () => {
  const { data: genresData, isLoading } = useGetGenresQuery()
  const [addGenre, { isLoading: isAdding }] = useAddGenreMutation()
  const [updateGenre, { isLoading: isUpdating }] = useUpdateGenreMutation()
  const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation()

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [genreToDelete, setGenreToDelete] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(genreSchema),
    defaultValues: {
      name: ''
    }
  })

  const handleAddClick = () => {
    setEditMode(false)
    reset({ name: '' })
    setShowModal(true)
  }

  const handleEditClick = (genre) => {
    setEditMode(true)
    setSelectedGenre(genre)
    reset({ name: genre.name })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelectedGenre(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      if (editMode) {
        await updateGenre({
          id: selectedGenre._id,
          ...data
        }).unwrap()
        toast.success('Genre updated successfully!', {
          position: 'top-right',
          autoClose: 3000
        })
      } else {
        await addGenre(data).unwrap()
        toast.success('Genre added successfully!', {
          position: 'top-right',
          autoClose: 3000
        })
      }
      handleClose()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save genre', {
        position: 'top-right',
        autoClose: 3000
      })
    }
  }

  const handleDeleteClick = (genre) => {
    setGenreToDelete(genre)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteGenre(genreToDelete._id).unwrap()
      toast.success('Genre deleted successfully!', {
        position: 'top-right',
        autoClose: 3000
      })
      setShowDeleteModal(false)
      setGenreToDelete(null)
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete genre', {
        position: 'top-right',
        autoClose: 3000
      })
    }
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

  const genres = genresData || []

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-2 fs-1 text-primary">Genres</h2>
          <p className="text-muted mb-0">Manage movie genres</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Genre
        </button>
      </div>

      {/* Genres Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Genre Name</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {genres.map((genre, index) => (
                  <tr key={genre._id}>
                    <td className="align-middle">{index + 1}</td>
                    <td className="align-middle fw-semibold">{genre.name}</td>
                    <td className="align-middle">
                      {genre.createdAt ? new Date(genre.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="align-middle">
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEditClick(genre)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteClick(genre)}
                        disabled={isDeleting}
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Genre' : 'Add Genre'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Genre Name</Form.Label>
              <Form.Control
                type="text"
                {...register('name')}
                className={errors.name ? 'is-invalid' : ''}
                placeholder="Action"
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isAdding || isUpdating}>
                {isAdding || isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Are you sure you want to delete <strong>{genreToDelete?.name}</strong>?</p>
          <p className="text-muted small mb-0 mt-2">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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

export default Genres
