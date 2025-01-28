const express = require("express");
const router = express.Router();
const { getAssignedStudents, getStudentDetails } = require("../controllers/studentController");

// Endpoint to get the list of students assigned to Dr. John
router.get("/assigned", getAssignedStudents);

// Endpoint to get details of a specific student by ID
router.get("/details/:studentId", getStudentDetails);

module.exports = router;
