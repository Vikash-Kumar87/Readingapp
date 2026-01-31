const Teacher = require('../models/Teacher');
const Note = require('../models/Note');

/**
 * Get all teachers
 * GET /api/teachers
 */
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().sort({ createdAt: -1 });
    
    // Get notes count (with and without videos) for each teacher
    const teachersWithCounts = await Promise.all(
      teachers.map(async (teacher) => {
        const allNotes = await Note.find({ teacher: teacher._id });
        const notesWithoutVideos = allNotes.filter(note => !note.videoUrl);
        const notesWithVideos = allNotes.filter(note => note.videoUrl);
        
        return {
          ...teacher.toObject(),
          totalNotesCount: allNotes.length,
          notesOnlyCount: notesWithoutVideos.length,
          videosCount: notesWithVideos.length
        };
      })
    );
    
    res.json({
      success: true,
      count: teachersWithCounts.length,
      data: teachersWithCounts
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

    // Convert uploaded photo to Base64 and store in database
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      teacherData.profileImage = base64Image;
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

    // Convert uploaded photo to Base64 and store in database
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      updateData.profileImage = base64Image;
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
