const mongoose = require('mongoose');

const companySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true, // One company per user for now
    },
    companyName: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    officialEmail: {
      type: String,
      required: [true, 'Please add an official email address'],
      unique: true,
    },
    website: {
      type: String,
      required: [true, 'Please add the official website'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a company phone number'],
    },
    hrName: {
      type: String,
      required: [true, 'Please add the HR contact person name'],
    },
    hrEmail: {
      type: String,
      required: [true, 'Please add the HR contact email'],
    },
    hrPhone: {
      type: String,
    },
    industry: {
      type: String,
      required: [true, 'Please select the industry'],
    },
    companySize: {
      type: String,
      required: [true, 'Please select the company size'],
    },
    companyType: {
      type: String,
      required: [true, 'Please select the company type'],
    },
    yearEstablished: {
      type: Number,
      required: [true, 'Please add the establishment year'],
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    postalCode: {
      type: String,
    },
    description: {
      type: String,
      maxLength: [500, 'Description cannot exceed 500 characters'],
    },
    cin: {
      type: String,
      unique: true,
      sparse: true, // Allows null/empty values without violating unique constraint
    },
    gst: {
      type: String,
      unique: true,
      sparse: true, // Allows null/empty values without violating unique constraint
    },
    pan: {
      type: String,
    },
    registrationNumber: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    careersPage: {
      type: String,
    },
    logo: {
      type: String, // Logo file path/URL
    },
    documents: [
      {
        name: { type: String, required: true }, // e.g. 'Certificate of Incorporation'
        path: { type: String, required: true }, // e.g. '/uploads/doc-xyz.pdf'
        originalName: { type: String },
      }
    ],
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Under Review', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
