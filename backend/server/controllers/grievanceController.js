import mongoose from 'mongoose'
import Grievance from '../models/Grievance.js'
import asyncHandler from '../middleware/asyncHandler.js'

const createGrievance = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body

  if (!title || !description || !category) {
    res.status(400)
    throw new Error('Title, description, and category are required')
  }

  const grievance = await Grievance.create({
    title,
    description,
    category,
    user: req.user._id,
  })

  res.status(201).json(grievance)
})

const getGrievances = asyncHandler(async (req, res) => {
  const grievances = await Grievance.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.status(200).json(grievances)
})

const getGrievanceById = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400)
    throw new Error('Invalid grievance id')
  }

  const grievance = await Grievance.findOne({ _id: id, user: req.user._id })
  if (!grievance) {
    res.status(404)
    throw new Error('Grievance not found')
  }

  res.status(200).json(grievance)
})

const updateGrievance = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400)
    throw new Error('Invalid grievance id')
  }

  const grievance = await Grievance.findOne({ _id: id, user: req.user._id })
  if (!grievance) {
    res.status(404)
    throw new Error('Grievance not found')
  }

  const allowedFields = ['title', 'description', 'category', 'status']
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      grievance[field] = req.body[field]
    }
  })

  const updated = await grievance.save()
  res.status(200).json(updated)
})

const deleteGrievanceById = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400)
    throw new Error('Invalid grievance id')
  }

  const grievance = await Grievance.findOne({ _id: id, user: req.user._id })
  if (!grievance) {
    res.status(404)
    throw new Error('Grievance not found')
  }

  await grievance.deleteOne()
  res.status(200).json({ message: 'Grievance deleted successfully' })
})

const searchGrievances = asyncHandler(async (req, res) => {
  const title = req.query.title || ''

  const grievances = await Grievance.find({
    user: req.user._id,
    title: { $regex: title, $options: 'i' },
  }).sort({ createdAt: -1 })

  res.status(200).json(grievances)
})

export {
  createGrievance,
  getGrievances,
  getGrievanceById,
  updateGrievance,
  deleteGrievanceById,
  searchGrievances,
}
