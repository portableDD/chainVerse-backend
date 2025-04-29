const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController'); // adjust path if needed
const auth = require('../middlewares/auth');

// Route to create a course
router.post('/courses', auth, courseController.createCourse);

module.exports = router;
