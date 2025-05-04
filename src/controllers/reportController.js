const Tutor = require("../models/Tutor");
const Course = require("../models/Course");
const Discussion = require("../models/Discussion");
const Material = require("../models/Material");
const Certificate = require("../models/Certificate");
const Student = require("../models/Student");

exports.getTutorReport = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const tutor = await Tutor.findById(tutorId).populate("assignedCourses");
    if (!tutor) return res.status(404).json({ message: "Tutor not found" });

    const students = await Student.find({ enrolledCourses: { $in: tutor.assignedCourses } });

    const discussions = await Discussion.find({ tutor: tutorId });
    const materials = await Material.find({ tutor: tutorId });
    const certificates = await Certificate.find({ issuedBy: tutorId });

    let completedCourses = await Course.find({ tutor: tutorId, completedStudents: { $exists: true, $not: { $size: 0 } } });

    res.json({
      tutor: tutor.name,
      assignedCourses: tutor.assignedCourses.length,
      studentsTaught: students.length,
      discussionsHandled: discussions.length,
      uploadedMaterials: materials.length,
      completedCourses: completedCourses.length,
      certificatesIssued: certificates.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTutorsSummary = async (req, res) => {
  try {
    const tutors = await Tutor.find();

    const summaries = await Promise.all(tutors.map(async (tutor) => {
      const students = await Student.find({ enrolledCourses: { $in: tutor.assignedCourses } });
      const discussions = await Discussion.find({ tutor: tutor._id });

      return {
        tutor: tutor.name,
        courses: tutor.assignedCourses.length,
        studentsTaught: students.length,
        discussions: discussions.length
      };
    }));

    res.json(summaries);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
