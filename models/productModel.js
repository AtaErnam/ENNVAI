const mongoose = require("mongoose");
const Option = require("./optionModel");

const productSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    productName: String,
    categoryName: {
      type: String,
    },
    options: {
      type: mongoose.Schema.ObjectId,
      ref: Option,
    },
    usd_sales: {
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
categorySchema.virtual("options", {
  ref: "Option",
  foreignField: "product",
  localField: "_id",
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "categoryName",
  });

  next();
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
