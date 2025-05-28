const express = require('express');
const router = express.Router();
const { 
  submitMessage, 
  getAllMessages, 
  getMessageById, 
  updateMessageStatus, 
  deleteMessage 
} = require('../controllers/contactMessageController');
const isAdmin = require('../middlewares/admin');
const auth = require('../middlewares/auth');

// Public route to submit a contact message
router.post('/contact-us', submitMessage);

// Admin-only routes
router.get('/contact-us', [auth.authenticate, isAdmin.ensureAdmin], getAllMessages);
router.get('/contact-us/:id', [auth.authenticate, isAdmin.ensureAdmin], getMessageById);
router.patch('/contact-us/:id', [auth.authenticate, isAdmin.ensureAdmin], updateMessageStatus);
router.delete('/contact-us/:id', [auth.authenticate, isAdmin.ensureAdmin], deleteMessage);

module.exports = router;