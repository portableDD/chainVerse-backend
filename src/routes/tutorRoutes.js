const express = require("express");
const router = express.Router();
const {
  getAllTutors,
  getTutorById,
  submitTutorApplication,
  approveRejectApplication
} = require("../controllers/tutorController");
const rateLimit = require("express-rate-limit");
const { authMiddleware, roleMiddleware } = require("../middlewares/authMiddleware");

// Rate limiting for tutor applications
const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 applications per hour
  message: 'Too many applications from this IP, please try again after an hour'
});

router.post("/tutor/apply", applyLimiter, submitTutorApplication);
router.get("/admin/tutor-applications", authMiddleware, roleMiddleware(["admin"]), getAllTutors);
router.get("/admin/tutor-applications/:id", authMiddleware, getTutorById);
router.put("/admin/tutor-applications/:id/decision", authMiddleware, roleMiddleware(["admin"]), approveRejectApplication);


module.exports = router;
