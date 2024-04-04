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
  console.log("Received article data:", req.body);
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
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }
    if (article.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    await article.remove();
    res.json({ msg: "Article removed" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getArticlesByUser,
  createArticle,
  deleteArticle,
};
