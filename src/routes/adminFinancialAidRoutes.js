const express = require('express');
const { 
    getAllApplications, 
    getApplicationById, 
    reviewApplication, 
    deleteApplication 
} = require('../controllers/adminFinancialAidController');
const auth = require('../middlewares/auth');
const adminAuthorization = require('../middlewares/adminAuthorization');

const router = express.Router();

// Route to get all financial aid applications
router.get('/applications', auth, adminAuthorization, getAllApplications);

// Route to get a single financial aid application by ID
router.get('/applications/:id', auth, adminAuthorization, getApplicationById);

// Route to make a decision (approve/deny) on a financial aid application
router.post('/applications/:id/decision', auth, adminAuthorization, reviewApplication);

// Route to delete a financial aid application
router.delete('/applications/:id', auth, adminAuthorization, deleteApplication);

module.exports = router;
