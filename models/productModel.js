const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  productName: String,
  options: String,
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
