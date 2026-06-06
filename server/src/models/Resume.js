const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    template: {
      type: String,
      default: 'classic',
    },
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      linkedin: String,
    },
    summary: {
      type: String,
    },
    skills: [String],
    education: [
      {
        school: String,
        degree: String,
        year: String,
      },
    ],
    experience: [
      {
        company: String,
        position: String,
        duration: String,
        description: String,
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        link: String,
      },
    ],
    atsScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model('Resume', resumeSchema);
