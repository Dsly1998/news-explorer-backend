const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const logger = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");
require("dotenv").config();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3001",
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.url}`);
  next();
});

app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/news_db";
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB Connected");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => logger.error(`Database Connection Error: ${err.message}`));

// Apply error logging and handling middleware
app.use(errorHandler);

module.exports = app;
