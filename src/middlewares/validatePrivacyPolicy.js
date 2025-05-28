const { body, validationResult } = require('express-validator');
const { sanitizeHtmlContent } = require('../utils/sanitizeHtmlContent');

/**
 * Returns an array of middleware functions to validate privacy policy data.
 */
function validatePrivacyPolicy() {
  return [
    // Validate title
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isString()
      .withMessage('Title must be a string')
      .isLength({ min: 3, max: 100 })
      .withMessage('Title must be between 3 and 100 characters'),

    // Validate content
    body('content')
      .notEmpty()
      .withMessage('Content is required')
      .isString()
      .withMessage('Content must be a string')
      .customSanitizer((value) => sanitizeHtmlContent(value) || value) // Fallback to original content
      .isLength({ min: 10 })
      .withMessage('Content must be at least 10 characters long'),

    // Middleware to handle validation results
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];
}

module.exports = validatePrivacyPolicy;
