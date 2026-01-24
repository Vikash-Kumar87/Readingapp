const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const noteController = require('../controllers/note.controller');
const requireAdmin = require('../middleware/admin.middleware');
const requireAuth = require('../middleware/auth.middleware');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'note-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs only
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
    fileSize: 10 * 1024 * 1024 // 10MB max file size
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
