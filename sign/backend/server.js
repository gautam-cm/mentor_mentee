const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'sign',
    password: 'new_password',
    database: 'user_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve sign.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/sign.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = 'SELECT * FROM users WHERE username = ? AND role = ?';
    db.query(query, [username, role], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return res.status(500).json({ message: 'Error comparing password' });
                if (isMatch) {
                    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
                        expiresIn: '1h',
                    });
                    return res.json({ token });
                } else {
                    return res.status(401).json({ message: 'Invalid credentials' });
                }
            });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Handle signup
app.post('/signup', (req, res) => {
    const { username, password, name, email, phone, role } = req.body;
    if (!username || !password || !name || !email || !phone || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).json({ message: 'Error hashing password' });
        const query = 'INSERT INTO users (username, password, name, email, phone, role) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(query, [username, hashedPassword, name, email, phone, role], (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            return res.json({ message: 'User registered successfully' });
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
