const Certificate = require('../models/Certificate');
const Course = require('../models/course');
const Student = require('../models/student');
const QRCode = require('qrcode');
const { generatePDF } = require('../utils/pdfGenerator');
const { uploadToS3 } = require('../utils/s3Uploader');
const { v4: uuidv4 } = require('uuid');

exports.completeCourse = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // TODO: Validate course completion logic
    const verificationId = uuidv4();
    const qrData = `${process.env.BASE_URL}/verify/certificate/${verificationId}`;
    const qrCode = await QRCode.toDataURL(qrData);

    const pdfBuffer = await generatePDF({
      studentName: req.user.name,
      courseTitle: course.title,
      tutorName: course.tutorName,
      completionDate: new Date().toLocaleDateString(),
      qrCode,
      verificationId
    });

    const pdfUrl = await uploadToS3(pdfBuffer, `certificates/${studentId}_${courseId}.pdf`);

    const cert = await Certificate.create({
      studentId,
      courseId,
      tutorName: course.tutorName,
      completionDate: new Date(),
      certificateUrl: pdfUrl,
      verificationId
    });

    res.status(201).json({ message: 'Course completed', certificate: cert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error completing course' });
  }
};

exports.getCertificate = async (req, res) => {
  try {
    const studentId = req.user._id;
    const courseId = req.params.id;
    const cert = await Certificate.findOne({ studentId, courseId });
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });

    res.status(200).json(cert);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch certificate' });
  }
};
