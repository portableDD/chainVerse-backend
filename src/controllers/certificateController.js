const Certificate = require("../models/Certificate");
const { createHash } = require("crypto");
const AdmZip = require("adm-zip");
const path = require("path");

// Helper function to verify certificate ownership
const verifyCertificateOwnership = async (certificateId, userId) => {
  const certificate = await Certificate.findOne({
    _id: certificateId,
    studentId: userId,
    status: "ACTIVE"
  });
  return certificate;
};

// Get all certificates for the authenticated student
exports.getMyCertificates = async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    let query = { studentId: req.user.id, status: "ACTIVE" };

    if (courseId) {
      query.courseId = courseId;
    }

    if (startDate || endDate) {
      query.issueDate = {};
      if (startDate) query.issueDate.$gte = new Date(startDate);
      if (endDate) query.issueDate.$lte = new Date(endDate);
    }

    const certificates = await Certificate.find(query)
      .populate("courseId", "title")
      .sort({ issueDate: -1 });

    res.status(200).json({
      success: true,
      data: certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving certificates",
      error: error.message
    });
  }
};

// Get a single certificate
exports.getCertificate = async (req, res) => {
  try {
    const certificate = await verifyCertificateOwnership(req.params.certificateId, req.user.id);
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found or access denied"
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving certificate",
      error: error.message
    });
  }
};

// Download all certificates as ZIP
exports.downloadAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      studentId: req.user.id,
      status: "ACTIVE"
    }).populate("courseId", "title");

    if (!certificates.length) {
      return res.status(404).json({
        success: false,
        message: "No certificates found"
      });
    }

    const zip = new AdmZip();
    
    // Add each certificate PDF to the ZIP
    for (const cert of certificates) {
      const pdfContent = await downloadPDF(cert.pdfUrl); // You'll need to implement this based on your storage solution
      zip.addFile(`${cert.metadata.courseName}_${cert.certificateNumber}.pdf`, pdfContent);
    }

    // Set response headers
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename="certificates_${req.user.id}.zip"`);
    
    // Send the ZIP file
    res.send(zip.toBuffer());
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error downloading certificates",
      error: error.message
    });
  }
};

// Generate verification hash
exports.generateVerificationHash = (certificate) => {
  const data = `${certificate.studentId}${certificate.courseId}${certificate.issueDate}${certificate.certificateNumber}`;
  return createHash('sha256').update(data).digest('hex');
};