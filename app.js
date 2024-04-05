// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
// const { errorHandler } = require("./middlewares/errorHandler");
require("dotenv").config(); // Load environment variables

const app = express(); // Initialize Express app

// Enable Helmet for security headers
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000", // Replace this with your frontend domain
  })
);

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/news_db";
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Define routes
app.use("/users", userRoutes); // User routes
app.use("/articles", articleRoutes); // Article routes

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT || 3001; // Set the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the Express app
