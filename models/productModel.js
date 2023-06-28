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
    price: Number,
    description: String,
    usd_sales: {
      KT_8: Number,
      KT_14: Number,
      KT_18: Number,
    },
    comission: Number,
    imageCover: {
      type: String,
      required: [true, "A product must have a cover image"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    option: {
      GR: {
        type: Number,
      },
      WAX_GR: {
        type: Number,
      },
      setting: {
        type: String,
      },
      productStyle: {
        type: String,
      },
      quantity_of_stones: {
        type: Number,
      },
      stones: [
        {
          stone_type: {
            type: String,
            enum: ["middle", "corner", "colorful"],
            default: "middle",
          },
          carat: Number,
          amount: Number,
          stone: String,
          color: String,
          clarity: String,
          shape: String,
        },
      ],
      silver_setting: {
        type: Number,
      },
      gold_type: [
        {
          type: String,
          enum: ["White", "Rose", "Normal"],
        },
      ],
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

const Product = mongoose.model("product", productSchema);

module.exports = Product;
