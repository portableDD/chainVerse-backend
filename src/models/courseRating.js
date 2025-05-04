const mongoose = require('mongoose');

const CourseRatingSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true
  },
  suggestions: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Ensure each student can rate a course only once
CourseRatingSchema.index({ courseId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('CourseRating', CourseRatingSchema);