const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserProfileLock, unlockUserProfile, getAllResumes, getAllTests } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All routes below require: authenticated + isAdmin
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/resumes', protect, adminOnly, getAllResumes);
router.get('/tests', protect, adminOnly, getAllTests);
router.put('/users/:id/toggle-lock', protect, adminOnly, toggleUserProfileLock);
router.put('/users/:id/unlock', protect, adminOnly, unlockUserProfile);

module.exports = router;
