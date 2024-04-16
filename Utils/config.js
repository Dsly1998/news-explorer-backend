// config/config.js

require("dotenv").config();

module.exports = {
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/news_db",
  jwtSecret: process.env.JWT_SECRET || "development_secret",
};
