const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");
const subscriptionPlanController = require("../controllers/subscriptionPlanController");

// @route   POST /admin/subscription/plans
router.post(
  "/plans",
  [auth, adminMiddleware],
  subscriptionPlanController.createSubscriptionPlan
);

// @route   GET /admin/subscription/plans
router.get(
  "/plans",
  [auth, adminMiddleware],
  subscriptionPlanController.getAllSubscriptionPlans
);

// @route   GET /admin/subscription/plans/:id
router.get(
  "/plans/:id",
  [auth, adminMiddleware],
  subscriptionPlanController.getSubscriptionPlanById
);

// @route   PUT /admin/subscription/plans/:id
router.put(
  "/plans/:id",
  [auth, adminMiddleware],
  subscriptionPlanController.updateSubscriptionPlan
);

// @route   DELETE /admin/subscription/plans/:id
router.delete(
  "/plans/:id",
  [auth, adminMiddleware],
  subscriptionPlanController.deleteSubscriptionPlan
);

module.exports = router;
