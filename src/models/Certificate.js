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
  issueDate: {
    type: Date,
    default: Date.now
  },
  publicHash: {
    type: String,
    unique: true,
    sparse: true
  },
  imageUrl: {
    type: String
  },
  metadata: {
    type: Object
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
