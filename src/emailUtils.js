const nodemailer = require('nodemailer');

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // Your app password from .env
  },
});

// Function to send email
const sendCertificateEmail = async (
  to_email,
  student_name,
  course_title,
  verification_link
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email
    to: to_email,                 // Recipient's email
    subject: `Your Certificate for ${course_title}`,
    html: `
      <h3>Congratulations, ${student_name}!</h3>
      <p>You have successfully completed the course: <strong>${course_title}</strong>.</p>
      <p>Click the link below to verify your certificate:</p>
      <a href="${verification_link}">Verify Certificate</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Certificate email sent!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send certificate email.');
  }
};

module.exports = {
  sendCertificateEmail,
};
