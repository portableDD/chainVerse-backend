// filepath: financial-aid-admin/financial-aid-admin/src/controllers/notificationController.js
const NotificationService = require('../utils/notificationService');

// Send notification to student about application decision
exports.sendApplicationDecisionNotification = async (req, res) => {
    try {
        const { userId, applicationId, decision, feedback } = req.body;

        // Construct the notification message
        const message = `Your application with ID ${applicationId} has been ${decision}. Feedback: ${feedback || 'No feedback provided.'}`;

        // Send notification using the notification service
        await NotificationService.sendNotification(userId, message);

        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Server error', errors: error });
    }
};