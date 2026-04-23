import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const getErrorMessage = (error, fallback) => {
  if (error?.response?.data?.message) {
    return error.response.data.message
  }
  if (error?.response?.data?.error) {
    return error.response.data.error
  }
  return fallback
}

export const registerUser = async (payload) => {
  try {
    const response = await api.post('/register', payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Registration failed. Please try again.'))
  }
}

export const loginUser = async (payload) => {
  try {
    const response = await api.post('/login', payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Invalid login credentials.'))
  }
}

export const fetchGrievances = async () => {
  try {
    const response = await api.get('/grievances')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not fetch grievances.'))
  }
}

export const createGrievance = async (payload) => {
  try {
    const response = await api.post('/grievances', payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not submit grievance.'))
  }
}

export const updateGrievance = async (id, payload) => {
  try {
    const response = await api.put(`/grievances/${id}`, payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not update grievance.'))
  }
}

export const deleteGrievance = async (id) => {
  try {
    const response = await api.delete(`/grievances/${id}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not delete grievance.'))
  }
}

export const searchGrievancesByTitle = async (title) => {
  try {
    const response = await api.get('/grievances/search', {
      params: { title },
    })
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Could not search grievances.'))
  }
}

export default api
