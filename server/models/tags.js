const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, maxLength: 100 },
});

tagSchema.virtual("url").get(function () {
  return `/posts/tag/${this._id}`;
});

module.exports = mongoose.model("Tag", tagSchema);
