const mongoose = require('mongoose');

const termsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true // Automaticall adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Terms', termsSchema);