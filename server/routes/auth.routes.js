const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getCurrentUser);

// Protected routes
router.put('/change-password', authController.changePassword);
router.put('/change-email', authController.changeEmail);

module.exports = router;
