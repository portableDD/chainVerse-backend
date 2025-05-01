// filepath: financial-aid-admin/financial-aid-admin/src/controllers/adminFinancialAidController.js
const FinancialAid = require('../models/financialAid');
const { validationResult } = require('express-validator');
const { notificationService } = require('../utils/notificationService');
// Retrieve all financial aid applications
exports.getAllApplications = async (req, res) => {
    try {
        const applications = await FinancialAid.find()
            .populate('courseId', 'title description price')
            .sort({ createdAt: -1 });

        res.json({
            count: applications.length,
            applications,
        });
    } catch (error) {
        console.error('Error retrieving financial aid applications:', error);
        res.status(500).json({ message: 'Server error', errors: error });
    }
};

// Retrieve a single financial aid application by ID
exports.getApplicationById = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await FinancialAid.findById(id)
            .populate('courseId', 'title description price');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (error) {
        console.error('Error retrieving financial aid application:', error);
        res.status(500).json({ message: 'Server error', errors: error });
    }
};

// Review and respond to a financial aid application
exports.reviewApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedback } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const application = await FinancialAid.findByIdAndUpdate(
            id,
            { status, feedback },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Send notification to the user about the decision
        await notificationService.sendApplicationDecisionNotification(application.userId, application);

        res.json({
            message: 'Application reviewed successfully',
            application,
        });
    } catch (error) {
        console.error('Error reviewing financial aid application:', error);
        res.status(500).json({ message: 'Server error', errors: error });
    }
};