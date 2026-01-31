const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Note = require('../models/Note');

/**
 * Get admin dashboard statistics
 * GET /api/admin/stats
 */
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalTeachers, totalNotes] = await Promise.all([
      User.countDocuments(),
      Teacher.countDocuments(),
      Note.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTeachers,
        totalNotes,
        activeSessions: 45 // Mock data
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
};

/**
 * Get all users
 * GET /api/admin/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
};

/**
 * Create new teacher
 * POST /api/admin/teachers
 */
exports.createTeacher = async (req, res) => {
  try {
    const { name, subject, description } = req.body;

    if (!name || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Name and subject are required'
      });
    }

    const teacherData = {
      name,
      subject,
      description: description || '',
      notesCount: 0
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
 * Update teacher
 * PUT /api/admin/teachers/:id
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
 * Delete teacher
 * DELETE /api/admin/teachers/:id
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

/**
 * Create notes (with file upload)
 * POST /api/admin/notes
 */
exports.createNotes = async (req, res) => {
  try {
    const { teacherId, title, price, videoUrl, videoType } = req.body;
    const files = req.files;

    if (!teacherId || !title || !files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Teacher, title, and files are required'
      });
    }

    // Verify teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Create notes for each uploaded file - store as Base64 in database
    const notesData = files.map(file => {
      const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      return {
        title,
        subject: teacher.subject,
        teacher: teacherId,
        fileUrl: base64File,
        fileType: file.mimetype === 'application/pdf' ? 'pdf' : 'image',
        videoUrl: videoUrl || null,
        videoType: videoType || null,
        price: parseFloat(price) || 0,
        isPaid: parseFloat(price) > 0
      };
    });

    const notes = await Note.insertMany(notesData);

    // Update teacher's notes count
    await Teacher.findByIdAndUpdate(teacherId, {
      $inc: { notesCount: files.length }
    });

    res.status(201).json({
      success: true,
      message: `${files.length} note(s) uploaded successfully`,
      data: notes
    });
  } catch (error) {
    console.error('Create notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading notes'
    });
  }
};

/**
 * Delete note
 * DELETE /api/admin/notes/:id
 */
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Update teacher's notes count
    await Teacher.findByIdAndUpdate(note.teacher, {
      $inc: { notesCount: -1 }
    });

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note'
    });
  }
};
