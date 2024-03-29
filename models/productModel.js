const mongoose = require("mongoose");
const Category = require("./categoryModel");
const Option = require("./optionModel");

const productSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    productName: String,
    usd_sales: {
      KT_8: Number,
      KT_14: Number,
      KT_18: Number,
    },
    comission: Number,
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Populate

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "categoryName",
  });

  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
