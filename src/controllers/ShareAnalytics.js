const mongoose = require('mongoose');

const shareAnalyticsSchema = new mongoose.Schema({
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['linkedin', 'twitter', 'facebook', 'instagram', 'other']
  },
  sharedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for analytics queries
shareAnalyticsSchema.index({ certificateId: 1, platform: 1 });
shareAnalyticsSchema.index({ userId: 1 });

module.exports = mongoose.model('ShareAnalytics', shareAnalyticsSchema);

