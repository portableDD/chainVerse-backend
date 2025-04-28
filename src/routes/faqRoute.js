const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const faqValidator = require('../validators/faqValidator');
const { authMiddleware } = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Public routes
router.get('/', faqController.getAllFAQs);
router.get('/:id', faqController.getFAQById);

// Admin protected routes
router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    faqValidator.createFAQValidator,
    faqController.createFAQ
);

router.patch(
    '/:id',
    authMiddleware,
    adminMiddleware,
    faqValidator.updateFAQValidator,
    faqController.updateFAQ
);

router.delete(
    '/:id',
    authMiddleware,
    adminMiddleware,
    faqController.deleteFAQ
);

module.exports = router;