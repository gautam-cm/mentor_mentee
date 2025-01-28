const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3002;

// Middleware for parsing JSON and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (including images) from the frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve the leave.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'leave.html'));
});

// Static directory for serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'leavel',
    password: 'new_password',
    database: 'leave_applications',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads'),
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// Handle form submission
app.post('/submit', upload.single('pdfFile'), (req, res) => {
    const { reason, fromDate, toDate } = req.body;
    const pdfFilePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!reason || !fromDate || !toDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = 'INSERT INTO applications (reason, from_date, to_date, pdf_file_path) VALUES (?, ?, ?, ?)';
    db.query(sql, [reason, fromDate, toDate, pdfFilePath], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'Leave application submitted successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
