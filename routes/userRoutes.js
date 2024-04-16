const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); // Import auth middleware
const usersController = require("../controllers/usersController");

router.get("/me", auth, usersController.getUserProfile);

module.exports = router;
