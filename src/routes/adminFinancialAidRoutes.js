const express = require('express');
const { 
    getAllApplications, 
    getApplicationById, 
    reviewApplication, 
    deleteApplication 
} = require('../controllers/adminFinancialAidController');
const auth = require('../middlewares/auth');
const adminAuthorization = require('../middlewares/adminAuthorization');
const isAdmin = require('../middlewares/admin');

const router = express.Router();

// Route to get all financial aid applications
router.get('/applications', auth.authenticate, isAdmin.ensureAdmin, getAllApplications);

// Route to get a single financial aid application by ID
router.get('/applications/:id',  auth.authenticate, isAdmin.ensureAdmin, getApplicationById);

// Route to make a decision (approve/deny) on a financial aid application
router.post('/applications/:id/decision',  auth.authenticate, isAdmin.ensureAdmin, reviewApplication);

// Route to delete a financial aid application
router.delete('/applications/:id', auth.authenticate, isAdmin.ensureAdmin, deleteApplication);

module.exports = router;
