const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3003;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files for the frontend
app.use(express.static(path.join(__dirname, "..", "frontend"))); // Ensure this points to the correct directory

// Proxy requests to site1 and site2
app.use('/site1', createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true }));
app.use('/site2', createProxyMiddleware({ target: 'http://localhost:3002', changeOrigin: true }));

// Route for the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "mentee.html")); // Updated path
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ error: "Page not found" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Site3 running at http://localhost:${PORT}`);
});