const express = require('express');
const certificateController = require('../controllers/certificateController');
const  auth  = require('../middlewares/auth');

const router = express.Router();

// Certificate routes
router.get('/:certificateId', auth.authenticate, certificateController.getCertificate);
router.get('/:certificateId/public-link', auth.authenticate, certificateController.generatePublicLink);
router.get('/:certificateId/share-metadata', auth.authenticate, certificateController.getShareMetadata);
router.post('/:certificateId/track-share', auth.authenticate, certificateController.trackShare);

// Public routes - no authentication required
router.get('/public/:publicHash', certificateController.getPublicCertificate);

module.exports = router;
