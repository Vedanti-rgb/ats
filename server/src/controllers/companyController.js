const Company = require('../models/Company');
const asyncHandler = require('../middleware/asyncHandler');

// Regular Expressions for Validations
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const websiteRegex = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const cinRegex = /^[U|L][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

// Validation helper
const validateCompanyInputs = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.officialEmail !== undefined) {
    if (!data.officialEmail) errors.officialEmail = 'Official Email is required';
    else if (!emailRegex.test(data.officialEmail)) errors.officialEmail = 'Invalid Email format';
  }

  if (!isUpdate || data.hrEmail !== undefined) {
    if (!data.hrEmail) errors.hrEmail = 'HR Contact Email is required';
    else if (!emailRegex.test(data.hrEmail)) errors.hrEmail = 'Invalid HR Contact Email format';
  }

  if (!isUpdate || data.website !== undefined) {
    if (!data.website) errors.website = 'Official Website is required';
    else if (!websiteRegex.test(data.website)) errors.website = 'Invalid Website URL format';
  }

  if (data.gst) {
    if (!gstRegex.test(data.gst)) errors.gst = 'Invalid GST format (must be 15-character alphanumeric, e.g. 22AAAAA0000A1Z5)';
  }

  if (data.pan) {
    if (!panRegex.test(data.pan)) errors.pan = 'Invalid PAN format (must be 10-character alphanumeric, e.g. ABCDE1234F)';
  }

  if (data.cin) {
    if (!cinRegex.test(data.cin)) errors.cin = 'Invalid CIN format (must be 21-character alphanumeric, e.g. U12345MH2010PTC123456)';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// @desc    Register a new company profile
// @route   POST /api/company/register
// @access  Private
const registerCompany = asyncHandler(async (req, res) => {
  const existingCompany = await Company.findOne({ user: req.user._id });
  if (existingCompany) {
    res.status(400);
    throw new Error('You have already registered a company profile');
  }

  const { isValid, errors } = validateCompanyInputs(req.body);
  if (!isValid) {
    res.status(400);
    return res.json({ message: 'Validation failed', errors });
  }

  const {
    companyName,
    officialEmail,
    website,
    phone,
    hrName,
    hrEmail,
    hrPhone,
    industry,
    companyType,
    companySize,
    yearEstablished,
    country,
    state,
    city,
    address,
    postalCode,
    description,
    cin,
    gst,
    pan,
    registrationNumber,
    linkedin,
    careersPage,
    logo,
    documents,
  } = req.body;

  // Check duplicates on officialEmail, cin, gst
  const duplicateQuery = [{ officialEmail }];
  if (cin) duplicateQuery.push({ cin });
  if (gst) duplicateQuery.push({ gst });

  const duplicate = await Company.findOne({ $or: duplicateQuery });
  if (duplicate) {
    if (duplicate.officialEmail === officialEmail) {
      res.status(400);
      throw new Error('A company with this Official Email already exists');
    }
    if (cin && duplicate.cin === cin) {
      res.status(400);
      throw new Error('A company with this CIN already exists');
    }
    if (gst && duplicate.gst === gst) {
      res.status(400);
      throw new Error('A company with this GST Number already exists');
    }
  }

  const company = await Company.create({
    user: req.user._id,
    companyName,
    officialEmail,
    website,
    phone,
    hrName,
    hrEmail,
    hrPhone,
    industry,
    companyType,
    companySize,
    yearEstablished,
    country,
    state,
    city,
    address,
    postalCode,
    description,
    cin,
    gst,
    pan,
    registrationNumber,
    linkedin,
    careersPage,
    logo,
    documents,
    verificationStatus: 'Pending',
    submittedAt: new Date(),
  });

  res.status(201).json(company);
});

// @desc    Get logged in user's company profile
// @route   GET /api/company/profile
// @access  Private
const getCompanyProfile = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });
  if (!company) {
    return res.status(404).json({ message: 'No company profile found for this user' });
  }
  res.json(company);
});

// @desc    Update user's company profile
// @route   PUT /api/company/update
// @access  Private
const updateCompanyProfile = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ user: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error('Company profile not found');
  }

  const { isValid, errors } = validateCompanyInputs(req.body, true);
  if (!isValid) {
    res.status(400);
    return res.json({ message: 'Validation failed', errors });
  }

  const {
    companyName,
    officialEmail,
    website,
    phone,
    hrName,
    hrEmail,
    hrPhone,
    industry,
    companyType,
    companySize,
    yearEstablished,
    country,
    state,
    city,
    address,
    postalCode,
    description,
    cin,
    gst,
    pan,
    registrationNumber,
    linkedin,
    careersPage,
    logo,
    documents,
  } = req.body;

  // Duplicate checks if officialEmail, cin, or gst are changing
  const duplicateQuery = [];
  if (officialEmail && officialEmail !== company.officialEmail) duplicateQuery.push({ officialEmail });
  if (cin && cin !== company.cin) duplicateQuery.push({ cin });
  if (gst && gst !== company.gst) duplicateQuery.push({ gst });

  if (duplicateQuery.length > 0) {
    const duplicate = await Company.findOne({ $or: duplicateQuery });
    if (duplicate) {
      if (officialEmail && duplicate.officialEmail === officialEmail) {
        res.status(400);
        throw new Error('A company with this Official Email already exists');
      }
      if (cin && duplicate.cin === cin) {
        res.status(400);
        throw new Error('A company with this CIN already exists');
      }
      if (gst && duplicate.gst === gst) {
        res.status(400);
        throw new Error('A company with this GST Number already exists');
      }
    }
  }

  // Update fields
  company.companyName = companyName || company.companyName;
  company.officialEmail = officialEmail || company.officialEmail;
  company.website = website || company.website;
  company.phone = phone || company.phone;
  company.hrName = hrName || company.hrName;
  company.hrEmail = hrEmail || company.hrEmail;
  company.hrPhone = hrPhone !== undefined ? hrPhone : company.hrPhone;
  company.industry = industry || company.industry;
  company.companyType = companyType || company.companyType;
  company.companySize = companySize || company.companySize;
  company.yearEstablished = yearEstablished || company.yearEstablished;
  company.country = country !== undefined ? country : company.country;
  company.state = state !== undefined ? state : company.state;
  company.city = city !== undefined ? city : company.city;
  company.address = address !== undefined ? address : company.address;
  company.postalCode = postalCode !== undefined ? postalCode : company.postalCode;
  company.description = description !== undefined ? description : company.description;
  company.cin = cin !== undefined ? cin : company.cin;
  company.gst = gst !== undefined ? gst : company.gst;
  company.pan = pan !== undefined ? pan : company.pan;
  company.registrationNumber = registrationNumber !== undefined ? registrationNumber : company.registrationNumber;
  company.linkedin = linkedin !== undefined ? linkedin : company.linkedin;
  company.careersPage = careersPage !== undefined ? careersPage : company.careersPage;
  company.logo = logo !== undefined ? logo : company.logo;
  company.documents = documents !== undefined ? documents : company.documents;

  // Reset verification to Pending if it was Rejected previously, to allow resubmission
  if (company.verificationStatus === 'Rejected') {
    company.verificationStatus = 'Pending';
    company.rejectionReason = '';
    company.submittedAt = new Date();
  }

  const updatedCompany = await company.save();
  res.json(updatedCompany);
});

// @desc    Get user's company status
// @route   GET /api/company/status
// @access  Private
const getCompanyStatus = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ user: req.user._id }).select('verificationStatus rejectionReason companyName');
  if (!company) {
    return res.json({ status: 'Not Registered' });
  }
  res.json({
    status: company.verificationStatus,
    rejectionReason: company.rejectionReason,
    companyName: company.companyName,
  });
});

// @desc    Get all companies (Admin only)
// @route   GET /api/company/all
// @access  Private/Admin
const getAllCompanies = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const status = req.query.status;
  const search = req.query.search;

  const query = {};
  if (status && status !== 'All') {
    query.verificationStatus = status;
  }
  if (search) {
    query.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { industry: { $regex: search, $options: 'i' } },
      { officialEmail: { $regex: search, $options: 'i' } },
    ];
  }

  const count = await Company.countDocuments(query);
  const companies = await Company.find(query)
    .populate('user', 'name email')
    .sort({ submittedAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    companies,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Verify/Approve a company (Admin only)
// @route   PUT /api/company/verify/:id
// @access  Private/Admin
const verifyCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  company.verificationStatus = 'Verified';
  company.rejectionReason = '';
  company.verifiedBy = req.user._id;

  const updatedCompany = await company.save();
  res.json(updatedCompany);
});

// @desc    Reject a company verification with reason (Admin only)
// @route   PUT /api/company/reject/:id
// @access  Private/Admin
const rejectCompany = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;
  if (!rejectionReason) {
    res.status(400);
    throw new Error('Please provide a rejection reason');
  }

  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  company.verificationStatus = 'Rejected';
  company.rejectionReason = rejectionReason;
  company.verifiedBy = req.user._id;

  const updatedCompany = await company.save();
  res.json(updatedCompany);
});

// @desc    Delete a company profile (Admin only)
// @route   DELETE /api/company/:id
// @access  Private/Admin
const deleteCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  await company.deleteOne();
  res.json({ message: 'Company profile removed successfully' });
});

module.exports = {
  registerCompany,
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyStatus,
  getAllCompanies,
  verifyCompany,
  rejectCompany,
  deleteCompany,
};
