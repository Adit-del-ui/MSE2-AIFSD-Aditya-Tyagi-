import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Student from '../models/Student.js'
import asyncHandler from '../middleware/asyncHandler.js'

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const registerStudent = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email, and password are required')
  }

  const existing = await Student.findOne({ email: email.toLowerCase() })
  if (existing) {
    res.status(409)
    throw new Error('Email already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const student = await Student.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  })

  res.status(201).json({
    message: 'Registration successful',
    user: {
      id: student._id,
      name: student.name,
      email: student.email,
    },
  })
})

const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Email and password are required')
  }

  const student = await Student.findOne({ email: email.toLowerCase() })
  if (!student) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  const isValid = await bcrypt.compare(password, student.password)
  if (!isValid) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.status(200).json({
    token: generateToken(student._id),
    user: {
      id: student._id,
      name: student.name,
      email: student.email,
    },
  })
})

export { registerStudent, loginStudent }
