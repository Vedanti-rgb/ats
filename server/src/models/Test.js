const mongoose = require('mongoose');

const testSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Resume',
    },
    // The specific questions generated for this test by the AI
    questions: [
      {
        id: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          default: 'Technical',
        },
      },
    ],
    // The user's answers mapped to question ids
    answers: [
      {
        questionId: String,
        answerText: String,
      },
    ],
    // AI graded score from 0-100 (overall)
    score: {
      type: Number,
      default: 0,
    },
    // Overall feedback from AI on answers
    feedback: {
      type: String,
      default: '',
    },
    tabSwitchesCount: {
      type: Number,
      default: 0,
    },
    fullscreenExitsCount: {
      type: Number,
      default: 0,
    },
    proctoringLogs: [
      {
        type: String,
      },
    ],
    cheatingDetected: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Test', testSchema);
