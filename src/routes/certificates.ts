import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

const router = Router();

interface Certificate {
  certificateId: string;
  studentId: string;
  courseId: string;
  studentFullName: string;
  courseTitle: string;
  courseInstructorName?: string;
  completionDate: string;
  issuedBy: string;
  verificationLink: string;
  web3Badge: boolean;
  certificateHash?: string;
}

const certificates: Certificate[] = [];

// POST /certificates/generate
router.post("/generate", (req: Request, res: Response) => {
  const {
    studentId,
    courseId,
    studentFullName,
    courseTitle,
    courseInstructorName,
  } = req.body;

  if (!studentId || !courseId || !studentFullName || !courseTitle) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const certificateId = uuidv4();
  const completionDate = new Date().toISOString().split("T")[0];
  const verificationLink = `https://chainverse.academy/certificates/${certificateId}`;

  const certificate: Certificate = {
    certificateId,
    studentId,
    courseId,
    studentFullName,
    courseTitle,
    courseInstructorName,
    completionDate,
    issuedBy: "ChainVerse Academy",
    verificationLink,
    web3Badge: true,
  };

  certificates.push(certificate);

  return res.status(201).json({
    message: "Certificate generated successfully",
    certificate,
  });
});

// GET /certificates/my-certificates?studentId=123
router.get("/my-certificates", (req: Request, res: Response) => {
  const { studentId } = req.query;

  if (!studentId || typeof studentId !== "string") {
    return res.status(400).json({ message: "studentId query is required" });
  }

  const studentCertificates = certificates.filter(
    (cert) => cert.studentId === studentId
  );

  return res.json({ certificates: studentCertificates });
});

// GET /certificates/:certificateId
router.get("/:certificateId", (req: Request, res: Response) => {
  const { certificateId } = req.params;

  const certificate = certificates.find(
    (cert) => cert.certificateId === certificateId
  );

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found" });
  }

  return res.json({ certificate });
});

export default router;
