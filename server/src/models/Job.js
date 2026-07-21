const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
    },
    company: {
      type: String,
      required: [true, 'Please add a company name'],
    },
    location: {
      type: String,
      required: [true, 'Please add a job location'],
    },
    salary: {
      type: String,
      default: 'Competitive',
    },
    description: {
      type: String,
      required: [true, 'Please add a job description'],
    },
    requirements: [
      {
        type: String,
      },
    ],
    employmentType: {
      type: String,
      default: 'Full-time',
    },
    experienceRequired: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
    },
    vacancies: {
      type: Number,
      default: 1,
    },
    // Eligibility criteria
    min10thPercentage: {
      type: Number,
      default: 0,
    },
    min12thPercentage: {
      type: Number,
      default: 0,
    },
    minGraduationPercentage: {
      type: Number,
      default: 0,
    },
    minCGPA: {
      type: Number,
      default: 0,
    },
    backlogsAllowed: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'Yes',
    },
    maxBacklogs: {
      type: Number,
      default: 0,
    },
    eligibleBranches: [
      {
        type: String,
      },
    ],
    passingYear: {
      type: Number,
      default: null,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
