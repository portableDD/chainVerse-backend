const ContactMessage = require('../models/ContactMessage');

// Submit Contact Message
exports.submitMessage = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const contactMessage = new ContactMessage({ fullName, email, subject, message });
    await contactMessage.save();
    res.status(201).json({ message: 'Message submitted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Get All Contact Messages (Admin Only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Get Contact Message by ID (Admin Only)
exports.getMessageById = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Update Contact Message Status (Admin Only)
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const message = await ContactMessage.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    if (status) message.status = status;
    if (adminNote) message.adminNote = adminNote;
    message.updatedAt = Date.now();
    await message.save();
    res.status(200).json({ message: 'Message updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Delete Contact Message (Admin Only)
exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};