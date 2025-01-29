const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Multer Setup for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Serve Student Form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

// Handle Form Submission
app.post('/submit', upload.single('photo'), (req, res) => {
    const {
        name, roll_no, gender, permanent_address, postal_address, contact,
        email, father_name, father_occupation, father_contact, mother_name,
        mother_occupation, mother_contact, emergency_person, relationship,
        emergency_contact
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    const sql = `
        INSERT INTO mentees (
            name, roll_no, gender, permanent_address, postal_address, contact,
            email, father_name, father_occupation, father_contact, mother_name,
            mother_occupation, mother_contact, emergency_person, relationship,
            emergency_contact
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        name, roll_no, gender, permanent_address, postal_address, contact,
        email, father_name, father_occupation, father_contact, mother_name,
        mother_occupation, mother_contact, emergency_person, relationship,
        emergency_contact
    ], (err, result) => {
        if (err) {
            console.error('Database Insert Error:', err);
            return res.status(500).send('Server Error');
        }
        res.send('Form Submitted Successfully!');
    });
});

// Start Server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
