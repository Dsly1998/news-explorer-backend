const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./middlewares/logger");
const apiRateLimiter = require("./Utils/rateLimiter");
const errorHandler = require("./middlewares/error-handler");
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.url}`);
  next();
});

app.use("/api", apiRateLimiter);

// Import centralized routes from the index.js in the routes folder
const routes = require("./routes/index");

// Use centralized routes with '/api' prefix
app.use("/api", routes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Handle not found routes for API
app.use("/api/*", (req, res, next) => {
  res.status(404).send("API resource not found.");
});

// Handle not found routes for general
app.use("*", (req, res, next) => {
  res.status(404).send("The requested resource was not found.");
});

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/news_db";
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error(`Database Connection Error: ${err.message}`);
    process.exit(1); // Exit the process with an error code
  });

app.use(errorHandler); // Ensure this is the last middleware used

module.exports = app;
