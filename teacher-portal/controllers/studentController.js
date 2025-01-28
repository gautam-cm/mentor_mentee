const mysql = require("mysql");

// Database connection for the 'student_form' database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "new_password",
    database: "student_form",
});

// Fetch students assigned to Dr. John
const getAssignedStudents = (req, res) => {
    const query = `
        SELECT id, name 
        FROM students 
        WHERE assigned_teacher = 'Dr. John'
    `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        res.json(results);
    });
};

// Fetch details of a specific student by ID
const getStudentDetails = (req, res) => {
    const { studentId } = req.params;
    const query = `
        SELECT students.*, leaves.*
        FROM students
        LEFT JOIN leaves_applications AS leaves ON students.id = leaves.student_id
        WHERE students.id = ?
    `;
    db.query(query, [studentId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database query failed" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(results[0]);
    });
};

module.exports = { getAssignedStudents, getStudentDetails };
