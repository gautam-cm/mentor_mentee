const mysql = require("mysql");

// College database
const collegeDB = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "123456",
    database: "college",
});

// Student details database
const studentDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "new_password",
    database: "student_form",
});

// Leave applications database
const leaveDB = mysql.createConnection({
    host: "localhost",
    user: "leavel",
    password: "new_password",
    database: "leave_applications",
});

// Connect to all databases
collegeDB.connect((err) => {
    if (err) console.error("College DB connection error:", err.message);
    else console.log("Connected to College DB");
});

studentDB.connect((err) => {
    if (err) console.error("Student DB connection error:", err.message);
    else console.log("Connected to Student DB");
});

leaveDB.connect((err) => {
    if (err) console.error("Leave DB connection error:", err.message);
    else console.log("Connected to Leave DB");
});

module.exports = { collegeDB, studentDB, leaveDB };
