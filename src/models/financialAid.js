const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FinancialAidSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	courseId: {
		type: Schema.Types.ObjectId,
		ref: 'Course',
		required: [true, 'Course ID is required'],
	},
	reason: {
		type: String,
		required: [true, 'Reason must be between 50 and 1000 characters'],
		minlength: 50,
		maxlength: 1000,
	},
	incomeStatus: {
		type: String,
		enum: ['Low', 'Medium', 'High'],
		required: [true, 'An application must have a status'],
	},
	status: {
		type: String,
		enum: {
			values: ['Pending', 'Approved', 'Denied'],
			message: 'Income status must be Low, Medium, or High',
		},
		default: 'Pending',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Compound index to ensure one active application per course per user
FinancialAidSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('FinancialAid', FinancialAidSchema);
