const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const { validatePlatformInfo } = require('../validators/platformInfoValidator');
const platformInfoController = require('../controllers/platformInfoController');
const isAdmin = require('../middlewares/admin');
// @route   POST /admin/platform-info
// @desc    Create platform information
// @access  Admin
router.post(
  '/platform-info',
  [auth.authenticate, isAdmin.ensureAdmin, validatePlatformInfo],
  platformInfoController.createPlatformInfo
);

// @route   PUT /admin/platform-info/:id
// @desc    Update platform information
// @access  Admin
router.put(
  '/platform-info/:id',
  [auth.authenticate, isAdmin.ensureAdmin, validatePlatformInfo],
  platformInfoController.updatePlatformInfo
);

// @route   DELETE /admin/platform-info/:id
// @desc    Delete platform information
// @access  Admin
router.delete(
  '/platform-info/:id',
  [auth.authenticate, isAdmin.ensureAdmin],
  platformInfoController.deletePlatformInfo
);

module.exports = router;