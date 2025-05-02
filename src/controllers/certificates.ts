import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// Temporary in-memory certificate store
const certificates: any[] = [];

export const generateCertificate = (req: Request, res: Response) => {
  const {
    studentId,
    studentFullName,
    studentEmail,
    courseId,
    courseTitle,
    courseInstructorName,
  } = req.body;

  // Basic validation
  if (!studentId || !courseId || !studentFullName || !studentEmail || !courseTitle) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const certificateId = uuidv4();
  const completionDate = new Date().toISOString();
  const verificationLink = `https://chainverse.academy/certificates/${certificateId}`;

  const certificate = {
    certificateId,
    studentId,
    studentFullName,
    studentEmail,
    courseId,
    courseTitle,
    courseInstructorName: courseInstructorName || "N/A",
    completionDate,
    issuedBy: "ChainVerse Academy",
    verificationLink,
    web3Badge: true,
  };

  certificates.push(certificate);

  // NOTE: Later we will add email notification here.

  return res.status(201).json({
    message: "Certificate generated successfully.",
    certificate,
  });
};

export const getMyCertificates = (req: Request, res: Response) => {
  const { studentId } = req.query;

  if (!studentId) {
    return res.status(400).json({ message: "studentId is required as query parameter." });
  }

  const userCertificates = certificates.filter((cert) => cert.studentId === studentId);

  return res.status(200).json({ certificates: userCertificates });
};

export const getCertificateById = (req: Request, res: Response) => {
  const { certificateId } = req.params;

  const certificate = certificates.find((cert) => cert.certificateId === certificateId);

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found." });
  }

  return res.status(200).json({ certificate });
};
