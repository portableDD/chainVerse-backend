const Certificate = require('../models/Certificate');
const Course = require('../models/course');
const Student = require('../models/student');
const QRCode = require('qrcode');
const { generatePDF } = require('../utils/pdfGenerator');
const { uploadToS3 } = require('../utils/s3Uploader');
const { v4: uuidv4 } = require('uuid');
const { createHash } = require('crypto');
const AdmZip = require('adm-zip');
const path = require('path');

// Helper: Verify certificate ownership
const verifyCertificateOwnership = async (certificateId, userId) => {
  const certificate = await Certificate.findOne({
    _id: certificateId,
    studentId: userId,
    status: 'ACTIVE',
  });
  return certificate;
};

// Generate verification hash
exports.generateVerificationHash = (certificate) => {
  const data = `${certificate.studentId}${certificate.courseId}${certificate.issueDate}${certificate.certificateNumber}`;
  return createHash('sha256').update(data).digest('hex');
};

// Complete a course and generate certificate
exports.completeCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const verificationId = uuidv4();
    const qrData = `${process.env.BASE_URL}/verify/certificate/${verificationId}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const pdfBuffer = await generatePDF({
      studentName: req.user.name,
      courseTitle: course.title,
      tutorName: course.tutorName,
      completionDate: new Date().toLocaleDateString(),
      qrCode,
      verificationId,
    });

    const pdfUrl = await uploadToS3(pdfBuffer, `certificates/${studentId}_${courseId}.pdf`);

    const cert = await Certificate.create({
      studentId,
      courseId,
      tutorName: course.tutorName,
      completionDate: new Date(),
      certificateUrl: pdfUrl,
      verificationId,
      status: 'ACTIVE'
    });

    res.status(201).json({ message: 'Course completed', certificate: cert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error completing course' });
  }
};

// Get a student's certificate for a course
exports.getCertificate = async (req, res) => {
  try {
    const cert = await verifyCertificateOwnership(req.params.certificateId || req.params.id, req.user._id);
    if (!cert) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: cert,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving certificate', error: err.message });
  }
};

// Get all certificates for a student
exports.getMyCertificates = async (req, res) => {
  try {
    const { courseId, startDate, endDate } = req.query;
    let query = { studentId: req.user._id, status: 'ACTIVE' };

    if (courseId) query.courseId = courseId;
    if (startDate || endDate) {
      query.issueDate = {};
      if (startDate) query.issueDate.$gte = new Date(startDate);
      if (endDate) query.issueDate.$lte = new Date(endDate);
    }

    const certificates = await Certificate.find(query)
      .populate('courseId', 'title')
      .sort({ issueDate: -1 });

    res.status(200).json({ success: true, data: certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving certificates', error: error.message });
  }
};

// Download all certificates as ZIP
exports.downloadAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      studentId: req.user._id,
      status: 'ACTIVE',
    }).populate('courseId', 'title');

    if (!certificates.length) {
      return res.status(404).json({
        success: false,
        message: 'No certificates found',
      });
    }

    const zip = new AdmZip();
    for (const cert of certificates) {
      const pdfContent = await downloadPDF(cert.certificateUrl); // You must define this function elsewhere
      zip.addFile(`${cert.courseId.title}_${cert._id}.pdf`, pdfContent);
    }

    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', `attachment; filename="certificates_${req.user._id}.zip"`);

    res.send(zip.toBuffer());
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error downloading certificates', error: error.message });
  }
};
