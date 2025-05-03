const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {Object} user - User object containing _id and role
 * @returns {String} JWT token
 */
exports.generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};