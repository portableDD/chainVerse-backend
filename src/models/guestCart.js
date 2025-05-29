const mongoose = require('mongoose');

const GuestCartSchema = new mongoose.Schema({
  cartKey: {
    type: String,
    required: true,
    unique: true
  },
  items: [
    {
      _id: false, // Disable auto-generated _id for items
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Automatically delete after 7 days
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GuestCart', GuestCartSchema);
