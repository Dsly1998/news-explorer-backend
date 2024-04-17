const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth"); // Import auth middleware
const articlesController = require("../controllers/articlesController");


// Protect the routes using the auth middleware

// Get all articles saved by the user
router.get("/", auth, articlesController.getArticlesByUser);

// Create a new article
router.post("/", auth, articlesController.createArticle);

// Delete an article by its ID
router.delete("/:articleId", auth, articlesController.deleteArticle);

// Additional article-related routes can be added here

module.exports = router;
