const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  studentProgress: {
    type: Map,
    of: Number,
    default: {}
  },
  completionDates: {
    type: Map,
    of: Date,
    default: {}
  },
  quizResults: {
    type: Map,
    of: Map,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', CourseSchema);