const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const logger = require('./logger');

// Register fonts
// registerFont(path.join(__dirname, '../assets/fonts/Poppins-Bold.ttf'), { family: 'Poppins-Bold' });
// registerFont(path.join(__dirname, '../assets/fonts/Poppins-Regular.ttf'), { family: 'Poppins-Regular' });

/**
 * Generate a certificate image
 * @param {Object} certificate - Certificate data
 * @returns {Promise<Buffer>} - Generated certificate image as buffer
 */
exports.generateCertificateImage = async (certificate) => {
  try {
    // Create canvas
    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');
    
    // Load template image
   // const templateImage = await loadImage(path.join(__dirname, '../assets/images/certificate-template.png'));
    ctx.drawImage(templateImage, 0, 0, 1200, 800);
    
    // Set styles for student name
    ctx.font = '48px "Poppins-Bold"';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#1A2B4A';
    ctx.fillText(certificate.studentName, 600, 400);
    
    // Set styles for course title
    ctx.font = '32px "Poppins-Regular"';
    ctx.fillText(`has successfully completed the course`, 600, 450);
    
    // Set styles for course name
    ctx.font = '36px "Poppins-Bold"';
    ctx.fillText(certificate.courseTitle, 600, 500);
    
    // Set styles for date
    ctx.font = '24px "Poppins-Regular"';
    const formattedDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillText(`Issued on: ${formattedDate}`, 600, 550);
    
    // Add verification text
    ctx.font = '16px "Poppins-Regular"';
    ctx.fillText(`Verification ID: ${certificate.publicHash || 'Pending'}`, 600, 700);
    ctx.fillText(`Verify at: chainverse.io/certificate/verify/${certificate.publicHash || 'Pending'}`, 600, 730);
    
    // Return buffer
    return canvas.toBuffer('image/png');
  } catch (error) {
    logger.error(`Error generating certificate image: ${error.message}`);
    throw error;
  }
};

