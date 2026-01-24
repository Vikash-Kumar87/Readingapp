const User = require('../models/User');

/**
 * Register new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Create session for new user
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;
    req.session.name = user.name;

    // Save session and send response
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          success: false,
          message: 'User created but error saving session'
        });
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create session
    req.session.userId = user._id;
    req.session.isAdmin = user.isAdmin;
    req.session.name = user.name;

    // Save session and send response
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error saving session'
        });
      }

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Logout user
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error during logout'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
};

/**
 * Get current user
 * GET /api/auth/me
 */
exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const user = await User.findById(req.session.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        purchasedNotes: user.purchasedNotes
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Change Password
 * PUT /api/auth/change-password
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    console.log('🔐 Change Password Request:', { 
      userId: req.session.userId,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword 
    });

    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Find user
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();
    
    console.log('✅ Password changed successfully for user:', user.email);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Change Email
 * PUT /api/auth/change-email
 */
exports.changeEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('📧 Change Email Request:', { 
      userId: req.session.userId,
      newEmail: email,
      hasPassword: !!password 
    });

    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    // Update email
    user.email = email;
    await user.save();
    
    console.log('✅ Email changed successfully for user:', user._id);

    res.json({
      success: true,
      message: 'Email updated successfully'
    });
  } catch (error) {
    console.error('Change email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
