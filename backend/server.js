require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ticketRoutes = require('./routes/ticketRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
].filter(Boolean);

const isVercelOrigin = (origin) => typeof origin === 'string' && /https:\/\/.*\.vercel\.app$/.test(origin);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin) || isVercelOrigin(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Health check / root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'DeskFlow API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Mount routers at both /tickets and /api/tickets
app.use('/tickets', ticketRoutes);
app.use('/api/tickets', ticketRoutes);

// Error handler middleware
app.use(errorHandler);

// Catch-all 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database, starting server anyway:', err.message);
    app.listen(PORT, () => {
      console.log(`Server running WITHOUT database on port ${PORT}`);
    });
  });
