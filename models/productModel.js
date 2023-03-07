const mongoose = require("mongoose");
const Option = require("./optionModel");

const productSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  productName: String,
  options: {
    type: mongoose.Schema.ObjectId,
    ref: Option,
  },
  tl_sales: {
    KT_8: Number,
    KT_14: Number,
    KT_18: Number,
  },
  comission: Number,
  photos: [
    {
      type: String,
    },
  ],
  colors: {
    white: String,
    red: String,
    yellow: String,
  },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
