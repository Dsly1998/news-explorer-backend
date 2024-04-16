const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { createUserValidator } = require("../utils/validator"); // Check the path for case sensitivity

// Unprotected routes
router.post("/signup", createUserValidator, usersController.registerUser);
router.post("/signin", usersController.loginUser);

module.exports = router;
