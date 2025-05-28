const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const faqValidator = require('../validators/faqValidator');
const { authMiddleware } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/admin');
const isAdmin = require('../middlewares/admin');

// Public routes
router.get('/', faqController.getAllFAQs);
router.get('/:id', faqController.getFAQById);

// Admin protected routes
router.post(
    '/',
    authMiddleware,
    isAdmin.ensureAdmin, // Ensure only admin can create FAQs
    faqValidator.createFAQValidator,
    faqController.createFAQ
);

router.patch(
    '/:id',
    authMiddleware,
    isAdmin.ensureAdmin, // Ensure only admin can update FAQs
    faqValidator.updateFAQValidator,
    faqController.updateFAQ
);

router.delete(
    '/:id',
    authMiddleware,
    isAdmin.ensureAdmin, // Ensure only admin can delete FAQs
    faqController.deleteFAQ
);

module.exports = router;