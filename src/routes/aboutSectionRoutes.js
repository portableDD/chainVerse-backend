const express = require('express');
const router = express.Router();
const aboutSectionController = require('../controllers/aboutSectionController');
const validateSection = require('../middlewares/validateSection');
const isAuthenticated = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');

// Public endpoint for retrieving all sections
router.get('/', aboutSectionController.getAllSections);

// Public endpoint for retrieving a specific section
router.get('/:id', aboutSectionController.getSectionById);

// Admin-only endpoints for CRUD operations
router.post(
	'/',
	isAuthenticated.authenticate,
	isAdmin.ensureAdmin,
	validateSection,
	aboutSectionController.createSection
);
router
	.route('/:id')
	.patch(
		isAuthenticated.authenticate,
		isAdmin.ensureAdmin,
		validateSection,
		aboutSectionController.updateSection
	)
	.delete(isAuthenticated.authenticate, isAdmin.ensureAdmin, aboutSectionController.deleteSection);

module.exports = router;
