const express = require("express");
const router = express.Router();
const { validateArticle } = require("../utils/validator");
const articlesController = require("../controllers/articlesController");
const auth = require("../middlewares/auth");

router.get("/", auth, articlesController.getArticlesByUser);
router.post("/", auth, validateArticle, articlesController.createArticle);
router.delete("/:articleId", auth, validateArticle, articlesController.deleteArticle);

module.exports = router;
