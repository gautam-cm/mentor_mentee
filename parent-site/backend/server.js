const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3004;

// MySQL database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "123456", // Update this with your actual password
    database: "college",
});

// Test the database connection
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
    } else {
        console.log("Connected to the MySQL database.");
    }
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware for JSON parsing
app.use(bodyParser.json());

// API endpoint to assign a student
app.post("/assignStudent", (req, res) => {
    const { studentName, rollNo, email, teacher } = req.body;

    const query =
        "INSERT INTO student_assignments (student_name, roll_no, email, teacher) VALUES (?, ?, ?, ?)";
    db.query(query, [studentName, rollNo, email, teacher], (err, result) => {
        if (err) {
            console.error(err);
            res.json({ success: false, message: "Failed to assign student." });
        } else {
            res.json({ success: true, message: "Student assigned successfully." });
        }
    });
});

// API endpoint to fetch student data
app.get("/getStudents", (req, res) => {
    const query = "SELECT * FROM student_assignments";  // SQL query to get all students

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching student data:", err.message);
            return res.json({ success: false, message: "Failed to load student data" });
        } else {
            return res.json({ success: true, students: results });  // Send back the data
        }
    });
});

// Route to serve the admin.html page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/admin.html")); // Updated to a relative path
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
