const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const logger = require('./logger');

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET;

/**
 * Upload a file to cloud storage
 * @param {string} key - The file key/path
 * @param {Buffer} data - The file data
 * @returns {Promise<Object>} - Upload result with URL
 */
exports.uploadToCloudStorage = async (key, data) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
      ContentType: 'image/png',
      ACL: 'public-read' // Make it publicly accessible
    };
    
    const uploadResult = await s3.upload(params).promise();
    
    return {
      url: uploadResult.Location,
      key: uploadResult.Key
    };
  } catch (error) {
    logger.error(`Error uploading to cloud storage: ${error.message}`);
    throw error;
  }
};

/**
 * Get a signed URL for the file
 * @param {string} key - The file key/path
 * @param {number} expirySeconds - URL expiry in seconds
 * @returns {Promise<string>} - Signed URL
 */
exports.getSignedUrl = async (key, expirySeconds = 3600) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Expires: expirySeconds
    };
    
    return s3.getSignedUrlPromise('getObject', params);
  } catch (error) {
    logger.error(`Error generating signed URL: ${error.message}`);
    throw error;
  }
};
