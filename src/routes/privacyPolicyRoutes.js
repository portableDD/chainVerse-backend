const express = require('express');
const router = express.Router();
const privacyPolicyController = require('../controllers/PrivacyPolicyController');
const { validatePrivacyPolicy } = require('../middlewares/validatePrivacyPolicy');
const { authorizeRoles } = require('../middlewares/authMiddleware');

// Protect all privacy policy routes to admin and super-admin roles only
router.use(authorizeRoles('admin', 'super-admin'));

// Create Privacy Policy
router.post('/settings/privacy-policy', validatePrivacyPolicy, privacyPolicyController.createPrivacyPolicy);

// Retrieve All Privacy Policies
router.get('/settings/privacy-policy', privacyPolicyController.getAllPrivacyPolicies);

// Retrieve Privacy Policy by ID
router.get('/settings/privacy-policy/:id', privacyPolicyController.getPrivacyPolicyById);

// Update Privacy Policy
router.patch('/settings/privacy-policy/:id', validatePrivacyPolicy, privacyPolicyController.updatePrivacyPolicy);

// Delete Privacy Policy
router.delete('/settings/privacy-policy/:id', privacyPolicyController.deletePrivacyPolicy);

module.exports = router;