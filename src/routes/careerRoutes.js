// routes/careerRoutes.js
const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const careerController = require('../controllers/careerController');

const router = express.Router();

// Admin routes with role-based authorization
router.post('/careers', authMiddleware, roleMiddleware('admin'), careerController.createCareer);
router.patch('/careers/:id', authMiddleware, roleMiddleware('admin'), careerController.updateCareer);
router.delete('/careers/:id', authMiddleware, roleMiddleware('admin'), careerController.deleteCareer);

// Public routes
router.get('/careers', careerController.getAllCareers);
router.get('/careers/:id', careerController.getCareerById);

module.exports = router;
