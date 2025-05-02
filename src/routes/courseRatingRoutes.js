const express = require('express');
const router = express.Router();
const courseRatingController = require('../controllers/courseRatingController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting to prevent spam or abuse
const ratingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // limit each IP to 5 rating submissions/updates per hour
  message: 'Too many rating submissions from this IP, please try again after an hour'
});

/**
 * @route   POST /courses/:id/rate
 * @desc    Submit a rating and optional feedback for a course
 * @access  Private (Students only)
 */
router.post(
  '/:id/rate',
  authMiddleware,
  roleMiddleware('student'),
  ratingLimiter,
  courseRatingController.submitRating
);

/**
 * @route   GET /courses/:id/ratings
 * @desc    Retrieve all ratings and feedback for a course
 * @access  Private
 */
router.get(
  '/:id/ratings',
  authMiddleware,
  courseRatingController.getCourseRatings
);

/**
 * @route   GET /courses/:id/my-rating
 * @desc    Retrieve the authenticated student's rating for a course
 * @access  Private (Students only)
 */
router.get(
  '/:id/my-rating',
  authMiddleware,
  roleMiddleware('student'),
  courseRatingController.getMyRating
);

/**
 * @route   PUT /courses/:id/rate
 * @desc    Update an existing rating and feedback for a course
 * @access  Private (Students only)
 */
router.put(
  '/:id/rate',
  authMiddleware,
  roleMiddleware('student'),
  ratingLimiter,
  courseRatingController.updateRating
);

/**
 * @route   DELETE /courses/:id/rate
 * @desc    Delete a student's rating and feedback
 * @access  Private (Students only)
 */
router.delete(
  '/:id/rate',
  authMiddleware,
  roleMiddleware('student'),
  courseRatingController.deleteRating
);

module.exports = router;