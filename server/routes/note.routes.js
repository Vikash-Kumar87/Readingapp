const express = require('express');
const router = express.Router();
const multer = require('multer');
const noteController = require('../controllers/note.controller');
const { requireAdmin } = require('../middleware/admin.middleware');
const { requireAuth } = require('../middleware/auth.middleware');

// Configure multer for memory storage (Base64)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Public routes
router.get('/', noteController.getAllNotes);
router.get('/subject/:subject', noteController.getNotesBySubject);
router.get('/teacher/:teacherId', noteController.getNotesByTeacher);
router.get('/:id', noteController.getNoteById);

// Protected routes
router.post('/purchase/:id', requireAuth, noteController.purchaseNote);

// Admin only routes
router.post('/', requireAdmin, upload.single('file'), noteController.createNote);
router.put('/:id', requireAdmin, noteController.updateNote);
router.delete('/:id', requireAdmin, noteController.deleteNote);

module.exports = router;
