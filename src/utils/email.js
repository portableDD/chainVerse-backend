const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendApprovalEmail = async (to, name, comments = '') => {
  try {
    const mailOptions = {
      from: `ChainVerse Academy <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Your Tutor Application Has Been Approved!',
      html: `
        <h1>Congratulations ${name}!</h1>
        <p>We're excited to inform you that your tutor application at ChainVerse Academy has been approved!</p>
        ${comments ? `<p><strong>Admin Comments:</strong> ${comments}</p>` : ''}
        <h3>Next Steps:</h3>
        <ol>
          <li>You will receive a welcome email from our team within 48 hours</li>
          <li>Complete your tutor profile setup</li>
          <li>Schedule an onboarding call with our team</li>
        </ol>
        <p>If you have any questions, please reply to this email.</p>
        <p>Welcome aboard!</p>
        <p><strong>The ChainVerse Academy Team</strong></p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending approval email:', err);
    throw err;
  }
};

exports.sendRejectionEmail = async (to, name, comments = '') => {
  try {
    const mailOptions = {
      from: `ChainVerse Academy <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Update on Your Tutor Application',
      html: `
        <h1>Dear ${name},</h1>
        <p>Thank you for applying to become a tutor at ChainVerse Academy.</p>
        <p>After careful consideration, we regret to inform you that we're unable to approve your application at this time.</p>
        ${comments ? `<p><strong>Feedback:</strong> ${comments}</p>` : ''}
        <h3>Suggestions for Improvement:</h3>
        <ul>
          <li>Gain more experience in your field of expertise</li>
          <li>Consider refining your course proposal</li>
          <li>Strengthen your portfolio with relevant projects</li>
        </ul>
        <p>We encourage you to apply again in the future as you continue to develop your skills.</p>
        <p>Thank you for your interest in ChainVerse Academy.</p>
        <p><strong>The ChainVerse Academy Team</strong></p>
      `
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error sending rejection email:', err);
    throw err;
  }
};
