const Certificate = require('../models/Certificate');
const ShareAnalytics = require('../models/ShareAnalytics');
const { generatePublicHash } = require('../utils/hashGenerator');
const { uploadToCloudStorage, getSignedUrl } = require('../utils/cloudStorage');
const { generateCertificateImage } = require('../utils/certificateGenerator');
const logger = require('../utils/logger');

/**
 * Generate a public link for a certificate
 * @route GET /certificates/:certificateId/public-link
 */
exports.generatePublicLink = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user.id; // Assuming user is authenticated and ID is available in req.user
    
    const certificate = await Certificate.findById(certificateId);
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    if (certificate.studentId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to certificate' });
    }
    
    if (!certificate.publicHash) {
      certificate.publicHash = generatePublicHash(certificate._id);
      await certificate.save();
    }
    
    const publicUrl = `${process.env.BASE_URL}/certificates/public/${certificate.publicHash}`;
    
    return res.status(200).json({
      publicUrl,
      metadata: {
        studentName: certificate.studentName,
        courseTitle: certificate.courseTitle,
        issueDate: certificate.issueDate,
        verificationHash: certificate.publicHash
      }
    });
  } catch (error) {
    logger.error(`Error generating public link: ${error.message}`);
    return res.status(500).json({ error: 'Failed to generate public link' });
  }
};

/**
 * Get certificate metadata for social sharing
 * @route GET /certificates/:certificateId/share-metadata
 */
exports.getShareMetadata = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user.id;
    
    const certificate = await Certificate.findById(certificateId);
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    if (certificate.studentId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to certificate' });
    }
    
    if (!certificate.publicHash) {
      certificate.publicHash = generatePublicHash(certificate._id);
      await certificate.save();
    }
    
    if (!certificate.imageUrl) {
      const certificateImage = await generateCertificateImage(certificate);
      const imageKey = `certificates/${certificate._id}/certificate.png`;
      const uploadResult = await uploadToCloudStorage(imageKey, certificateImage);
      
      certificate.imageUrl = uploadResult.url;
      await certificate.save();
    }
    
    const verificationLink = `${process.env.BASE_URL}/certificate/verify/${certificate.publicHash}`;
    
    const shareMessage = `Just completed the ${certificate.courseTitle} course on ChainVerse Academy!`;
    
    return res.status(200).json({
      courseTitle: certificate.courseTitle,
      studentName: certificate.studentName,
      certificateThumbnail: certificate.imageUrl,
      shareMessage,
      verificationLink
    });
  } catch (error) {
    logger.error(`Error getting share metadata: ${error.message}`);
    return res.status(500).json({ error: 'Failed to get share metadata' });
  }
};

/**
 * Track certificate sharing analytics
 * @route POST /certificates/:certificateId/track-share
 */
exports.trackShare = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const { platform } = req.body;
    const userId = req.user.id;
    
    if (!platform) {
      return res.status(400).json({ error: 'Platform is required' });
    }
    
    const certificate = await Certificate.findById(certificateId);
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    if (certificate.studentId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to certificate' });
    }
    
    const shareEvent = new ShareAnalytics({
      certificateId,
      userId,
      platform,
      sharedAt: new Date()
    });
    
    await shareEvent.save();
    
    return res.status(200).json({ message: 'Share event recorded successfully' });
  } catch (error) {
    logger.error(`Error tracking share: ${error.message}`);
    return res.status(500).json({ error: 'Failed to track share event' });
  }
};

/**
 * Get certificate by public hash (public endpoint)
 * @route GET /certificates/public/:publicHash
 */
exports.getPublicCertificate = async (req, res) => {
  try {
    const { publicHash } = req.params;
    
    const certificate = await Certificate.findOne({ publicHash });
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    return res.status(200).json({
      studentName: certificate.studentName,
      courseTitle: certificate.courseTitle,
      issueDate: certificate.issueDate,
      imageUrl: certificate.imageUrl,
      verificationHash: certificate.publicHash
    });
  } catch (error) {
    logger.error(`Error retrieving public certificate: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve certificate' });
  }
};

/**
 * Return an existing certificate with all details
 * Update to include the image URL for sharing
 * @route GET /certificates/:certificateId
 */
exports.getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user.id;
    
    // Find certificate
    const certificate = await Certificate.findById(certificateId);
    
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    
    if (certificate.studentId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Unauthorized access to certificate' });
    }
    
    if (!certificate.imageUrl) {
      const certificateImage = await generateCertificateImage(certificate);
      const imageKey = `certificates/${certificate._id}/certificate.png`;
      const uploadResult = await uploadToCloudStorage(imageKey, certificateImage);
      
      certificate.imageUrl = uploadResult.url;
      await certificate.save();
    }
    
    return res.status(200).json(certificate);
  } catch (error) {
    logger.error(`Error retrieving certificate: ${error.message}`);
    return res.status(500).json({ error: 'Failed to retrieve certificate' });
  }
};

