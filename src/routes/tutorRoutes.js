const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const tutorAuth = require('../middlewares/tutorAuth');
const tutorValidator = require('../validators/tutorValidator');
const rateLimit = require('express-rate-limit');

// Rate limiting for tutor applications
const applyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 applications per hour
  message: 'Too many applications from this IP, please try again after an hour'
});

// Rate limiting for authentication endpoints to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many authentication attempts, please try again after 15 minutes'
});

// Tutor application routes
router.post('/tutor/apply', applyLimiter, tutorController.submitTutorApplication);
router.get('/admin/tutor-applications', tutorAuth.verifyToken, tutorAuth.adminRoleCheck, tutorController.getAllTutors);
router.get('/admin/tutor-applications/:id', tutorAuth.verifyToken, tutorAuth.adminRoleCheck, tutorController.getTutorById);
router.put('/admin/tutor-applications/:id/decision', tutorAuth.verifyToken, tutorAuth.adminRoleCheck, tutorController.approveRejectApplication);

// Tutor authentication routes
router.post('/tutor/create', 
  tutorValidator.validateTutorSignup, 
  tutorValidator.validateResults, 
  tutorController.createTutor
);

router.post('/tutor/verify-email', 
  tutorValidator.validateEmailVerification, 
  tutorValidator.validateResults, 
  tutorController.verifyEmail
);

router.post('/tutor/login', 
  authLimiter,
  tutorValidator.validateTutorLogin, 
  tutorValidator.validateResults, 
  tutorController.login
);

router.post('/tutor/forget/password', 
  authLimiter,
  tutorValidator.validateForgetPassword, 
  tutorValidator.validateResults, 
  tutorController.forgotPassword
);

router.post('/tutor/reset/password', 
  authLimiter,
  tutorValidator.validateResetPassword, 
  tutorValidator.validateResults, 
  tutorController.resetPassword
);

router.post('/tutor/refresh-token', tutorController.refreshToken);

// Protected tutor routes
router.get('/tutor/profile', tutorAuth.verifyToken, tutorAuth.tutorRoleCheck, tutorController.getProfile);
router.put('/tutor/profile', 
  tutorAuth.verifyToken, 
  tutorAuth.tutorRoleCheck,
  tutorValidator.validateProfileUpdate, 
  tutorValidator.validateResults, 
  tutorController.updateProfile
);

router.get('/tutor/courses/reports', tutorAuth.verifyToken, tutorAuth.tutorRoleCheck, tutorController.getCourseReports);
router.get('/tutor/courses/:courseId/reports', tutorAuth.verifyToken, tutorAuth.tutorRoleCheck, tutorController.getSpecificCourseReport);
router.get('/tutor/leaderboard', tutorAuth.verifyToken, tutorAuth.tutorRoleCheck, tutorController.getLeaderboard);

module.exports = router;
