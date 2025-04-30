const mongoose = require('mongoose');

const courseReportSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    unique: true
  },
  totalEnrollments: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  dropOffRate: {
    type: Number,
    default: 0
  },
  averageCompletionTime: {
    type: Number, // in minutes
    default: 0
  },
  activeLearners: {
    type: Number,
    default: 0
  },
  engagementMetrics: {
    discussions: {
      totalPosts: { type: Number, default: 0 },
      totalComments: { type: Number, default: 0 }
    },
    quizzes: {
      totalAttempts: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 }
    },
    downloads: {
      totalDownloads: { type: Number, default: 0 }
    }
  },
  certificatesGenerated: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
courseReportSchema.index({ courseId: 1 });
courseReportSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('CourseReport', courseReportSchema); 