const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReportAbuseSchema = new Schema({
    contentId: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: ['Discussion', 'Message', 'File', 'Post', 'Comment', 'Other'],
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['Pending', 'Resolved', 'Dismissed'],
        default: 'Pending'
    },
    adminNote: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ReportAbuse', ReportAbuseSchema);