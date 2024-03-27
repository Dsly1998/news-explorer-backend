// userRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const usersController = require("../controllers/usersController");
const { createUserValidator } = require("../Utils/validator"); // Ensure consistent casing

// Protected route to get information about the logged-in user
router.get("/me", auth, usersController.getUserProfile); // Renamed the controller function

// Unprotected routes (like signup and signin)
router.post("/signup", createUserValidator, usersController.registerUser); // Renamed the controller function
router.post("/signin", usersController.loginUser);

module.exports = router;
