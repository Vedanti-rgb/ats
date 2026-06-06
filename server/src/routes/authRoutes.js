const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  logoutUser,
  refreshAccessToken,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/refresh', refreshAccessToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


router.get('/me', protect, async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email, isAdmin: req.user.isAdmin });
});

module.exports = router;
