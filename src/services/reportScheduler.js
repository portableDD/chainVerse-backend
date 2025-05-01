const cron = require("node-cron");
const CourseReport = require("../models/courseReport");
const Course = require("../models/course");
const { calculateMetrics } = require("../controllers/courseReportController");

// Update all course reports every hour
const updateAllReports = async () => {
  try {
    const courses = await Course.find();
    for (const course of courses) {
      const metrics = await calculateMetrics(course._id);
      await CourseReport.findOneAndUpdate(
        { courseId: course._id },
        {
          ...metrics,
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }
    console.log("Course reports updated successfully");
  } catch (error) {
    console.error("Error updating course reports:", error);
  }
};

// Initialize scheduler
const initScheduler = () => {
  // Run every hour
  cron.schedule("0 * * * *", updateAllReports);

  // Also run immediately on startup
  updateAllReports();
};

module.exports = {
  initScheduler,
};
