import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password (not normal password)
  },
});

export const sendCertificateEmail = async (
  toEmail: string,
  studentName: string,
  courseTitle: string,
  verificationLink: string
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "🎓 Your ChainVerse Certificate is Ready!",
    html: `
      <h2>Hi ${studentName},</h2>
      <p>Congratulations on completing <strong>${courseTitle}</strong>!</p>
      <p>Your certificate is ready. You can verify or download it below:</p>
      <a href="${verificationLink}" target="_blank">${verificationLink}</a>
      <p>🎉 Issued by ChainVerse Academy</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
