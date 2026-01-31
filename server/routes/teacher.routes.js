const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const { requireAdmin } = require('../middleware/admin.middleware');

// Public routes
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);

// Admin only routes
router.post('/', requireAdmin, teacherController.createTeacher);
router.put('/:id', requireAdmin, teacherController.updateTeacher);
router.delete('/:id', requireAdmin, teacherController.deleteTeacher);

module.exports = router;
