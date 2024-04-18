const Article = require("../models/Article");
const NotFoundError = require("../middlewares/errors/NotFoundError");
const ForbiddenError = require("../middlewares/errors/ForbiddenError");
const logger = require("../middlewares/logger"); // Ensure you import your logger

exports.getArticlesByUser = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user.id });
    res.json(articles);
  } catch (err) {
    logger.error(
      `Error fetching articles by user ${req.user.id}: ${err.message}`,
    );
    next(err);
  }
};

exports.createArticle = async (req, res, next) => {
  try {
    const newArticle = new Article({ ...req.body, owner: req.user.id });
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (err) {
    logger.error(
      `Error creating article for user ${req.user.id}: ${err.message}`,
    );
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId).populate(
      "owner",
    );
    if (!article) {
      throw new NotFoundError("Article not found");
    }
    if (!article.owner || article.owner._id.toString() !== req.user.id) {
      throw new ForbiddenError("User not authorized to delete this article");
    }
    await Article.findByIdAndDelete(req.params.articleId);
    res.json({ msg: "Article removed" });
  } catch (err) {
    logger.error(
      `Error deleting article ${req.params.articleId}: ${err.message}`,
    );
    next(err);
  }
};
