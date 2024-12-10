const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const clothesRoutes = require('./routes/clothes');
const fs = require("fs");
const path = require("path");

// Load environment variables
dotenv.config();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log("Created uploads directory");
}

const app = express();
const PORT = process.env.PORT || 5000;

// Debugging middleware to log requests
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(express.json());
const corsOptions = {
    origin: "*", // Temporarily allow all origins for debugging
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/clothes', clothesRoutes);

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));