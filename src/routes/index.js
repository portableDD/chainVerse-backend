const express = require("express");
const tutorRoutes = require("./tutorRoutes");
const subscriptionPlanRoutes = require("./subscriptionPlanRoutes");

const router = express.Router();

router.use("/", tutorRoutes);
router.use("/", subscriptionPlanRoutes);

module.exports = router;
