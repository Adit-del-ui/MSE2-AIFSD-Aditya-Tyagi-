import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import grievanceRoutes from './routes/grievanceRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

dotenv.config({ path: './.env' })

connectDB()

const app = express()

app.use(
  cors({
    origin: 'https://grivy.vercel.app',
    credentials: true,
  }),
)

app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

app.use('/api', authRoutes)
app.use('/api/grievances', grievanceRoutes)
app.use('/', authRoutes)
app.use('/grievances', grievanceRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
