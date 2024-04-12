const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");
require("dotenv").config();

const app = express();

// Security middleware to set various HTTP headers
app.use(helmet());

// CORS setup for different environments
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://articlelist.ignorelist.com"
      : "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Built-in middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger middleware
app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.url}`);
  next();
});

// Routes
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// MongoDB connection
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
  });

// Error handling middleware
app.use(errorHandler);

module.exports = app;
