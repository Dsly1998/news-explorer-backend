// index.js in the routes directory

const express = require("express");

const router = express.Router();

// Import individual route modules
const userRoutes = require("./userRoutes");
const articleRoutes = require("./articleRoutes");

// Setup route endpoints
router.use("/", userRoutes); // Assuming user routes include both protected and public routes
router.use("/articles", articleRoutes); // Protected article routes

module.exports = router;
