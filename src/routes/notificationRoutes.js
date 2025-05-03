const express = require('express');
const { sendNotification } = require('../controllers/notificationController');
const auth = require('../middlewares/auth');
const adminAuthorization = require('../middlewares/adminAuthorization');

const router = express.Router();

// Route for sending notifications to students
router.post('/send', auth, adminAuthorization, sendNotification);

module.exports = router;