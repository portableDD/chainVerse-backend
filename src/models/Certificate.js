const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming unified user model
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  tutorName: {
    type: String,
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  completionDate: {
    type: Date,
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "REVOKED"],
    default: "ACTIVE",
  },
  pdfUrl: {
    type: String,
    required: true,
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

// Compound index for performance
certificateSchema.index({ studentId: 1, courseId: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);
