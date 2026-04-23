import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)

  const successMessage = location.state?.successMessage || ''

  const isFormValid = useMemo(() => {
    return formData.email.trim() && formData.password.trim()
  }, [formData])

  const validate = () => {
    const nextErrors = {}

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required'
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required'
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
      const response = await loginUser(formData)
      const token = response?.token || response?.jwt || response?.accessToken

      if (!token) {
        throw new Error('Login response does not include a token.')
      }

      localStorage.setItem('token', token)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      setApiError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to manage and track your grievances.</p>

        {successMessage && <p className="alert success">{successMessage}</p>}
        {apiError && <p className="alert error">{apiError}</p>}

        <form onSubmit={handleSubmit} className="form-stack" noValidate>
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
              placeholder="Enter your password"
            />
            {errors.password && <small className="error-text">{errors.password}</small>}
          </label>

          <button type="submit" className="primary-btn" disabled={loading || !isFormValid}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="switch-link">
          New student? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
