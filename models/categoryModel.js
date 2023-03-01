const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  categoryName: String,
  productType: String,
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
