import { useMemo, useState } from 'react'

const initialState = {
  title: '',
  description: '',
  category: 'Academic',
}

function GrievanceForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})

  const canSubmit = useMemo(() => {
    return formData.title.trim() && formData.description.trim() && formData.category.trim()
  }, [formData])

  const validate = () => {
    const nextErrors = {}

    if (!formData.title.trim()) {
      nextErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      nextErrors.description = 'Description is required'
    }

    if (!formData.category) {
      nextErrors.category = 'Category is required'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const success = await onSubmit(formData)
    if (success) {
      setFormData(initialState)
      setErrors({})
    }
  }

  return (
    <section className="card">
      <h2>Submit Grievance</h2>
      <form className="form-stack" onSubmit={handleSubmit} noValidate>
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief grievance title"
          />
          {errors.title && <small className="error-text">{errors.title}</small>}
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail"
            rows={4}
          />
          {errors.description && <small className="error-text">{errors.description}</small>}
        </label>

        <label className="field">
          <span>Category</span>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Academic">Academic</option>
            <option value="Hostel">Hostel</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <small className="error-text">{errors.category}</small>}
        </label>

        <button type="submit" className="primary-btn" disabled={loading || !canSubmit}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </section>
  )
}

export default GrievanceForm
