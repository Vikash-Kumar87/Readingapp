const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/admin.controller');
const { requireAdmin } = require('../middleware/admin.middleware');

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

// All admin routes require admin authentication
router.use(requireAdmin);

// Admin statistics
router.get('/stats', adminController.getStats);

// User management
router.get('/users', adminController.getAllUsers);

// Teacher management
router.post('/teachers', upload.single('photo'), adminController.createTeacher);
router.put('/teachers/:id', upload.single('photo'), adminController.updateTeacher);
router.delete('/teachers/:id', adminController.deleteTeacher);

// Notes management
router.post('/notes', upload.array('files', 10), adminController.createNotes);
router.delete('/notes/:id', adminController.deleteNote);

module.exports = router;
