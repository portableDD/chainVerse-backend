const express = require('express');
const { 
    getAllApplications, 
    getApplicationById, 
    reviewApplication 
} = require('../controllers/adminFinancialAidController');
const auth = require('../middlewares/auth');
const adminAuthorization = require('../middlewares/adminAuthorization');

const router = express.Router();

// Route to get all financial aid applications
router.get('/applications', auth, adminAuthorization, getAllApplications);

// Route to get a single financial aid application by ID
router.get('/applications/:id', auth, adminAuthorization, getApplicationById);

// Route to review and respond to a financial aid application
router.post('/applications/:id/review', auth, adminAuthorization, reviewApplication);


router.delete('/applications/:id', auth, adminAuthorization, (req, res) => {

    res.status(200).send({ message: 'Application deleted successfully' });
});

module.exports = router;