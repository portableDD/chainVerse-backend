const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendMemberInvitation = async (to, fullName, organizationName, invitationToken) => {
  try {
    const invitationLink = `${process.env.FRONTEND_URL}/organization/member/accept-invitation?token=${invitationToken}`;
    
    const mailOptions = {
      from: `ChainVerse <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Invitation to Join Organization',
      html: `
        <h1>Welcome to ${organizationName}!</h1>
        <p>Dear ${fullName},</p>
        <p>You have been invited to join ${organizationName} on ChainVerse. Click the button below to accept the invitation and set up your account:</p>
        <div style="margin: 30px 0;">
          <a href="${invitationLink}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">Accept Invitation</a>
        </div>
        <p>This invitation link will expire in 24 hours.</p>
        <p>If you did not expect this invitation, please ignore this email.</p>
        <p>Best regards,<br>The ChainVerse Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info.accepted.includes(to);
  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw new Error('Failed to send invitation email');
  }
};

exports.sendMemberRemovalNotification = async (to, fullName, organizationName) => {
  try {
    const mailOptions = {
      from: `ChainVerse <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Organization Membership Update',
      html: `
        <h1>Organization Membership Update</h1>
        <p>Dear ${fullName},</p>
        <p>This email is to inform you that your membership with ${organizationName} has been terminated.</p>
        <p>If you believe this is a mistake, please contact your organization administrator.</p>
        <p>Best regards,<br>The ChainVerse Team</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info.accepted.includes(to);
  } catch (error) {
    console.error('Error sending removal notification:', error);
    throw new Error('Failed to send removal notification');
  }
};