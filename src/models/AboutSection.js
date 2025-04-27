const mongoose = require('mongoose');

const aboutSectionSchema = new mongoose.Schema({
  sectionType: {
    type: String,
    enum: ['about', 'vision', 'values', 'approach'],
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
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

// Pre-save middleware to update the updatedAt field
aboutSectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AboutSection', aboutSectionSchema);
