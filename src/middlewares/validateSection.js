const { validationResult, body } = require('express-validator');

// Validation rules for creating/updating about sections
const validateSection = [
	body('sectionType')
		.notEmpty()
		.withMessage('Section type is required')
		.isIn(['about', 'vision', 'values', 'approach'])
		.withMessage('Invalid section type'),

	body('title')
		.notEmpty()
		.withMessage('Title is required')
		.isString()
		.withMessage('Title must be a string')
		.isLength({ min: 3, max: 100 })
		.withMessage('Title must be between 3 and 100 characters'),

	body('content')
		.notEmpty()
		.withMessage('Content is required')
		.isString()
		.withMessage('Content must be a string'),

	// Middleware to handle validation results
	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

module.exports = validateSection;
