import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Certificate } from "../models/Certificate";
import { sendCertificateEmail } from "../emailUtils";
import path from "path";
import fs from "fs";
import ejs from "ejs";

// POST /certificates/generate
export const generateCertificate = async (req: Request, res: Response) => {
  try {
    const {
      studentId,
      studentFullName,
      studentEmail,
      courseTitle,
      courseInstructorName,
    } = req.body;

    const certificateId = uuidv4();
    const completionDate = new Date().toISOString();
    const verificationLink = `https://chainverse.academy/certificates/view/${certificateId}`;

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

    await newCertificate.save();

    await sendCertificateEmail(
      studentEmail,
      studentFullName,
      courseTitle,
      verificationLink
    );

    res.status(200).json({
      message: "Certificate generated and email sent!",
      certificate: newCertificate,
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /certificates/view/:certificateId
export const viewCertificate = async (req: Request, res: Response) => {
  const { certificateId } = req.params;

  const certificate = await Certificate.findById(certificateId); // Replace with actual DB logic

  if (!certificate) {
    return res.status(404).send("Certificate not found");
  }

  const templatePath = path.join(__dirname, "../templates/certificateTemplate.html");
  const templateContent = fs.readFileSync(templatePath, "utf-8");

  const html = ejs.render(templateContent, certificate.toObject());

  res.send(html);
};
