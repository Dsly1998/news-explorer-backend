// controllers/articlesController.js

const Article = require("../models/Article"); // Assuming you have an Article model

const getArticlesByUser = async (req, res) => {
  try {
    const articles = await Article.find({ owner: req.user.id });
    res.json(articles);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

const createArticle = async (req, res) => {
  try {
    const newArticle = new Article({ ...req.body, owner: req.user.id });
    const article = await newArticle.save();
    res.status(201).json(article);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId).populate(
      "owner"
    );
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    if (!article.owner || article.owner._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Using findByIdAndDelete
    await Article.findByIdAndDelete(req.params.articleId);

    res.json({ msg: "Article removed" });
  } catch (err) {
    console.error("Error in deleteArticle:", err);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getArticlesByUser,
  createArticle,
  deleteArticle,
};
