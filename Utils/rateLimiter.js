const rateLimit = require("express-rate-limit");

// Create a rate limiter middleware
const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 10000,
  max: 1000,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiRateLimiter;
