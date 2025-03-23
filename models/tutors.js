const mongoose = require("mongoose");

const TutorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  bio: String,
  rating: Number,
  numberOfCourses: Number,
  numberOfStudents: Number,
  primaryExpertise: String,
  email: String,
  phoneNumber: String,
  linkedinProfile: String,
  githubProfile: String,
  portfolioWebsite: String,
  courses: [
    {
      courseId: String,
      title: String,
      description: String,
    },
  ],
});

module.exports = mongoose.model("Tutor", TutorSchema);
