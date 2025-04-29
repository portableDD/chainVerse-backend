const express = require("express");
const tutorRoutes = require("./tutorRoutes");
const subscriptionPlanRoutes = require("./subscriptionPlanRoutes");
const organizationRoutes = require("./organization");
const certificateRoutes = require("./certificateRoutes");

const router = express.Router();

router.use("/", tutorRoutes);
router.use("/", subscriptionPlanRoutes);
router.use("/", organizationRoutes);
router.use("/certificates", certificateRoutes);

module.exports = router;
