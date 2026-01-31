const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');
const {
  getAdminAnalytics,
  getStudentAnalytics
} = require('../controllers/analytics.controller');

/**
 * Analytics Routes
 */

// @route   GET /api/analytics/admin
// @desc    Get admin analytics dashboard
// @access  Private/Admin
router.get('/admin', protect, adminOnly, getAdminAnalytics);

// @route   GET /api/analytics/student
// @desc    Get student analytics dashboard
// @access  Private
router.get('/student', protect, getStudentAnalytics);

module.exports = router;
