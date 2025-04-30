const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController'); 
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const { completeCourse, getCertificate } = require('../controllers/certificateController');
const { mintNft } = require('../controllers/nftController');

// Route to create a course
console.log('courseController:', courseController);
router.post('/courses', authMiddleware, courseController.createCourse);
router.post('/:id/complete', authMiddleware, roleMiddleware('student'), completeCourse);
router.get('/:id/certificate', authMiddleware, roleMiddleware('student'), getCertificate);
router.post('/:id/mint-nft', authMiddleware, roleMiddleware('student'), mintNft);

module.exports = router;
