const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const port = 3001;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'new_password',
  database: 'student_form'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('MySQL Connected!');
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Database Test Query Error:', err);
    } else {
      console.log('Database Test Query Success:', results[0].solution);
    }
  });
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JavaScript, Images) from the public folder
app.use(express.static(path.join('C:', 'Users', 'rajpu', 'student-form-backen', 'site1', 'frontend', 'public')));



// Multer Setup for File Upload
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Serve HTML Form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public', 'student.html'));
});

// Handle Form Submission
app.post('/submit-form', upload.single('photo'), (req, res) => {
  try {
    console.log('Form Data:', req.body);
    console.log('Uploaded File:', req.file);

    // Validate file upload
    if (!req.file) {
      console.error('File Upload Error: No file uploaded');
      return res.status(400).send('File upload is required');
    }

    // Validate required fields
    const requiredFields = ['name', 'roll_no', 'gender', 'email', 'contact'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        console.error(`Validation Error: Missing required field ${field}`);
        return res.status(400).send(`Field ${field} is required`);
      }
    }

    const {
      date, name, roll_no, gender, permanent_address,
      postal_address, contact, email, father_name,
      father_occupation, father_contact, mother_name,
      mother_occupation, mother_contact, emergency_person,
      relationship, emergency_contact, awards, internships,
      exam_score, co_curricular, extra_curricular,
      hobbies, placement, higher_studies, suggestions
    } = req.body;

    const photoPath = req.file.path;

    const sql = `
      INSERT INTO students (
        photo, date, name, roll_no, gender, permanent_address,
        postal_address, contact, email, father_name, father_occupation,
        father_contact, mother_name, mother_occupation, mother_contact,
        emergency_person, relationship, emergency_contact, awards,
        internships, exam_score, co_curricular, extra_curricular,
        hobbies, placement, higher_studies, suggestions
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      photoPath, date, name, roll_no, gender, permanent_address,
      postal_address, contact, email, father_name, father_occupation,
      father_contact, mother_name, mother_occupation, mother_contact,
      emergency_person, relationship, emergency_contact, awards,
      internships, exam_score, co_curricular, extra_curricular,
      hobbies, placement, higher_studies, suggestions
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).send('Failed to submit form');
      }
      console.log('Form Submitted Successfully, DB Result:', result);
      res.send('Form submitted successfully!');
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).send('An unexpected error occurred');
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
