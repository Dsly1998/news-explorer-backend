const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate"); // Celebrate error handler
const logger = require("./middlewares/logger");
const apiRateLimiter = require("./Utils/rateLimiter");
const errorHandler = require("./middlewares/error-handler");
const { mongoUri, port } = require("./Utils/config");

require("dotenv").config(); // This will load .env file if it exists

const app = express();

// Security middleware to set various HTTP headers
app.use(helmet());
app.use(cors());

// Built-in middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware applied to all API requests
app.use("/api", apiRateLimiter);

// Simple request logger middleware
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.url}`);
  next();
});

// Routes
const routes = require("./routes/index");

app.use("/", routes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Catch 404 and directly return a 404 response
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource was not found",
  });
});

// Celebrate error handler to catch and format validation errors
app.use(errors());

// General error handling middleware
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error(`Database Connection Error: ${err.message}`);
    process.exit(1); // Exit the process if unable to connect to the database
  });

module.exports = app;
