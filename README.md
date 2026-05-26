# DeskFlow - Support Ticket Triage Board

A full-stack MERN application for managing support tickets with automatic SLA tracking and a Kanban-style triage board.

## Features
- Complete MERN stack (MongoDB, Express, React, Node.js)
- SLA tracking with derived fields (`ageMinutes`, `slaBreached`)
- Strict status transition rules enforced on the backend
- Filtering by priority, status, and SLA breach
- Modern, responsive React frontend with Tailwind CSS
- Real-time updates without page reloads (simulated via rapid optimistic UI/polling)

## Tech Stack
**Frontend:** React (Vite), Tailwind CSS, Axios, React Hot Toast
**Backend:** Node.js, Express, MongoDB, Mongoose, CORS, dotenv

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your `MONGO_URI`
4. `npm run dev` (Starts server on port 5000)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env` in `frontend` folder: `VITE_API_URL=http://localhost:5000`
4. `npm run dev` (Starts Vite server)

## Deployment

**Backend (Render, Heroku, etc.)**
- Set environment variables `NODE_ENV=production` and `MONGO_URI`
- Start command: `npm start` (runs `node server.js`)
- Ensure CORS is configured for your frontend domain.

**Frontend (Vercel, Netlify, etc.)**
- Build command: `npm run build`
- Output directory: `dist`
- Set environment variable `VITE_API_URL` to your backend URL.
