const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  enrollments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        required: true,
      },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Course", courseSchema);