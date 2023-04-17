const mongoose = require("mongoose");
const slugify = require("slugify");
const Product = require("./productModel");

const categorySchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    categoryName: String,
    /* productsInside: [
      {
        type: mongoose.Schema.ObjectId,
        ref: Product,
      },
    ], */
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual Populate
/* categorySchema.virtual("products", {
  ref: "Product",
  foreignField: "category",
  localField: "_id",
}); */

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.categoryName, { lower: true });
  next();
});

// QUERY MIDDLEWARE
// categorySchema.pre('find', function(next) {
categorySchema.pre(/^find/, function (next) {
  this.find({ secretCategory: { $ne: true } });

  this.start = Date.now();
  next();
});

/* categorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "productInside",
  });
  next();
}); */

categorySchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
