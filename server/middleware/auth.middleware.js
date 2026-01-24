/**
 * Authentication Middleware
 * Checks if user is logged in via session
 */
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login first.'
    });
  }
  next();
};

module.exports = requireAuth;
