const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const adminAuthorization = require('../middlewares/adminAuthorization');
const { createTermsValidator, updateTermsValidator } = require('../validators/termsValidator');

// import controllers
const { createTerms, getAllTerms, getTermsById, updateTerm, deleteTerm } = require('../controllers/termsController');

// public routes
router.get('/', getAllTerms);
router.get('/:id', getTermsById);

// Admin only routes
router.post('/', [auth, adminAuthorization, createTermsValidator], createTerms);
router.patch('/:id', [auth, adminAuthorization, updateTermsValidator], updateTerm);
router.delete('/:id', [auth, adminAuthorization], deleteTerm);

module.exports = router;