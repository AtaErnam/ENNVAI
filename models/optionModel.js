const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

optionSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
  });

  next();
});

const Option = mongoose.model("option", optionSchema);

module.exports = Option;
