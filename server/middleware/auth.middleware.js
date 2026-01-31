/**
 * Authentication Middleware
 * Checks if user is logged in via session and attaches user to request
 * Enhanced for mobile browser compatibility
 */
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // Debug logging for mobile troubleshooting
    console.log('Session check:', {
      hasSession: !!req.session,
      sessionId: req.sessionID,
      userId: req.session?.userId,
      cookie: req.headers.cookie ? 'present' : 'missing'
    });

    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please login first.',
        sessionExpired: true // Flag for frontend to handle
      });
    }

    // Attach user to request
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.',
        sessionExpired: true
      });
    }

    // Refresh session on each request for mobile
    req.session.touch();

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login first.'
    });
  }
  next();
};

module.exports = { protect, requireAuth };
