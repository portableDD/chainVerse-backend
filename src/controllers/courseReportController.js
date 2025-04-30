const CourseReport = require("../models/courseReport");
const Course = require("../models/course");
const { isAdmin } = require("../middlewares/auth");

// Helper function to calculate metrics
const calculateMetrics = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const totalEnrollments = course.enrollments.length;
  const completedEnrollments = course.enrollments.filter(
    (e) => e.status === "COMPLETED"
  ).length;
  const activeEnrollments = course.enrollments.filter(
    (e) => e.status === "ACTIVE"
  ).length;

  // Calculate completion rate
  const completionRate =
    totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

  // Calculate drop-off rate
  const dropOffRate =
    totalEnrollments > 0
      ? ((totalEnrollments - completedEnrollments - activeEnrollments) /
          totalEnrollments) *
        100
      : 0;

  return {
    totalEnrollments,
    completionRate,
    dropOffRate,
    activeLearners: activeEnrollments,
  };
};

// Get report for a single course
exports.getCourseReport = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized access",
      });
    }

    const { courseId } = req.params;

    // Get or create report
    let report = await CourseReport.findOne({ courseId });

    if (!report) {
      // Create new report if none exists
      const metrics = await calculateMetrics(courseId);
      report = new CourseReport({
        courseId,
        ...metrics,
      });
      await report.save();
    }

    res.status(200).json({
      status: "success",
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Get reports for all courses
exports.getAllCourseReports = async (req, res) => {
  try {
    if (!isAdmin(req.user)) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized access",
      });
    }

    const reports = await CourseReport.find()
      .populate("courseId", "title description")
      .sort({ lastUpdated: -1 });

    res.status(200).json({
      status: "success",
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Update engagement metrics
exports.updateEngagementMetrics = async (courseId, metrics) => {
  try {
    const report = await CourseReport.findOne({ courseId });
    if (report) {
      report.engagementMetrics = {
        ...report.engagementMetrics,
        ...metrics,
      };
      report.lastUpdated = new Date();
      await report.save();
    }
  } catch (error) {
    console.error("Error updating engagement metrics:", error);
  }
};
