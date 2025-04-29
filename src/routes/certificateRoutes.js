const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const auth = require('../middlewares/auth');

// Protect all routes
router.use(auth);

// Get all certificates for the authenticated student
router.get('/my-certificates', certificateController.getMyCertificates);

// Get a single certificate
router.get('/:certificateId', certificateController.getCertificate);

// Download all certificates as ZIP
router.get('/my-certificates/download-all', certificateController.downloadAllCertificates);

module.exports = router;