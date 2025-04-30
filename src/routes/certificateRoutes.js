const express = require('express');
const certificateController = require('../controllers/certificateController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Certificate routes
router.get('/:certificateId', authenticate, certificateController.getCertificate);
router.get('/:certificateId/public-link', authenticate, certificateController.generatePublicLink);
router.get('/:certificateId/share-metadata', authenticate, certificateController.getShareMetadata);
router.post('/:certificateId/track-share', authenticate, certificateController.trackShare);

// Public routes - no authentication required
router.get('/public/:publicHash', certificateController.getPublicCertificate);

module.exports = router;
