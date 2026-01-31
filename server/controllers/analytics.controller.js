const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Note = require('../models/Note');

/**
 * @desc    Get admin analytics dashboard data
 * @route   GET /api/analytics/admin
 * @access  Private/Admin
 */
exports.getAdminAnalytics = async (req, res) => {
  try {
    // Get total counts
    const [totalUsers, totalTeachers, totalNotes] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      Teacher.countDocuments(),
      Note.countDocuments()
    ]);

    // Get users with purchases
    const usersWithPurchases = await User.countDocuments({
      isAdmin: false,
      'purchasedNotes.0': { $exists: true }
    });

    // Get total revenue from all note purchases
    const users = await User.find({ isAdmin: false }).select('purchasedNotes');
    const allNotes = await Note.find();
    let totalRevenue = 0;
    
    users.forEach(user => {
      user.purchasedNotes?.forEach(noteId => {
        const note = allNotes.find(n => n._id.toString() === noteId.toString());
        if (note) {
          totalRevenue += note.price;
        }
      });
    });

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      isAdmin: false,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get top teachers by rating
    const topTeachers = await Teacher.find()
      .sort({ 'rating.average': -1 })
      .limit(5)
      .select('name subject rating notesCount');

    // Get students with most purchases
    const topStudents = await User.find({ isAdmin: false })
      .sort({ 'purchasedNotes.length': -1 })
      .limit(5)
      .select('name email purchasedNotes');

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents: totalUsers,
          totalTeachers,
          totalNotes,
          activeStudents: usersWithPurchases,
          totalRevenue: Math.round(totalRevenue),
          newStudentsThisWeek: newUsersThisWeek
        },
        topTeachers,
        topStudents,
        recentActivity: []
      }
    });
  } catch (error) {
    console.error('Get admin analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

/**
 * @desc    Get student dashboard analytics
 * @route   GET /api/analytics/student
 * @access  Private
 */
exports.getStudentAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId)
      .populate('purchasedNotes');

    // Weekly activity data (mock for now - can be enhanced with real tracking)
    const weeklyActivity = [
      { day: 'Mon', notes: Math.floor(Math.random() * 5) },
      { day: 'Tue', notes: Math.floor(Math.random() * 5) },
      { day: 'Wed', notes: Math.floor(Math.random() * 5) },
      { day: 'Thu', notes: Math.floor(Math.random() * 5) },
      { day: 'Fri', notes: Math.floor(Math.random() * 5) },
      { day: 'Sat', notes: Math.floor(Math.random() * 5) },
      { day: 'Sun', notes: Math.floor(Math.random() * 5) }
    ];

    res.json({
      success: true,
      data: {
        stats: {
          purchasedNotes: user.purchasedNotes?.length || 0,
          currentStreak: 0,
          longestStreak: 0,
          readingProgress: 0
        },
        weeklyActivity,
        recentActivity: [],
        topSubjects: []
      }
    });
  } catch (error) {
    console.error('Get student analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};
