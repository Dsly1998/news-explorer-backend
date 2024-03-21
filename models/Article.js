const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  keyword: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
  source: { type: String, required: true },
  link: {
    type: String,
    required: true,
    match: [/^http[s]?:\/\/.*/, "Please fill a valid URL"],
  },
  image: {
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
