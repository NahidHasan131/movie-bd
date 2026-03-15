import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useGetCategoriesQuery, useAddCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../store/categoryApi'
import { Modal, Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const categorySchema = yup.object({
  name: yup.string().required('Category name is required').min(2, 'Name must be at least 2 characters'),
  slug: yup.string().required('Slug is required').matches(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  icon: yup.string(),
  description: yup.string(),
  isActive: yup.boolean()
}).required()

const Categories = () => {
  const { data: categoriesData, isLoading } = useGetCategoriesQuery()
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()

  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      icon: '',
      description: '',
      isActive: true
    }
  })

  const handleAddClick = () => {
    setEditMode(false)
    reset({
      name: '',
      slug: '',
      icon: '',
      description: '',
      isActive: true
    })
    setShowModal(true)
  }

  const handleEditClick = (category) => {
    setEditMode(true)
    setSelectedCategory(category)
    reset({
      name: category.name,
      slug: category.slug || '',
      icon: category.icon || '',
      description: category.description || '',
      isActive: category.isActive !== false
    })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setSelectedCategory(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      if (editMode) {
        await updateCategory({
          id: selectedCategory._id,
          ...data
        }).unwrap()
        toast.success('Category updated successfully!', {
          position: 'top-right',
          autoClose: 3000
        })
      } else {
        await addCategory(data).unwrap()
        toast.success('Category added successfully!', {
          position: 'top-right',
          autoClose: 3000
        })
      }
      handleClose()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save category', {
        position: 'top-right',
        autoClose: 3000
      })
    }
  }

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete._id).unwrap()
      toast.success('Category deleted successfully!', {
        position: 'top-right',
        autoClose: 3000
      })
      setShowDeleteModal(false)
      setCategoryToDelete(null)
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete category', {
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

  const categories = categoriesData || []

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2 className="fw-bold mb-2 fs-1 text-primary">Categories</h2>
          <p className="text-muted mb-0">Manage movie categories</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddClick}>
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="row g-4">
        {categories.map((category) => (
          <div key={category._id} className="col-md-6 col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ fontSize: '2rem' }}>{category.icon || '📁'}</span>
                    <div>
                      <h5 className="mb-0">{category.name}</h5>
                      <small className="text-muted">{category.slug}</small>
                    </div>
                  </div>
                  <span className={`badge ${category.isActive ? 'bg-success' : 'bg-secondary'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-muted small mb-3">{category.description}</p>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-sm btn-outline-primary flex-grow-1"
                    onClick={() => handleEditClick(category)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteClick(category)}
                    disabled={isDeleting}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Category Name</Form.Label>
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
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Slug</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('slug')}
                    className={errors.slug ? 'is-invalid' : ''}
                    placeholder="action"
                  />
                  {errors.slug && (
                    <div className="invalid-feedback">{errors.slug.message}</div>
                  )}
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Icon (Emoji)</Form.Label>
                  <Form.Control
                    type="text"
                    {...register('icon')}
                    placeholder="🔥"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6 mb-3">
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Check
                    type="switch"
                    {...register('isActive')}
                    label="Active"
                  />
                </Form.Group>
              </div>

              <div className="col-12 mb-3">
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    {...register('description')}
                    placeholder="High-paced movies with a lot of stunts and fights."
                  />
                </Form.Group>
              </div>
            </div>

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
          <p className="mb-0">Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>?</p>
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

export default Categories
