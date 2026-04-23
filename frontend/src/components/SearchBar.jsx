function SearchBar({ value, onChange, onClear }) {
  return (
    <section className="card">
      <h2>Search Grievances</h2>
      <div className="search-wrap">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by title"
        />
        {value && (
          <button type="button" className="secondary-btn" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
    </section>
  )
}

export default SearchBar
