const crypto = require('crypto');

/**
 * Generate a unique public hash for certificate sharing
 * @param {string} certificateId - The certificate ID
 * @returns {string} - A unique hash
 */
exports.generatePublicHash = (certificateId) => {
  const timestamp = new Date().getTime();
  const randomSalt = crypto.randomBytes(8).toString('hex');
  const dataToHash = `${certificateId}${timestamp}${randomSalt}`;
  
  return crypto.createHash('sha256').update(dataToHash).digest('hex').substring(0, 16);
};
