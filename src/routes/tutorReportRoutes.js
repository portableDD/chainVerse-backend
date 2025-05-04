const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { getTutorCoursesReport, getCourseLeaderboard } = require('../controllers/tutorReportController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rate limiting: 100 requests per 15 minutes
const reportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many report requests, please try again after 15 minutes'
});

// Apply rate limiting to all report routes
router.use(reportLimiter);

// Tutor performance reports
router.get('/tutor/reports/courses', authMiddleware, roleMiddleware(['tutor']), getTutorCoursesReport);
router.get('/tutor/reports/courses/:id', authMiddleware, roleMiddleware(['tutor']), (req, res) => {
    // TODO: Implement single course report
    res.status(501).json({ message: 'Endpoint not implemented yet' });
});
router.get('/tutor/reports/leaderboard', authMiddleware, roleMiddleware(['tutor']), getCourseLeaderboard);
router.get('/tutor/reports/tutor-ranking', authMiddleware, roleMiddleware(['tutor']), getTutorRankings);


module.exports = router;
