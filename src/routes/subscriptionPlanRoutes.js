const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");
const subscriptionPlanController = require("../controllers/subscriptionPlanController");
const isAdmin = require("../middlewares/admin");

// @route   POST /admin/subscription/plans
router.post(
  "/plans",
  [auth.authenticate, isAdmin.ensureAdmin],
  subscriptionPlanController.createSubscriptionPlan
);

// @route   GET /admin/subscription/plans
router.get(
  "/plans",
  [auth.authenticate, isAdmin.ensureAdmin],
  subscriptionPlanController.getAllSubscriptionPlans
);

// @route   GET /admin/subscription/plans/:id
router.get(
  "/plans/:id",
  [auth.authenticate, isAdmin.ensureAdmin],
  subscriptionPlanController.getSubscriptionPlanById
);

// @route   PUT /admin/subscription/plans/:id
router.put(
  "/plans/:id",
  [auth.authenticate, isAdmin.ensureAdmin],
  subscriptionPlanController.updateSubscriptionPlan
);

// @route   DELETE /admin/subscription/plans/:id
router.delete(
  "/plans/:id",
  [auth.authenticate, isAdmin.ensureAdmin],
  subscriptionPlanController.deleteSubscriptionPlan
);

module.exports = router;
