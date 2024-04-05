const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  searchKeyword: { type: String, required: true },
  content: { type: String, required: true },
  description: { type: String, required: true },
  publishedAt: { type: String, required: true },
  source: {
    id: { type: String, required: false },
    name: { type: String, required: true },
  },
  url: {
    type: String,
    required: true,
    match: [/^http[s]?:\/\/.*/, "Please fill a valid URL"],
  },
  urlToImage: {
    type: String,
    required: true,
    match: [/^http[s]?:\/\/.*/, "Please fill a valid URL"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    select: false,
  },
});

module.exports = mongoose.model("Article", articleSchema);
