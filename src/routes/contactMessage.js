const express = require('express');
const router = express.Router();
const { 
  submitMessage, 
  getAllMessages, 
  getMessageById, 
  updateMessageStatus, 
  deleteMessage 
} = require('../controllers/contactController');

// Public route to submit a contact message
router.post('/contact-us', submitMessage);

// Admin-only routes
router.get('/contact-us', isAdmin, getAllMessages);
router.get('/contact-us/:id', isAdmin, getMessageById);
router.patch('/contact-us/:id', isAdmin, updateMessageStatus);
router.delete('/contact-us/:id', isAdmin, deleteMessage);

module.exports = router;