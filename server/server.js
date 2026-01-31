require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const teacherRoutes = require('./routes/teacher.routes');
const noteRoutes = require('./routes/note.routes');
const analyticsRoutes = require('./routes/analytics.routes');

// Initialize express app
const app = express();

// Trust proxy - Required for Render and other proxy services
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Helper function to normalize URLs (remove trailing slash)
const normalizeUrl = (url) => {
  if (!url) return url;
  return url.replace(/\/$/, '');
};

// Middleware - Enhanced CORS for mobile browsers
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Normalize the incoming origin
    const normalizedOrigin = normalizeUrl(origin);
    
    // Allow all Vercel preview/deployment URLs
    if (normalizedOrigin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow Render URLs
    if (normalizedOrigin.includes('onrender.com')) {
      return callback(null, true);
    }
    
    // Check specific allowed origins
    const allowedOrigins = [
      normalizeUrl(process.env.FRONTEND_URL),
      'http://localhost:5173',
      'http://localhost:3000'
    ].filter(Boolean);
    
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins in production for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
  exposedHeaders: ['set-cookie', 'Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration - Mobile friendly with MongoDB store
app.use(session({
  secret: process.env.SESSION_SECRET || 'mysecretkey123',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600, // Lazy session update - only update session once per 24 hours unless changed
    crypto: {
      secret: process.env.SESSION_SECRET || 'mysecretkey123'
    },
    ttl: 24 * 60 * 60, // Session TTL (1 day) in seconds
    autoRemove: 'native', // Let MongoDB handle expired session cleanup
    stringify: false
  }),
  proxy: true, // Trust the reverse proxy (Render)
  name: 'connect.sid', // Standard cookie name for better compatibility
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-site in production
    path: '/', // Explicitly set cookie path
  }
}));

// Serve old uploaded files (for backward compatibility)
// New uploads will go to Cloudinary
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
console.log('About to start server on port', PORT);

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`💻 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Server is actively listening...');
  
  // Keep the process alive
  setInterval(() => {
    console.log('Server heartbeat:', new Date().toISOString());
  }, 10000);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
