const express = require('express');
const router = express.Router();
const { getUserProfile, getAllUsers, getUserById, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
});

router.get('/all', protect, getAllUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/:id', protect, getUserById);

module.exports = router;
