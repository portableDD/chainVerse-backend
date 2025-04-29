const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
    },
  email: { 
    type: String, 
    required: true 
    },
  subject: { 
    type: String, 
    required: true 
    },
  message: { 
    type: String, 
    required: true 
    },
  status: { 
    type: String, 
    enum: ['pending', 'resolved', 'responded'], 
    default: 'pending' 
    },
  adminNote: { 
    type: String 
    },
  submittedAt: { 
    type: Date, 
    default: Date.now 
    },
  updatedAt: { 
    type: Date, 
    default: Date.now 
    }
});

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);