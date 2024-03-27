// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const { errorHandler } = require("./middlewares/errorHandler");
require("dotenv").config(); // Load environment variables

const app = express(); // Initialize Express app

// Enable Helmet for security headers
app.use(helmet());

// Rate Limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// CORS middleware - update the origin based on your frontend deployment
app.use(
  cors({
    origin: "https://yourfrontenddomain.com", // Set your frontend domain here
  })
);

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/newsdb";
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define routes
app.use("/users", userRoutes); // User routes
app.use("/articles", articleRoutes); // Article routes

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Centralized Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000; // Set the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the Express app
