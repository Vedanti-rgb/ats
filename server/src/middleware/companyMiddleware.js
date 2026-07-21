const Company = require('../models/Company');

const verifiedCompanyOrAdmin = async (req, res, next) => {
  try {
    if (req.user) {
      // Admins are always allowed
      if (req.user.isAdmin) {
        return next();
      }

      // Check if user has registered a verified company
      const company = await Company.findOne({ user: req.user._id });
      if (company && company.verificationStatus === 'Verified') {
        req.company = company; // Attach company context to request if needed
        return next();
      }
    }

    res.status(403);
    throw new Error('Access denied. Company verification is required to perform this action.');
  } catch (err) {
    next(err);
  }
};

module.exports = { verifiedCompanyOrAdmin };
