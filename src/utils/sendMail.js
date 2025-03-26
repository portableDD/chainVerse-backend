const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   },
});

exports.sendEmail = async (email, verificationCode) => {
   try {
      const info = await transport.sendMail({
         from: process.env.EMAIL_USER,
         to: email,
         subject: "Account Verification",
         html: `<h1>Your Verification Code: ${verificationCode}</h1>`,
      });

      // If email is successfully sent
      if (info.accepted.includes(email)) {
         return true; 
      }
      return false; 
   } catch (error) {
      console.error("Error sending email:", error.message);
      throw new Error(error.message); 
   }
};
