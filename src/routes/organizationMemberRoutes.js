const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');
const organizationMemberController = require('../controllers/organizationMemberController');

// @route   POST /organization/member/add
// @desc    Add new organization member
// @access  Admin
router.post(
  '/member/add',
  [auth, adminMiddleware],
  organizationMemberController.addMember
);

// @route   GET /organization/members
// @desc    Get all organization members
// @access  Admin
router.get(
  '/members',
  [auth, adminMiddleware],
  organizationMemberController.getAllMembers
);

// @route   GET /organization/member/:id
// @desc    Get single member details
// @access  Admin
router.get(
  '/member/:id',
  [auth, adminMiddleware],
  organizationMemberController.getMemberById
);

// @route   PUT /organization/member/:id/update-role
// @desc    Update member role
// @access  Admin
router.put(
  '/member/:id/update-role',
  [auth, adminMiddleware],
  organizationMemberController.updateMemberRole
);

// @route   DELETE /organization/member/:id/remove
// @desc    Remove organization member
// @access  Admin
router.delete(
  '/member/:id/remove',
  [auth, adminMiddleware],
  organizationMemberController.removeMember
);

module.exports = router;