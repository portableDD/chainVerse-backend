const express = require("express");
const router = express.Router();
const { getTutorReport, getAllTutorsSummary } = require("../controllers/reportController");
const { isAdminOrManager } = require("../middleware/authMiddleware");

// /reports/tutor/:tutorId
router.get("/tutor/:tutorId", isAdminOrManager, getTutorReport);

// /reports/tutors
router.get("/tutors", isAdminOrManager, getAllTutorsSummary);

module.exports = router;
