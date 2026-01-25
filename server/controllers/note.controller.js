const Note = require('../models/Note');
const Teacher = require('../models/Teacher');
const User = require('../models/User');

/**
 * Get all notes
 * GET /api/notes
 */
exports.getAllNotes = async (req, res) => {
  try {
    const { subject } = req.query;
    
    let query = {};
    if (subject) {
      query.subject = subject;
    }

    const notes = await Note.find(query)
      .populate('teacher', 'name subject')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get all notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes'
    });
  }
};

/**
 * Get notes by subject
 * GET /api/notes/subject/:subject
 */
exports.getNotesBySubject = async (req, res) => {
  try {
    const notes = await Note.find({ subject: req.params.subject })
      .populate('teacher', 'name subject')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get notes by subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes'
    });
  }
};

/**
 * Get notes by teacher
 * GET /api/notes/teacher/:teacherId
 */
exports.getNotesByTeacher = async (req, res) => {
  try {
    const notes = await Note.find({ teacher: req.params.teacherId })
      .populate('teacher', 'name subject')
      .sort({ createdAt: 1 }); // Sort by oldest first

    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('Get notes by teacher error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes'
    });
  }
};

/**
 * Get single note
 * GET /api/notes/:id
 */
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('teacher', 'name subject');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if user has purchased this note
    let hasAccess = !note.isPaid; // Free notes are accessible
    
    if (req.session && req.session.userId && note.isPaid) {
      const user = await User.findById(req.session.userId);
      hasAccess = user && user.purchasedNotes.includes(note._id);
    }

    res.json({
      success: true,
      data: {
        ...note.toObject(),
        hasAccess
      }
    });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching note'
    });
  }
};

/**
 * Create new note (Admin only)
 * POST /api/notes
 */
exports.createNote = async (req, res) => {
  try {
    const { title, subject, teacher, price, isPaid, fileType } = req.body;

    if (!title || !subject || !teacher) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, subject, and teacher'
      });
    }

    // Check if teacher exists
    const teacherExists = await Teacher.findById(teacher);
    if (!teacherExists) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    // Handle file upload (if file was uploaded to Cloudinary)
    let fileUrl = req.body.fileUrl || 'https://via.placeholder.com/800x1000?text=Note';
    if (req.file) {
      fileUrl = req.file.path; // Cloudinary URL
    }

    const note = await Note.create({
      title,
      subject,
      teacher,
      fileUrl,
      fileType: fileType || 'image',
      price: price || 0,
      isPaid: isPaid || false
    });

    // Update teacher's notes count
    await Teacher.findByIdAndUpdate(teacher, {
      $inc: { notesCount: 1 }
    });

    const populatedNote = await Note.findById(note._id)
      .populate('teacher', 'name subject');

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: populatedNote
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating note'
    });
  }
};

/**
 * Update note (Admin only)
 * PUT /api/notes/:id
 */
exports.updateNote = async (req, res) => {
  try {
    const { title, subject, price, isPaid } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { title, subject, price, isPaid },
      { new: true, runValidators: true }
    ).populate('teacher', 'name subject');

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating note'
    });
  }
};

/**
 * Delete note (Admin only)
 * DELETE /api/notes/:id
 */
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

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

    await note.deleteOne();

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

/**
 * Purchase note
 * POST /api/notes/purchase/:id
 */
exports.purchaseNote = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to purchase notes'
      });
    }

    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    const user = await User.findById(req.session.userId);

    // Check if already purchased
    if (user.purchasedNotes.includes(note._id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already purchased this note'
      });
    }

    // Add to purchased notes (assuming payment is successful)
    user.purchasedNotes.push(note._id);
    await user.save();

    res.json({
      success: true,
      message: 'Note purchased successfully',
      data: {
        noteId: note._id,
        title: note.title,
        price: note.price
      }
    });
  } catch (error) {
    console.error('Purchase note error:', error);
    res.status(500).json({
      success: false,
      message: 'Error purchasing note'
    });
  }
};
