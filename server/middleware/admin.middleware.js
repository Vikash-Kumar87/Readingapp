/**
 * Admin Middleware
 * Checks if user is admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login first.'
    });
  }

  if (!req.session.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin access required.'
    });
  }

  next();
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Please login first.'
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden. Admin access required.'
    });
  }

  next();
};

module.exports = { requireAdmin, adminOnly };
