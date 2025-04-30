const mongoose = require('mongoose');

const nftAchievementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  tokenId: {
    type: String,
    required: true
  },
  metadataUrl: {
    type: String,
    required: true
  },
  mintedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('NftAchievement', nftAchievementSchema);
