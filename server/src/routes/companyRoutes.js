const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  registerCompany,
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyStatus,
  getAllCompanies,
  verifyCompany,
  rejectCompany,
  deleteCompany,
} = require('../controllers/companyController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// ─── MULTER DISK STORAGE CONFIGURATION ─────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    // Ensure uploads directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.'));
    }
  },
});

// Helper route for file uploads (handles single file upload, e.g. for drag-and-drop UI)
router.post('/upload', protect, (req, res, next) => {
  // Use a custom error handler to return clean JSON when multer errors out
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    // Return relative file path that is statically served
    const relativePath = `/uploads/${req.file.filename}`;
    res.json({
      path: relativePath,
      originalName: req.file.originalname,
      filename: req.file.filename,
    });
  });
});

// Candidate endpoints
router.route('/register').post(protect, registerCompany);
router.route('/profile').get(protect, getCompanyProfile);
router.route('/update').put(protect, updateCompanyProfile);
router.route('/status').get(protect, getCompanyStatus);

// Admin endpoints
router.route('/all').get(protect, adminOnly, getAllCompanies);
router.route('/verify/:id').put(protect, adminOnly, verifyCompany);
router.route('/reject/:id').put(protect, adminOnly, rejectCompany);
router.route('/:id').delete(protect, adminOnly, deleteCompany);

module.exports = router;
