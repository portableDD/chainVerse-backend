const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const organizationController = require("../controllers/organizationController");

// @route POST /organization/subscribe
// @desc Allows an organization to purchase a subscription based on available plans.
router.post(
  "/organization/subscribe",
  auth,
  organizationController.subscribeToPlan
);

// @route GET /organization/{organizationId}/subscription
// @desc Fetches details about the organization's current subscription
router.get(
  "/organization/:id/subscription",
  auth,
  organizationController.getSubscriptionPlan
);

// @route PUT /organization/{organizationId}/subscription/{newSubscriptionPlanId}/update
// @desc Allows organizations to switch to a different plan, adjusting their member limit accordingly.
router.put(
  "/organization/:id/subscription/:planId/update",
  auth,
  organizationController.updateSubscriptionPlan
);

// @route DELETE /organization/{organizationId}/subscription/cancel
// @desc Organizations can cancel their subscription, which will restrict further member additions.
router.delete(
  "/organization/:id/subscription/cancel",
  auth,
  organizationController.cancelSubscriptionPlan
);

// @route GET /organization/{organizationId}/subscription/invoice
// @desc Generates an invoice/receipt for past payments.
router.get(
  "/organization/:id/subscription/invoice",
  auth,
  organizationController.getSubscriptionPlanInvoice
);

module.exports = router;
