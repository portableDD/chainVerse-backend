import { Request, Response } from "express";
import { Certificate } from "../models/certificate";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../utils/email";
import { certificateTemplate } from "../templates/certificateTemplate";

const certificates: Certificate[] = [];

export const generateCertificate = (req: Request, res: Response) => {
  const {
    studentId,
    studentFullName,
    studentEmail,
    courseId,
    courseTitle,
    courseInstructorName
  } = req.body;

  if (!studentId || !courseId || !studentFullName || !studentEmail || !courseTitle) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const certificateId = uuidv4();
  const completionDate = new Date().toISOString().split("T")[0];
  const verificationLink = `https://chainverse.academy/certificates/${certificateId}`;

  const certificate: Certificate = {
    certificateId,
    studentId,
    studentFullName,
    courseId,
    courseTitle,
    courseInstructorName,
    completionDate,
    issuedBy: "ChainVerse Academy",
    verificationLink,
    web3Badge: true,
  };

  certificates.push(certificate);

  // Simulate sending email
  const html = certificateTemplate(certificate);
  sendEmail(studentEmail, "Your ChainVerse Certificate", html);

  return res.status(201).json({ message: "Certificate generated", certificate });
};

export const getCertificateById = (req: Request, res: Response) => {
  const cert = certificates.find(c => c.certificateId === req.params.id);
  if (!cert) {
    return res.status(404).json({ message: "Certificate not found" });
  }
  res.send(certificateTemplate(cert));
};
