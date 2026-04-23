import { useState } from 'react'

const getId = (item) => item.id || item._id

function formatDate(value) {
  if (!value) {
    return 'N/A'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'N/A'
  }

  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function GrievanceList({ grievances, onUpdate, onDelete, actionLoadingId }) {
  const [editingId, setEditingId] = useState('')
  const [draft, setDraft] = useState({ title: '', description: '', category: '' })

  const handleStartEdit = (item) => {
    const id = String(getId(item))
    setEditingId(id)
    setDraft({
      title: item.title || '',
      description: item.description || '',
      category: item.category || 'Other',
    })
  }

  const handleCancelEdit = () => {
    setEditingId('')
    setDraft({ title: '', description: '', category: '' })
  }

  const handleSave = async (id) => {
    if (!draft.title.trim() || !draft.description.trim()) {
      return
    }

    const success = await onUpdate(id, {
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category,
    })

    if (success) {
      handleCancelEdit()
    }
  }

  return (
    <section className="card grievance-list-card">
      <h2>My Grievances</h2>

      {!grievances.length ? (
        <p className="empty-state">No grievances found.</p>
      ) : (
        <div className="grievance-list">
          {grievances.map((item) => {
            const id = String(getId(item))
            const isEditing = editingId === id
            const isBusy = actionLoadingId === id

            return (
              <article className="grievance-item" key={id}>
                {isEditing ? (
                  <div className="form-stack compact-form">
                    <label className="field">
                      <span>Title</span>
                      <input
                        type="text"
                        value={draft.title}
                        onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                      />
                    </label>

                    <label className="field">
                      <span>Description</span>
                      <textarea
                        rows={3}
                        value={draft.description}
                        onChange={(event) =>
                          setDraft((prev) => ({ ...prev, description: event.target.value }))
                        }
                      />
                    </label>

                    <label className="field">
                      <span>Category</span>
                      <select
                        value={draft.category}
                        onChange={(event) => setDraft((prev) => ({ ...prev, category: event.target.value }))}
                      >
                        <option value="Academic">Academic</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Transport">Transport</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>

                    <div className="actions-row">
                      <button
                        type="button"
                        className="primary-btn"
                        disabled={isBusy}
                        onClick={() => handleSave(id)}
                      >
                        {isBusy ? 'Saving...' : 'Save'}
                      </button>
                      <button type="button" className="secondary-btn" onClick={handleCancelEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grievance-top">
                      <h3>{item.title || 'Untitled grievance'}</h3>
                      <span className="status-chip">{item.status || 'Pending'}</span>
                    </div>

                    <p className="grievance-description">{item.description || 'No description provided.'}</p>

                    <div className="meta-row">
                      <span>Category: {item.category || 'Other'}</span>
                      <span>Date: {formatDate(item.createdAt || item.date)}</span>
                    </div>

                    <div className="actions-row">
                      <button type="button" className="secondary-btn" onClick={() => handleStartEdit(item)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="danger-btn"
                        disabled={isBusy}
                        onClick={() => onDelete(id)}
                      >
                        {isBusy ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default GrievanceList
