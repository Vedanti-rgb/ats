const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized, no user data' });
    }
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('getUserProfile Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all users
// @route   GET /api/user/all
// @access  Private
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('getAllUsers Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get single user by ID
// @route   GET /api/user/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('getUserById Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      // Check if profile is locked and user is not admin
      const isLocked = user.profileLocked && !user.isAdmin;

      if (isLocked) {
        // If locked, prevent changing name and phone
        if (req.body.name && req.body.name !== user.name) {
          return res.status(403).json({ message: 'Name is locked and cannot be changed' });
        }
        if (req.body.phone && req.body.phone !== user.phone) {
          return res.status(403).json({ message: 'Phone number is locked and cannot be changed' });
        }
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.linkedin = req.body.linkedin || user.linkedin;
      user.location = req.body.location || user.location;
      user.summary = req.body.summary || user.summary;

      // Full Resume Data - with safety checks
      if (req.body.education) user.education = req.body.education;
      if (req.body.experience) user.experience = req.body.experience;
      if (req.body.internships) user.internships = req.body.internships;
      if (req.body.skills) user.skills = req.body.skills;
      if (req.body.projects) user.projects = req.body.projects;

      // Only set profileLocked if it's explicitly passed
      if (req.body.profileLocked !== undefined) {
        if (user.isAdmin) {
          user.profileLocked = req.body.profileLocked;
        } else if (!user.profileLocked && req.body.profileLocked === true) {
          user.profileLocked = true;
        }
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        linkedin: updatedUser.linkedin,
        location: updatedUser.location,
        summary: updatedUser.summary,
        education: updatedUser.education,
        experience: updatedUser.experience,
        internships: updatedUser.internships,
        skills: updatedUser.skills,
        projects: updatedUser.projects,
        profileLocked: updatedUser.profileLocked,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('updateUserProfile Error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  getUserProfile,
  getAllUsers,
  getUserById,
  updateUserProfile,
};
