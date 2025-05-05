const OrganizationMember = require('../models/OrganizationMember');
const User = require('../models/User');
const Organization = require('../models/Organization');
const crypto = require('crypto');
const { sendMemberInvitation, sendMemberRemovalNotification } = require('../utils/organizationEmailService');

// Add new organization member
exports.addMember = async (req, res) => {
  try {
    const { email, fullName, role } = req.body;

    // Check if member already exists
    const existingMember = await OrganizationMember.findOne({
      organizationId: req.user.organizationId,
      email
    });

    if (existingMember) {
      return res.status(400).json({ message: 'Member already exists in the organization' });
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const invitationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const newMember = new OrganizationMember({
      organizationId: req.user.organizationId,
      email,
      fullName,
      role,
      invitationToken,
      invitationExpires
    });

    await newMember.save();

    // Get organization name for the email
    const organization = await Organization.findById(req.user.organizationId);
    
    // Send invitation email
    await sendMemberInvitation(email, fullName, organization.name, invitationToken);

    res.status(201).json({
      message: 'Member invitation sent successfully',
      data: newMember
    });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all organization members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await OrganizationMember.find({
      organizationId: req.user.organizationId
    }).select('-invitationToken');

    res.status(200).json({
      message: 'Members retrieved successfully',
      data: members
    });
  } catch (error) {
    console.error('Error getting members:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single member details
exports.getMemberById = async (req, res) => {
  try {
    const member = await OrganizationMember.findOne({
      _id: req.params.id,
      organizationId: req.user.organizationId
    }).select('-invitationToken');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({
      message: 'Member details retrieved successfully',
      data: member
    });
  } catch (error) {
    console.error('Error getting member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update member role
exports.updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;

    const member = await OrganizationMember.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.user.organizationId
      },
      { role },
      { new: true }
    ).select('-invitationToken');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.status(200).json({
      message: 'Member role updated successfully',
      data: member
    });
  } catch (error) {
    console.error('Error updating member role:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove organization member
exports.removeMember = async (req, res) => {
  try {
    const member = await OrganizationMember.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId
    });

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Get organization name for the email
    const organization = await Organization.findById(req.user.organizationId);
    
    // Send removal notification
    await sendMemberRemovalNotification(member.email, member.fullName, organization.name);

    res.status(200).json({
      message: 'Member removed successfully',
      data: member
    });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};