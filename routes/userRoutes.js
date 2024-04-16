const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth"); // Import auth middleware
const usersController = require("../controllers/usersController");
const { createUserValidator } = require("../Utils/validator");

// Protect the routes using the auth middleware

// Get information about the logged-in user
router.get("/me", auth, usersController.getUserProfile);

// Unprotected routes (like signup and signin)
router.post("/signup", createUserValidator, usersController.registerUser);
router.post("/signin", usersController.loginUser);

module.exports = router;
