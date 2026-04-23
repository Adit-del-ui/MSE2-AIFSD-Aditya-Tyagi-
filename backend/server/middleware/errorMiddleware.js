const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message || 'Server error'

  if (err.name === 'ValidationError') {
    statusCode = 400
  }

  if (err.code === 11000) {
    statusCode = 409
    message = 'Email already exists'
  }

  res.status(statusCode).json({ message })
}

export { notFound, errorHandler }
