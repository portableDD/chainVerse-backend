const { body } = require('express-validator');

exports.createFAQValidator = [
    body('question')
        .notEmpty().withMessage('Question is required')
        .isString().withMessage('Question must be a string')
        .trim()
        .isLength({ max: 500 }).withMessage('Question cannot exceed 500 characters'),

    body('answer')
        .notEmpty().withMessage('Answer is required')
        .isString().withMessage('Answer must be a string')
        .trim()
        .isLength({ max: 5000 }).withMessage('Answer cannot exceed 5000 characters')
];

exports.updateFAQValidator = [
    body('question')
        .optional()
        .isString().withMessage('Question must be a string')
        .trim()
        .isLength({ max: 500 }).withMessage('Question cannot exceed 500 characters'),

    body('answer')
        .optional()
        .isString().withMessage('Answer must be a string')
        .trim()
        .isLength({ max: 5000 }).withMessage('Answer cannot exceed 5000 characters')
];