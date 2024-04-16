const Article = require("../models/Article");
const NotFoundError = require("../middlewares/errors/NotFoundError");
const ForbiddenError = require("../middlewares/errors/ForbiddenError");
const ServerError = require("../middlewares/errors/ServerError");

const getArticlesByUser = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user.id });
    res.json(articles);
  } catch (err) {
    next(new ServerError("Error fetching articles"));
  }
};

const createArticle = async (req, res, next) => {
  try {
    const newArticle = new Article({ ...req.body, owner: req.user.id });
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (err) {
    next(new ServerError("Error creating article"));
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId).populate(
      "owner",
    );
    if (!article) {
      throw new NotFoundError("Article not found");
    }

    if (!article.owner || article.owner._id.toString() !== req.user.id) {
      throw new ForbiddenError("User not authorized");
    }

    await Article.findByIdAndDelete(req.params.articleId);
    res.json({ msg: "Article removed" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getArticlesByUser,
  createArticle,
  deleteArticle,
};
