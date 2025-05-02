const nodemailer = require('nodemailer');
const { sendMemberInvitation, sendMemberRemovalNotification } = require('../utils/organizationEmailService');

// Mock nodemailer
jest.mock('nodemailer');

describe('Organization Email Service Tests', () => {
  let mockTransporter;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock transporter
    mockTransporter = {
      sendMail: jest.fn().mockImplementation((mailOptions) => {
        return Promise.resolve({
          accepted: [mailOptions.to]
        });
      })
    };

    // Mock the createTransport to return our mock transporter
    nodemailer.createTransport.mockReturnValue(mockTransporter);

    // Mock environment variables
    process.env.EMAIL_USERNAME = 'test@example.com';
    process.env.EMAIL_PASSWORD = 'test-password';
    process.env.FRONTEND_URL = 'http://localhost:3000';
  });

  describe('sendMemberInvitation', () => {
    const testData = {
      to: 'newmember@test.com',
      fullName: 'Test Member',
      organizationName: 'Test Organization',
      invitationToken: 'test-token'
    };

    it('should send invitation email successfully', async () => {
      const result = await sendMemberInvitation(
        testData.to,
        testData.fullName,
        testData.organizationName,
        testData.invitationToken
      );

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
      
      const mailOptions = mockTransporter.sendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe(testData.to);
      expect(mailOptions.subject).toBe('Invitation to Join Organization');
      expect(mailOptions.html).toContain(testData.fullName);
      expect(mailOptions.html).toContain(testData.organizationName);
      expect(mailOptions.html).toContain(testData.invitationToken);
    });

    it('should handle email sending failure', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Failed to send'));

      await expect(sendMemberInvitation(
        testData.to,
        testData.fullName,
        testData.organizationName,
        testData.invitationToken
      )).rejects.toThrow('Failed to send invitation email');
    });
  });

  describe('sendMemberRemovalNotification', () => {
    const testData = {
      to: 'member@test.com',
      fullName: 'Test Member',
      organizationName: 'Test Organization'
    };

    it('should send removal notification successfully', async () => {
      const result = await sendMemberRemovalNotification(
        testData.to,
        testData.fullName,
        testData.organizationName
      );

      expect(result).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledTimes(1);
      
      const mailOptions = mockTransporter.sendMail.mock.calls[0][0];
      expect(mailOptions.to).toBe(testData.to);
      expect(mailOptions.subject).toBe('Organization Membership Update');
      expect(mailOptions.html).toContain(testData.fullName);
      expect(mailOptions.html).toContain(testData.organizationName);
    });

    it('should handle email sending failure', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Failed to send'));

      await expect(sendMemberRemovalNotification(
        testData.to,
        testData.fullName,
        testData.organizationName
      )).rejects.toThrow('Failed to send removal notification');
    });
  });
});