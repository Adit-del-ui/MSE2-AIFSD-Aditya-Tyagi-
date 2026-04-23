import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/api'

const initialState = {
  name: '',
  email: '',
  password: '',
}

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const isFormValid = useMemo(() => {
    return formData.name.trim() && formData.email.trim() && formData.password.trim()
  }, [formData])

  const validate = () => {
    const nextErrors = {}

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Enter a valid email address'
    }

    if (!formData.password) {
      nextErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setApiError('')
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)
    setApiError('')

    try {
      await registerUser(formData)
      navigate('/login', {
        replace: true,
        state: { successMessage: 'Registration successful. Please login.' },
      })
    } catch (error) {
      setApiError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="subtitle">Register with your student details to continue.</p>

        {apiError && <p className="alert error">{apiError}</p>}

        <form onSubmit={handleSubmit} className="form-stack" noValidate>
          <label className="field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <small className="error-text">{errors.name}</small>}
          </label>

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@email.com"
            />
            {errors.email && <small className="error-text">{errors.email}</small>}
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
            />
            {errors.password && <small className="error-text">{errors.password}</small>}
          </label>

          <button type="submit" className="primary-btn" disabled={loading || !isFormValid}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="switch-link">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
