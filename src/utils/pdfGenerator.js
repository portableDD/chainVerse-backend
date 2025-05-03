const PDFDocument = require('pdfkit');

exports.generatePDF = ({ studentName, courseTitle, tutorName, completionDate, qrCode, verificationId }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.fontSize(24).text('Course Completion Certificate', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`This certifies that ${studentName} has completed the course: ${courseTitle}.`, { align: 'center' });
    doc.moveDown();
    doc.text(`Tutor: ${tutorName} | Date: ${completionDate}`, { align: 'center' });
    doc.moveDown();
    doc.text(`Verification ID: ${verificationId}`, { align: 'center' });
    doc.image(qrCode, { align: 'center', width: 100 });

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.end();
  });
};
