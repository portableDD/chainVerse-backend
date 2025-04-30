// models/Career.js (Example with Sequelize or Mongoose)

const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  title: String,
  slug: String,
  description: String,
  image: String, // Optional
  requirements: [String],
  outcomes: [String],
}, { timestamps: true });

const Career = mongoose.model('Career', careerSchema);

module.exports = Career;
