const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  courseTitle: {
    type: String,
    required: true
  },
  tutorName: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  completionDate: {
    type: Date,
    required: true,
  },
  certificateNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  publicHash: {
    type: String,
    unique: true,
    sparse: true
  },
  imageUrl: {
    type: String
  },
  verificationId: {
    type: String,
    unique: true,
    required: true,
  },
  verificationHash: {
    type: String,
    required: true,
  },
  metadata: {
    courseName: String,
    studentName: String,
    completionDate: Date,
    grade: String,
  }
}, {
  timestamps: true
});

// Compound index for optimized queries
certificateSchema.index({ studentId: 1, courseId: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
