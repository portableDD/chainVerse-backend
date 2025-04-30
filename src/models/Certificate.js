const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
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
  completionDate: {
    type: Date,
    required: true
  },
  tutorName: {
    type: String,
    required: true
  },
  certificateUrl: {
    type: String,
    required: true
  },
  verificationId: {
    type: String,
    unique: true,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);
