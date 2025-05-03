const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
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
  courseName: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  shared: {
    type: Boolean,
    default: false
  },
  url: {
    type: String
  }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
