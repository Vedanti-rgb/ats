const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all users (for admin panel)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Toggle profileLocked for a specific user (admin only)
// @route   PUT /api/admin/users/:id/toggle-lock
// @access  Private/Admin
const toggleUserProfileLock = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Toggle the lock
    user.profileLocked = !user.profileLocked;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileLocked: user.profileLocked,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
    });
});

// @desc    Manually set profileLocked to false (unlock) for a specific user
// @route   PUT /api/admin/users/:id/unlock
// @access  Private/Admin
const unlockUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.profileLocked = false;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileLocked: user.profileLocked,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
    });
});

// @desc    Get all resumes created by all users
// @route   GET /api/admin/resumes
// @access  Private/Admin
const getAllResumes = asyncHandler(async (req, res) => {
    // Dynamically require Resume to avoid circular dependency if any
    const Resume = require('../models/Resume');
    const resumes = await Resume.find({})
        .populate('userId', 'name email lastLogin profileLocked')
        .sort({ createdAt: -1 });
    res.json(resumes);
});

// @desc    Get all secure test attempts across all users
// @route   GET /api/admin/tests
// @access  Private/Admin
const getAllTests = asyncHandler(async (req, res) => {
    const Test = require('../models/Test');
    const tests = await Test.find({})
        .populate('userId', 'name email')
        .populate('resumeId', 'title')
        .sort({ createdAt: -1 });
    res.json(tests);
});

module.exports = {
    getAllUsers,
    toggleUserProfileLock,
    unlockUserProfile,
    getAllResumes,
    getAllTests,
};
