const mongoose = require('mongoose');

const LoginLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ipAddress: { type: String, required: true },
    device: { type: String },
    browser: { type: String },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['success', 'failure'], required: true },
});

module.exports = mongoose.model('LoginLog', LoginLogSchema);