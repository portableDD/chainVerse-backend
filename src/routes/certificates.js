const { Router } = require("express");
const { v4: uuidv4 } = require("uuid");

const router = Router();

const certificates = [];

router.post("/generate", (req, res) => {
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

  const certificate = {
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

router.get("/my-certificates", (req, res) => {
  const { studentId } = req.query;

  if (!studentId || typeof studentId !== "string") {
    return res.status(400).json({ message: "studentId query is required" });
  }

  const studentCertificates = certificates.filter(
    (cert) => cert.studentId === studentId
  );

  return res.json({ certificates: studentCertificates });
});

router.get("/:certificateId", (req, res) => {
  const { certificateId } = req.params;

  const certificate = certificates.find(
    (cert) => cert.certificateId === certificateId
  );

  if (!certificate) {
    return res.status(404).json({ message: "Certificate not found" });
  }

  return res.json({ certificate });
});

module.exports = router;
