const express = require("express");
const router = express.Router();
const {
  getAllTutors,
  getTutorById,
} = require("../controllers/tutorController");

router.get("/tutors", getAllTutors);
router.get("/tutors/:id", getTutorById);

module.exports = router;
