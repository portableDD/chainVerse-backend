const PlatformInfo = require('../models/PlatformInfo');

// Create platform information
exports.createPlatformInfo = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Check if title already exists
    const existingInfo = await PlatformInfo.findOne({ title });
    if (existingInfo) {
      return res.status(400).json({ msg: 'Information section with this title already exists' });
    }
    
    const platformInfo = new PlatformInfo({
      title,
      content
    });
    
    await platformInfo.save();
    
    res.status(201).json({
      success: true,
      data: platformInfo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all platform information
exports.getAllPlatformInfo = async (req, res) => {
  try {
    const platformInfo = await PlatformInfo.find().select('title createdAt updatedAt');
    
    res.status(200).json({
      success: true,
      count: platformInfo.length,
      data: platformInfo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get single platform information by ID
exports.getPlatformInfoById = async (req, res) => {
  try {
    const platformInfo = await PlatformInfo.findById(req.params.id);
    
    if (!platformInfo) {
      return res.status(404).json({ msg: 'Information section not found' });
    }
    
    res.status(200).json({
      success: true,
      data: platformInfo
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Information section not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update platform information
exports.updatePlatformInfo = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    let platformInfo = await PlatformInfo.findById(req.params.id);
    
    if (!platformInfo) {
      return res.status(404).json({ msg: 'Information section not found' });
    }
    
    // Check if updating to a title that already exists (but not the same record)
    if (title && title !== platformInfo.title) {
      const existingInfo = await PlatformInfo.findOne({ title });
      if (existingInfo) {
        return res.status(400).json({ msg: 'Information section with this title already exists' });
      }
    }
    
    platformInfo = await PlatformInfo.findByIdAndUpdate(
      req.params.id,
      { 
        title: title || platformInfo.title,
        content: content || platformInfo.content,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: platformInfo
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Information section not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete platform information
exports.deletePlatformInfo = async (req, res) => {
  try {
    const platformInfo = await PlatformInfo.findById(req.params.id);
    
    if (!platformInfo) {
      return res.status(404).json({ msg: 'Information section not found' });
    }
    
    await platformInfo.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Information section not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};