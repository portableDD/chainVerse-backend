import nodemailer from "nodemailer";

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Your email from .env
    pass: process.env.EMAIL_PASS,  // Your app password from .env
  },
});

// Function to send email
export const sendCertificateEmail = async (
  to_email: string,
  student_name: string,
  course_title: string,
  verification_link: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,  // Sender's email
    to: to_email,                  // Recipient's email
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
    console.log("Certificate email sent!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send certificate email.");
  }
};
