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
router
	.route('/profile')
	.get(auth, userOrganizationController.getProfile)
	.post(userOrganizationController.registerUser);

router.put('/profile/update', auth, userOrganizationController.updateProfile);

router.get(
	'/profile/verify-email',
	auth,
	userOrganizationController.verifyEmail
);

router.put(
	'/profile/change-password',
	auth,
	userOrganizationController.changePassword
);
router.post(
	'/profile/upload-image',
	auth,
	uploadProfileImage.single('profileImage'),
	userOrganizationController.uploadProfileImage
);

module.exports = router;

module.exports = router;
