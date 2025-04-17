const validator = require('validator');

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validates phone number
 * @param {string} phoneNumber - The phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidPhoneNumber = (phoneNumber) => {
  // This is a basic validation, adjust according to your requirements
  return validator.isMobilePhone(phoneNumber, 'any', { strictMode: false });
};

/**
 * Validates password complexity
 * @param {string} password - The password to validate
 * @returns {object} - Object with isValid flag and message
 */
const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  // At least one uppercase, one lowercase, one number
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUppercase || !hasLowercase || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Mock function to trigger email verification
 * @param {string} userId - User ID
 * @param {string} email - User email
 */
const triggerEmailVerification = async (userId, email) => {
  // This is a placeholder - implement actual email sending logic later
  console.log(`Email verification triggered for user ${userId} with email ${email}`);
  // In a real implementation, this would generate a verification token and send an email
};

module.exports = {
  isValidEmail,
  isValidPhoneNumber,
  validatePassword,
  triggerEmailVerification
};