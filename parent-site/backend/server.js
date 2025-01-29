const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3004;

// Load environment variables from .env file
require("dotenv").config();

// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "admin",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_NAME || "college",
});

// Test the database connection
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err.message);
        process.exit(1); // Exit if the database connection fails
    } else {
        console.log("Connected to the MySQL database.");
    }
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Route to serve the admin.html page (if needed explicitly)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

// Middleware for JSON parsing
app.use(bodyParser.json());

// API endpoint to assign a student
app.post("/assignStudent", (req, res) => {
    const { studentName, rollNo, email, teacher } = req.body;

    const query =
        "INSERT INTO student_assignments (student_name, roll_no, email, teacher) VALUES (?, ?, ?, ?)";
    db.query(query, [studentName, rollNo, email, teacher], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err.message);
            res.json({ success: false, message: "Failed to assign student." });
        } else {
            res.json({ success: true, message: "Student assigned successfully." });
        }
    });
});

// API endpoint to fetch student data
app.get("/getStudents", (req, res) => {
    const teacher = req.query.teacher; // Optional query parameter
    let query = "SELECT * FROM student_assignments";

    if (teacher) {
        query += " WHERE teacher = ?";
    }

    db.query(query, teacher ? [teacher] : [], (err, results) => {
        if (err) {
            console.error("Error fetching student data:", err.message);
            return res.json({ success: false, message: "Failed to load student data" });
        } else {
            return res.json({ success: true, students: results });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
