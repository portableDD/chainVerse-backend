const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
	applyForFinancialAid,
	getMyApplications,
} = require('../controllers/financialAidController');
const auth = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting middleware - 5 applications per hour
const applicationRateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 5,
	message: 'Too many applications created. Please try again later.',
});

router.post(
	'/apply',
	auth,
	[
		body('courseId').notEmpty().withMessage('CourseId is required'),
		body('reason').notEmpty().withMessage('Reason is required'),
		body('incomeStatus').notEmpty().withMessage('Income status is required'),
	],
	applicationRateLimiter,
	applyForFinancialAid
);
router.get('/my-applications', auth, getMyApplications);

module.exports = router;
