const express = require('express');
const router = express.Router();
const { 
  submitMessage, 
  getAllMessages, 
  getMessageById, 
  updateMessageStatus, 
  deleteMessage 
} = require('../controllers/contactMessageController');
const adminAuthorization = require('../middlewares/adminAuthorization');
const auth = require('../middlewares/auth');

// Public route to submit a contact message
router.post('/contact-us', submitMessage);

// Admin-only routes
router.get('/contact-us', [auth, adminAuthorization], getAllMessages);
router.get('/contact-us/:id', [auth, adminAuthorization], getMessageById);
router.patch('/contact-us/:id', [auth, adminAuthorization], updateMessageStatus);
router.delete('/contact-us/:id', [auth, adminAuthorization], deleteMessage);

module.exports = router;