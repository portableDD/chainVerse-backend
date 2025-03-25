const mongoose = require("mongoose");

const TutorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  languageSpoken: {
    type: String,
    required: true,
  },
  primaryExpertise: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true
  },
  currentRole: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  linkedinProfile: {
    type: String
  },
  githubProfile: {
    type: String
  },
  portfolioWebsite: {
    type: String
  },
  proposedCourseTitle: {
    type: String,
    required: true
  },
  courseDescription: {
    type: String,
    required: true,
    maxlength: [2000, 'Course description cannot be more than 2000 characters']
  },
  courseLevel: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  estimatedDuration: {
    type: String,
    required: [true, 'Estimated duration is required']
  },
  courseOutline: {
    type: [String],
    required: true
  },
  courseUniqueness: {
    type: String,
    required: true,
    maxlength: [1000, 'Course uniqueness cannot be more than 1000 characters']
  },
  sampleLessonMedia: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminComment: {
    type: String
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Tutor", TutorSchema);
