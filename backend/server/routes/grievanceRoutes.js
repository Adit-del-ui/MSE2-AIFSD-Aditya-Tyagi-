import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  createGrievance,
  deleteGrievanceById,
  getGrievanceById,
  getGrievances,
  searchGrievances,
  updateGrievance,
} from '../controllers/grievanceController.js'

const router = express.Router()

router.use(protect)

router.get('/search', searchGrievances)
router.route('/').post(createGrievance).get(getGrievances)
router.route('/:id').get(getGrievanceById).put(updateGrievance).delete(deleteGrievanceById)

export default router
