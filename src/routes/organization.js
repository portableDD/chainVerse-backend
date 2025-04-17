const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const organizationController = require('../controllers/organizationController');

const { uploadProfileImage } = require('../config/multerConfig');
const userOrganizationController = require('../controllers/userOrganizationController');

// @route POST /organization/subscribe
// @desc Allows an organization to purchase a subscription based on available plans.
router.post('/subscribe', auth, organizationController.subscribeToPlan);

// @route GET /organization/{organizationId}/subscription
// @desc Fetches details about the organization's current subscription
router.get(
	'/:id/subscription',
	auth,
	organizationController.getSubscriptionPlan
);

// @route PUT /organization/{organizationId}/subscription/{newSubscriptionPlanId}/update
// @desc Allows organizations to switch to a different plan, adjusting their member limit accordingly.
router.put(
	'/:id/subscription/:planId/update',
	auth,
	organizationController.updateSubscriptionPlan
);

// @route DELETE /organization/{organizationId}/subscription/cancel
// @desc Organizations can cancel their subscription, which will restrict further member additions.
router.delete(
	'/:id/subscription/cancel',
	auth,
	organizationController.cancelSubscriptionPlan
);

// @route GET /organization/{organizationId}/subscription/invoice
// @desc Generates an invoice/receipt for past payments.
router.get(
	'/:id/subscription/invoice',
	auth,
	organizationController.getSubscriptionPlanInvoice
);

// Profile management routes

// @route GET /organization/profile
// @desc Fetches the logged-in user's profile details
// @route POST /organization/profile
// @desc Register a new user with email and password, returns JWT token upon successful registration
router
	.route('/profile')
	.get(auth, userOrganizationController.getProfile)
	.post(userOrganizationController.registerUser);

// @route PUT /organization/profile/update
// @desc Updates user profile information including fullName, email, phoneNumber, and position
router.put('/profile/update', auth, userOrganizationController.updateProfile);

// @route GET /organization/verify-email
// @desc Verifies user's email address by validating the verification token and sets isEmailVerified to true
router.get(
	'/profile/verify-email',
	auth,
	userOrganizationController.verifyEmail
);

// @route PUT /organization/profile/change-password
// @desc Allows users to change their password after verifying current password
router.put(
	'/profile/change-password',
	auth,
	userOrganizationController.changePassword
);

// @route POST /organization/profile/upload-image
// @desc Handles profile image upload, validates file type/size, and updates user profile
router.post(
	'/profile/upload-image',
	auth,
	uploadProfileImage.single('profileImage'),
	userOrganizationController.uploadProfileImage
);

module.exports = router;

module.exports = router;
