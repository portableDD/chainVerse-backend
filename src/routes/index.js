const express = require("express");
const tutorRoutes = require("./tutorRoutes");
const subscriptionPlanRoutes = require("./subscriptionPlanRoutes");
const organizationRoutes = require("./organization");
const certificateRoutes = require("./certificateRoutes");
const reportAbuseRoutes = require("./reportAbuseRoute");

const router = express.Router();

router.use("/", tutorRoutes);
router.use("/", subscriptionPlanRoutes);
router.use("/", organizationRoutes);
router.use("/certificates", certificateRoutes);
router.use("/reports/abuse", reportAbuseRoutes);

module.exports = router;
