// server.js
require('dotenv').config(); // Load environment variables
const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3005; // Use port from .env or default to 3005

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "sign",
  password: process.env.DB_PASSWORD || "new_password", // Replace with your MySQL password
  database: process.env.DB_NAME || "user_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to the database!");
});

// Serve static files from the "frontend" folder
app.use(express.static(path.join(__dirname, "frontend")));

// Route to serve the sign.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "sign.html"));
});

// User sign-up
app.post('/signup', (req, res) => {
  const { username, name, email, phone, role, password } = req.body;

  if (!username || !name || !email || !phone || !role || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const sql = 'INSERT INTO users (username, name, email, phone, role, password) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(sql, [username, name, email, phone, role, hashedPassword], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving user' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

// User login
app.post('/login', (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'SELECT * FROM users WHERE username = ? AND role = ?';
  
  db.query(sql, [username, role], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET, // Now using JWT_SECRET from .env
      { expiresIn: '1h' }
    );

    res.json({ token });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
