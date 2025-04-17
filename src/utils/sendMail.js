const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

exports.sendEmail = async (email, verificationCode, subject, message = '') => {
	try {
		const info = await transport.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: subject,
			html: `<h1>Your ${subject} Code: ${verificationCode}</h1> <p>${message}</p>`,
		});

		// If email is successfully sent
		if (info.accepted.includes(email)) {
			return true;
		}
		return false;
	} catch (error) {
		console.error('Error sending email:', error.message);
		throw new Error(error.message);
	}
};
