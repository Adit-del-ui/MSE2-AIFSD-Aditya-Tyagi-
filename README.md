# Student Grievance Management System

A full-stack web app where students can register, log in, submit grievances, and track grievance progress.

## Features

- Student registration and login with JWT authentication
- Protected dashboard route
- Create grievance
- View own grievances
- Search grievances by title
- Update grievance details
- Delete grievance
- Logout
- Minimal responsive UI

## Tech Stack

### Frontend

- React (Vite)
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- bcrypt
- jsonwebtoken
- dotenv
- cors

## Project Structure

```text
Grievance_management_system/
  frontend/
  backend/
	 server/
		config/
		controllers/
		middleware/
		models/
		routes/
```

## API Endpoints

### Auth

- POST /register
- POST /login

### Grievances (JWT protected)

- POST /grievances
- GET /grievances
- GET /grievances/:id
- PUT /grievances/:id
- DELETE /grievances/:id
- GET /grievances/search?title=keyword

## Environment Variables

### Backend (.env)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5174
PORT=5000
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Important Note (CORS)

`CLIENT_URL` must exactly match the frontend origin.

Example:

- If frontend runs on `http://localhost:5173`, set `CLIENT_URL=http://localhost:5173`
- If frontend runs on `http://localhost:5174`, set `CLIENT_URL=http://localhost:5174`

## Local Setup

### 1. Clone repository

```bash
git clone <your-repo-url>
cd Grievance_management_system
```

### 2. Setup frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Setup backend

Open a new terminal:

```bash
cd backend
npm install
npm run dev
```

## Build Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Current Status Rules

- Students can create, view, update, and delete their own grievances.
- Status field is supported by backend update API.
- Current dashboard UI does not include a status dropdown yet, so resolving from frontend is not exposed by default.

## Deployment

### Backend on Render

1. Push repo to GitHub.
2. Create a new Web Service in Render.
3. Set Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variables:
	- `MONGO_URI`
	- `JWT_SECRET`
	- `CLIENT_URL` (your Vercel frontend URL)
	- `PORT=5000`
7. Deploy.

### Frontend on Vercel

1. Import repo in Vercel.
2. Set Root Directory to `frontend`.
3. Framework preset: Vite.
4. Build Command: `npm run build`
5. Output directory: `dist`
6. Add environment variable:
	- `VITE_API_BASE_URL=https://your-render-backend-url`
7. Deploy.

## Common Issues

### CORS blocked in browser

- Cause: backend `CLIENT_URL` does not match frontend URL
- Fix: update backend `.env` and restart backend service

### Unauthorized errors

- Cause: missing or invalid JWT
- Fix: log in again and ensure Authorization header is sent as `Bearer <token>`

### MongoDB connection failure

- Cause: incorrect `MONGO_URI` or network restrictions
- Fix: verify URI and allow network access in MongoDB Atlas

## Future Improvements

- Admin role and admin dashboard
- Allow only admin to mark grievances as Resolved
- Pagination for grievance list
- Validation library for stronger request validation
- Better audit logs for status updates
