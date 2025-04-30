const express = require("express");
const tutorRoutes = require("./tutorRoutes");
const subscriptionPlanRoutes = require("./subscriptionPlanRoutes");
const organizationRoutes = require("./organization");
const reportAbuseRoutes = require("./reportAbuseRoute");

const router = express.Router();

router.use("/", tutorRoutes);
router.use("/", subscriptionPlanRoutes);
router.use("/", organizationRoutes);
router.use("/reports/abuse", reportAbuseRoutes);

module.exports = router;
