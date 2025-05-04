const Tutor = require("../models/tutors");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/email");
const { doHash, doCompare, doHmac, compareHmac } = require("../utils/hashing");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendMail");
const LoginLog = require("../models/loginsLog");

const VERIFICATION_CODE_EXPIRY = 5 * 60 * 1000; // 5m
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000; // 15m
const REFRESH_TOKEN_EXPIRY = 1 * 24 * 60 * 60 * 1000; // 1d
const SALT_VALUE = 12;


// Create a new tutor account
exports.createTutor = async (req, res) => {
  const { fullName, email, password, web3Expertise, experience } = req.body;
  
  try {
    // Check if tutor already exists
    const existingTutor = await Tutor.findOne({ email });
    if (existingTutor) {
      return res.status(400).json({
        status: "fail",
        message: "Tutor with this email already exists",
      });
    }
    
    // Create new tutor
    const hashedPassword = await doHash(password, SALT_VALUE);
    const newTutor = new Tutor({
      fullName,
      email,
      password: hashedPassword,
      web3Expertise,
      experience
    });
    
    // Generate verification code
    const verificationCode = Math.floor(Math.random() * 1e6).toString().padStart(6, '0');
    const info = await sendEmail(email, verificationCode, "Account verification");
    
    if (!info) {
      return res.status(500).json({
        status: "error",
        message: "Tutor registered successfully, failed to send verification code to email",
      });
    }
    
    const hashedVerificationCode = doHmac(verificationCode, process.env.CRYPTO_KEY);
    newTutor.verificationCode = hashedVerificationCode;
    newTutor.verificationCodeValidation = Date.now();
    
    await newTutor.save();
    
    return res.status(201).json({
      status: "success",
      message: "Tutor registered successfully, please verify your email",
    });
  } catch (error) {
    const statusCode = error.details ? 400 : 500;
    const message = error.details ? error.details[0].message : "Something went wrong, we are working on it";
    return res.status(statusCode).json({ status: "fail", message });
  }
};

// Verify tutor email
exports.verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const tutor = await Tutor.findOne({ email }).select("+verificationCode +verificationCodeValidation");
    
    if (!tutor) {
      return res.status(404).json({
        status: "fail",
        message: "Tutor not found",
      });
    }
    
    if (tutor.verified) {
      return res.status(400).json({
        status: "fail",
        message: "Email already verified",
      });
    }
    
    if (!tutor.verificationCode || !tutor.verificationCodeValidation) {
      return res.status(400).json({
        status: "fail",
        message: "Verification code not found or expired",
      });
    }
    
    const isCodeValid = compareHmac(code, process.env.CRYPTO_KEY, tutor.verificationCode);
    const isCodeExpired = Date.now() - new Date(tutor.verificationCodeValidation) > VERIFICATION_CODE_EXPIRY;
    
    if (!isCodeValid || isCodeExpired) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or expired verification code",
      });
    }
    
    tutor.verified = true;
    tutor.verificationCode = undefined;
    tutor.verificationCodeValidation = undefined;
    
    await tutor.save();
    
    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, we are working on it",
    });
  }
};

// Tutor login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  
  try {
    const tutor = await Tutor.findOne({ email }).select("+password");
    
    if (!tutor) {
      return res.status(401).json({
        status: "fail",
        message: "Tutor not found",
      });
    }
    
    const correctPassword = await doCompare(password, tutor.password);
    if (!correctPassword) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid password",
      });
    }
    
    if (!tutor.verified) {
      return res.status(403).json({
        status: "fail",
        message: "Account not verified",
      });
    }
    
    const accessToken = jwt.sign({ sub: tutor._id, role: tutor.role }, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "15m",
    });
    
    const refreshToken = jwt.sign({ sub: tutor._id, role: tutor.role }, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "24h",
    });
    
    const hashedRefreshToken = doHmac(refreshToken, process.env.CRYPTO_KEY);
    tutor.refreshToken = hashedRefreshToken;
    await tutor.save();
    
    // Log login activity
    await LoginLog.create({
      userId: tutor._id,
      userType: 'tutor',
      ipAddress,
      userAgent,
      loginTime: new Date()
    });
    
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        tutor: {
          id: tutor._id,
          fullName: tutor.fullName,
          email: tutor.email,
          role: tutor.role
        }
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, we are working on it",
    });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const tutor = await Tutor.findOne({ email });
    
    if (!tutor) {
      return res.status(404).json({
        status: "fail",
        message: "Tutor not found",
      });
    }
    
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const hashedResetToken = doHmac(resetToken, process.env.CRYPTO_KEY);
    
    tutor.resetPasswordToken = hashedResetToken;
    tutor.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    
    await tutor.save();
    
    // Send reset password email
    const resetURL = `${process.env.FRONTEND_URL}/tutor/reset-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`;
    
    await sendEmail(tutor.email, message, "Password Reset");
    
    return res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, we are working on it",
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  
  try {
    const hashedToken = doHmac(token, process.env.CRYPTO_KEY);
    
    const tutor = await Tutor.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!tutor) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }
    
    const hashedPassword = await doHash(password, SALT_VALUE);
    tutor.password = hashedPassword;
    tutor.resetPasswordToken = undefined;
    tutor.resetPasswordExpires = undefined;
    
    await tutor.save();
    
    return res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, we are working on it",
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    if (!refreshToken) {
      return res.status(400).json({
        status: "fail",
        message: "Refresh token is required",
      });
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const hashedRefreshToken = doHmac(refreshToken, process.env.CRYPTO_KEY);
    
    const tutor = await Tutor.findOne({ _id: decoded.sub, refreshToken: hashedRefreshToken });
    
    if (!tutor) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid refresh token",
      });
    }
    
    const accessToken = jwt.sign({ sub: tutor._id, role: tutor.role }, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: "15m",
    });
    
    const newRefreshToken = jwt.sign({ sub: tutor._id, role: tutor.role }, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: "24h",
    });
    
    const hashedNewRefreshToken = doHmac(newRefreshToken, process.env.CRYPTO_KEY);
    tutor.refreshToken = hashedNewRefreshToken;
    await tutor.save();
    
    return res.status(200).json({
      status: "success",
      message: "Token refreshed successfully",
      data: {
        accessToken,
        refreshToken: newRefreshToken
      },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: "fail",
        message: "Invalid or expired refresh token",
      });
    }
    
    return res.status(500).json({
      status: "error",
      message: "Something went wrong, we are working on it",
    });
  }
};

// Submit Tutor Application & Course Proposal
exports.submitTutorApplication = async (req, res) => {
  try {
    const newApplication = new Tutor(req.body);

    await newApplication.save();
    res.status(201).json({ 
      message: "Application submitted successfully",
      data: newApplication
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get all tutors with pagination
exports.getAllTutors = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tutors = await Tutor.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      message: "Tutors retrieved successfully",
      data: tutors
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get tutor by ID
exports.getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    res.status(200).json({
      message: "Tutor retrieved successfully",
      data: tutor
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Approve/Reject Tutor Application
exports.approveRejectApplication = async (req, res) => {
  const { status, adminComment } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({
      message: 'Status must be either "Approved" or "Rejected"'
    });
  }

  try {
    const application = await Tutor.findByIdAndUpdate(
      req.params.id, 
      { status, adminComment }, 
      { new: true });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    // Send email notification based on status
    if (status === 'Approved') {
      await sendApprovalEmail(application.email, application.firstName, adminComment);
    } else {
      await sendRejectionEmail(application.email, application.firstName, adminComment);
    }

    res.status(200).json({
      message: "Application status updated successfully",
      data: application
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
