const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/auth");
const {
  getCourseReport,
  getAllCourseReports,
} = require("../controllers/courseReportController");

// Apply authentication middleware to all routes
router.use(authenticate);

// Get report for a single course
router.get("/course/:courseId", getCourseReport);

// Get reports for all courses
router.get("/courses", getAllCourseReports);

module.exports = router;
