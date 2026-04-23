import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GrievanceForm from '../components/GrievanceForm'
import SearchBar from '../components/SearchBar'
import GrievanceList from '../components/GrievanceList'
import {
  createGrievance,
  deleteGrievance,
  fetchGrievances,
  searchGrievancesByTitle,
  updateGrievance,
} from '../services/api'

const toArray = (data) => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.grievances)) {
    return data.grievances
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  return []
}

function DashboardPage() {
  const navigate = useNavigate()
  const [grievances, setGrievances] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [loadingPage, setLoadingPage] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadGrievances = async () => {
    setLoadingPage(true)
    setError('')

    try {
      const data = await fetchGrievances()
      setGrievances(toArray(data))
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setLoadingPage(false)
    }
  }

  useEffect(() => {
    loadGrievances()
  }, [])

  useEffect(() => {
    const debounce = setTimeout(async () => {
      setError('')
      try {
        if (!searchValue.trim()) {
          const data = await fetchGrievances()
          setGrievances(toArray(data))
          return
        }

        const data = await searchGrievancesByTitle(searchValue.trim())
        setGrievances(toArray(data))
      } catch (apiError) {
        setError(apiError.message)
      }
    }, 350)

    return () => clearTimeout(debounce)
  }, [searchValue])

  const handleCreate = async (payload) => {
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      await createGrievance(payload)
      setSuccess('Grievance submitted successfully.')
      await loadGrievances()
      return true
    } catch (apiError) {
      setError(apiError.message)
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdate = async (id, payload) => {
    setActionLoadingId(String(id))
    setError('')
    setSuccess('')

    try {
      await updateGrievance(id, payload)
      setSuccess('Grievance updated successfully.')
      await loadGrievances()
      return true
    } catch (apiError) {
      setError(apiError.message)
      return false
    } finally {
      setActionLoadingId('')
    }
  }

  const handleDelete = async (id) => {
    setActionLoadingId(String(id))
    setError('')
    setSuccess('')

    try {
      await deleteGrievance(id)
      setSuccess('Grievance deleted successfully.')
      await loadGrievances()
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setActionLoadingId('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login', { replace: true })
  }

  const headerText = useMemo(() => {
    return searchValue.trim()
      ? `Showing results for \"${searchValue.trim()}\"`
      : 'Track and manage all submitted grievances.'
  }, [searchValue])

  return (
    <div className="dashboard-layout">
      <header className="topbar">
        <div>
          <h1>Student Grievance Dashboard</h1>
          <p>{headerText}</p>
        </div>
        <button type="button" className="secondary-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {error && <p className="alert error">{error}</p>}
      {success && <p className="alert success">{success}</p>}

      <div className="dashboard-grid">
        <div className="left-column">
          <GrievanceForm onSubmit={handleCreate} loading={submitting} />
          <SearchBar value={searchValue} onChange={setSearchValue} onClear={() => setSearchValue('')} />
        </div>

        <div className="right-column">
          {loadingPage ? (
            <section className="card">
              <p className="muted">Loading grievances...</p>
            </section>
          ) : (
            <GrievanceList
              grievances={grievances}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              actionLoadingId={actionLoadingId}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
