const express = require("express");
const { submitReport, getReports, updateReportStatus } = require("../controllers/reportAbuseController");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 applications per hour
  message: 'Too many applications from this IP, please try again after an hour'
});

router.use(authMiddleware);

router.post("/", applyLimiter, submitReport);
router.get("/", roleMiddleware(["admin"]), getReports);
router.put("/:reportId", roleMiddleware(["admin"]), updateReportStatus);

module.exports = router;