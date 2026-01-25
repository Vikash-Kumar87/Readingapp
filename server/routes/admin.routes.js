const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const requireAdmin = require('../middleware/admin.middleware');
const { uploadTeacherPhoto, uploadNoteFiles } = require('../config/cloudinary');

// All admin routes require admin authentication
router.use(requireAdmin);

// Admin statistics
router.get('/stats', adminController.getStats);

// User management
router.get('/users', adminController.getAllUsers);

// Teacher management
router.post('/teachers', uploadTeacherPhoto.single('photo'), adminController.createTeacher);
router.put('/teachers/:id', uploadTeacherPhoto.single('photo'), adminController.updateTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);

// Notes management
router.post('/notes', uploadNoteFiles.array('files', 10), adminController.createNotes);
router.delete('/notes/:id', adminController.deleteNote);

module.exports = router;
