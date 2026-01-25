const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const requireAdmin = require('../middleware/admin.middleware');
const requireAuth = require('../middleware/auth.middleware');
const { uploadNoteFiles } = require('../config/cloudinary');

// Public routes
router.get('/', noteController.getAllNotes);
router.get('/subject/:subject', noteController.getNotesBySubject);
router.get('/teacher/:teacherId', noteController.getNotesByTeacher);
router.get('/:id', noteController.getNoteById);

// Protected routes
router.post('/purchase/:id', requireAuth, noteController.purchaseNote);

// Admin only routes
router.post('/', requireAdmin, uploadNoteFiles.single('file'), noteController.createNote);
router.put('/:id', requireAdmin, noteController.updateNote);
router.delete('/:id', requireAdmin, noteController.deleteNote);

module.exports = router;
