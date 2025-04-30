const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
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
  metadata: {
    courseName: String,
    studentName: String,
    completionDate: Date,
    grade: String,
  },
  verificationHash: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

// Compound index for quick lookups
certificateSchema.index({ studentId: 1, courseId: 1 });

module.exports = mongoose.model("Certificate", certificateSchema);