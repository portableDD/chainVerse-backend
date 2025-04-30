const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const adminAuthorization = require('../middlewares/adminAuthorization');

// import controllers
const { createTerms, getAllTerms, getTermsById, updateTerm, deleteTerm } = require('../controllers/termsController');

// public routes
router.get('/settings/terms', getAllTerms);
router.get('/settings/terms/:id', getTermsById);

// Admin only routes
router.post('/settings/terms', [auth, adminAuthorization], createTerms);
router.patch('/settings/terms/:id', [auth, adminAuthorization], updateTerm);
router.delete('/settings/terms/:id', [auth, adminAuthorization], deleteTerm);

module.exports = router;