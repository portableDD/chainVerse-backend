const express = require('express');
const router = express.Router();
const platformInfoController = require('../controllers/platformInfoController');

// @route   GET /platform-info
// @desc    Get all platform information
// @access  Public
router.get('/', platformInfoController.getAllPlatformInfo);

// @route   GET /platform-info/:id
// @desc    Get platform information by ID
// @access  Public
router.get('/:id', platformInfoController.getPlatformInfoById);

module.exports = router;