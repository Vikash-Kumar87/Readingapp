const Teacher = require('../models/Teacher');
const Note = require('../models/Note');

/**
 * Get all teachers
 * GET /api/teachers
 */
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers'
    });
  }
};

/**
 * Get single teacher
 * GET /api/teachers/:id
 */
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Get teacher's notes
    const notes = await Note.find({ teacher: teacher._id });

    res.json({
      success: true,
      data: {
        ...teacher.toObject(),
        notes
      }
    });
  } catch (error) {
    console.error('Get teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teacher'
    });
  }
};

/**
 * Create new teacher (Admin only)
 * POST /api/teachers
 */
exports.createTeacher = async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    if (!name || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and subject'
      });
    }

    const teacherData = {
      name,
      subject,
      description
    };

    // Add photo URL if file was uploaded to Cloudinary
    if (req.file) {
      teacherData.profileImage = req.file.path; // Cloudinary URL
    }

    const teacher = await Teacher.create(teacherData);

    res.status(201).json({
      success: true,
      message: 'Teacher created successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Create teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating teacher'
    });
  }
};

/**
 * Update teacher (Admin only)
 * PUT /api/teachers/:id
 */
exports.updateTeacher = async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    const updateData = { name, subject, description };

    // Add photo URL if new file was uploaded to Cloudinary
    if (req.file) {
      updateData.profileImage = req.file.path; // Cloudinary URL
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher
    });
  } catch (error) {
    console.error('Update teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating teacher'
    });
  }
};

/**
 * Delete teacher (Admin only)
 * DELETE /api/teachers/:id
 */
exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Also delete all notes by this teacher
    await Note.deleteMany({ teacher: req.params.id });

    res.json({
      success: true,
      message: 'Teacher and associated notes deleted successfully'
    });
  } catch (error) {
    console.error('Delete teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting teacher'
    });
  }
};
