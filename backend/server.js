const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const clothesRoutes = require('./routes/clothes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
const corsOptions = {
    origin: "https://mylittlecloset.netlify.app", // Your Netlify domain
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use(cors(corsOptions));
app.use('/api/clothes', clothesRoutes);

// MongoDB connection
const connectDB = require('./config/db');
connectDB();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));