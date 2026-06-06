const mongoose = require('mongoose');

const atsScanSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Not required, because scans from the landing page are anonymous
    },
    filename: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
    },
    missingKeywords: [String],
    recommendations: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AtsScan', atsScanSchema);
