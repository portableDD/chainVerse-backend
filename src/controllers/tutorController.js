const Tutor = require("../models/tutors");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/email");


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
