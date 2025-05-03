const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true,
        maxlength: [500, 'Question cannot exceed 500 characters']
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
        trim: true,
        maxlength: [5000, 'Answer cannot exceed 5000 characters']
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

// Update the updatedAt field before saving
faqSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('FAQ', faqSchema);