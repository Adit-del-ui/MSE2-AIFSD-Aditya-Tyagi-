import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: token missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const student = await Student.findById(decoded.id).select('-password')

    if (!student) {
      return res.status(401).json({ message: 'Unauthorized: user not found' })
    }

    req.user = student
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: invalid token' })
  }
}

export default protect
