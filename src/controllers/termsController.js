const Terms = require('../models/Terms');
const mongoose = require('mongoose');

// Create terms and conditions
exports.createTerms = async (req, res) => {
  try {
    const { title, content } = req.body;

    // confirm if terms already exists
    const existingTerm = await Terms.findOne({ title });
    if (existingTerm) {
      return res.status(400).json({ msg: 'Term with same title already exists' });
    }

    // Create new terms with given data
    const newTerms = new Terms({ title, content });
    await newTerms.save();

    res.status(201).json({ success: true, data: newTerms });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to create terms' });
  }
};

// Retrieve all terms
exports.getAllTerms = async (req, res) => {
  try {
    // search terms and sort by: latest first
    const terms = await Terms.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: terms.length, data: terms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to retrieve terms' });
  }
};

// Retrieve Terms by ID
exports.getTermsById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid term ID.' });
    }

    const term = await Terms.findById(id);
    if (!term) {
      return res.status(404).json({ msg: 'Term not found' });
    }

    res.status(200).json({ success: true, data: term });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to retrieve term by ID' });
  }
};

// Update term
exports.updateTerm = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    // Validate Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid term ID.' });
    }

    const updatedTerm = await Terms.findByIdAndUpdate(id,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedTerm) {
      return res.status(404).json({ msg: 'Term not found' });
    }

    res.status(200).json({ success: true, data: updatedTerm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to update term' });
  }
};

// Delete Terms
exports.deleteTerm = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: 'Invalid term ID.' });
    }

    const deletedTerm = await Terms.findByIdAndDelete(id);
    if (!deletedTerm) {
      return res.status(404).json({ msg: 'Term not found' });
    }

    res.status(200).json({ success: true, msg: 'Term deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to delete term' });
  }
};