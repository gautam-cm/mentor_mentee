const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const studentRoutes = require("./routes/students");

const app = express();

// Middleware for parsing JSON
app.use(bodyParser.json());

// Serve static files (e.g., teacher.html)
app.use(express.static(path.join(__dirname, "public")));

// API routes for student-related functionality
app.use("/students", studentRoutes);

// Default route to serve teacher.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "teacher.html"));
});

// Start the server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
