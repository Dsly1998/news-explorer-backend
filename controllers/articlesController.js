const Article = require("../models/Article");
const NotFoundError = require("../middlewares/errors/NotFoundError");
const ForbiddenError = require("../middlewares/errors/ForbiddenError");
const logger = require("../middlewares/logger");

exports.getArticlesByUser = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user.id });
    return res.json(articles);
  } catch (err) {
    logger.error(
      `Error fetching articles by user ${req.user.id}: ${err.message}`,
    );
    return next(err);
  }
};

exports.createArticle = async (req, res, next) => {
  try {
    const newArticle = new Article({ ...req.body, owner: req.user.id });
    const article = await newArticle.save();
    return res.status(201).json(article);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        error: "Validation Error",
        message: err.message,
      });
    }
    logger.error(
      `Error creating article for user ${req.user.id}: ${err.message}`,
    );
    return next(err);
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
    return res.json({ msg: "Article removed" });
  } catch (err) {
    logger.error(
      `Error deleting article ${req.params.articleId}: ${err.message}`,
    );
    return next(err);
  }
};
