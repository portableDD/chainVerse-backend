const { body, validationResult } = require('express-validator');

// Middleware to handle validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const createTermsValidator = [
  body('title')
    .notEmpty().withMessage('T&C title is required')
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('content')
    .notEmpty().withMessage('T&C content is required')
    .isString().withMessage('Content must be a string')
    .trim(),

  handleValidation
];

const updateTermsValidator = [
  body('title')
    .optional({ checkFalsy: true })
    .isString().withMessage('Title must be a string')
    .trim()
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('content')
    .optional({ checkFalsy: true })
    .isString().withMessage('Content must be a string')
    .trim(),

  handleValidation
];

module.exports = [createTermsValidator, updateTermsValidator];