const Joi = require('joi');

/**
 * Validation schema for course ratings
 * Validates rating, feedback, and suggestions fields
 */
const ratingSchema = Joi.object({
  rating: Joi.number()
    .required()
    .min(1)
    .max(5)
    .messages({
      'number.base': 'Rating must be a number',
      'number.empty': 'Rating is required',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot be more than 5',
      'any.required': 'Rating is required'
    }),
  
  feedback: Joi.string()
    .trim()
    .allow('')
    .max(1000)
    .messages({
      'string.base': 'Feedback must be a string',
      'string.max': 'Feedback cannot exceed 1000 characters'
    }),
  
  suggestions: Joi.string()
    .trim()
    .allow('')
    .max(1000)
    .messages({
      'string.base': 'Suggestions must be a string',
      'string.max': 'Suggestions cannot exceed 1000 characters'
    })
});

module.exports = {
  ratingSchema
};