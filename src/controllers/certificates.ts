import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Certificate } from "../models/Certificate";
import { sendCertificateEmail } from "../emailUtils";  // Import the email function

export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      studentFullName,
      studentEmail,
      courseTitle,
      courseInstructorName,
    } = req.body;

    // Generate certificate details
    const certificateId = uuidv4();
    const completionDate = new Date().toISOString();
    const verificationLink = `https://chainverse.academy/certificates/${certificateId}`;

    // Create certificate object
    const newCertificate = new Certificate({
      certificateId,
      studentId,
      studentFullName,
      studentEmail,
      courseTitle,
      courseInstructorName,
      completionDate,
      issuedBy: "ChainVerse Academy",
      verificationLink,
    });

    // Save certificate (simulate DB or implement logic)
    await newCertificate.save();

    // Send email
    await sendCertificateEmail(
      studentEmail,
      studentFullName,
      courseTitle,
      verificationLink
    );

    // Respond to client
    res.status(200).json({
      message: "Certificate generated and email sent!",
      certificate: newCertificate,
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
