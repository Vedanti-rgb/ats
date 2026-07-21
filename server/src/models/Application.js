const mongoose = require('mongoose');

const applicationSchema = mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Job',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Company that owns the job posting (for access-control on resume downloads)
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    // The exact resume PDF stored at time of application (permanent snapshot)
    resumePdf: {
      type: String, // Path or URL to the stored PDF file
    },
    // Original file name shown in recruiter view
    resumeFileName: {
      type: String,
      default: '',
    },
    // 'Builder' = selected from Resume Builder | 'Upload' = uploaded PDF
    resumeSource: {
      type: String,
      enum: ['Builder', 'Upload'],
      default: 'Builder',
    },
    // Stored resume JSON structure at time of application (immutable snapshot)
    resumeJson: {
      type: Object,
    },
    applicantDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Interview Scheduled', 'Selected'],
      default: 'Applied',
    },
    shortlistedAt: {
      type: Date,
    },
    shortlistedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    emailSentAt: {
      type: Date,
    },
    eligibilityStatus: {
      type: String,
      enum: ['Eligible', 'Not Eligible'],
      default: 'Eligible',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications for the same job by the same user
applicationSchema.index({ job: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
