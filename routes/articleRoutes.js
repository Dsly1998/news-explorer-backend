const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const articlesController = require("../controllers/articlesController");
const {
  validateArticleCreation,
  validateArticleDeletion,
} = require("../Utils/validator");

// Get all articles saved by the user
router.get("/", auth, articlesController.getArticlesByUser);

// Create a new article
router.post(
  "/",
  auth,
  validateArticleCreation,
  articlesController.createArticle,
);

// Delete an article by its ID
router.delete(
  "/:articleId",
  auth,
  validateArticleDeletion,
  articlesController.deleteArticle,
);

// Additional article-related routes can be added here

module.exports = router;
