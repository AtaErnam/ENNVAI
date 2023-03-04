const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  optionName: String,
  code: {
    kod1: String,
    kod2: String,
  },
  name: {
    type: String,
  },
  GR: Number,
  middle: {
    carat: Number,
    amount: Number,
    stone: String,
    purity: String,
    clarity: String,
    shape: String,
  },
  side: {
    carat: Number,
    amount: Number,
    stone: String,
    purity: String,
    clarity: String,
    shape: String,
  },
  sideBaguette: {
    carat: Number,
    amount: Number,
    stone: String,
    purity: String,
    clarity: String,
    shape: String,
  },
  colorful: {
    carat: Number,
    amount: Number,
    stone: String,
    color: String,
    shape: String,
  },
  tl_sales: {
    KT_8: Number,
    KT_14: Number,
    KT_18: Number,
  },
  discount: Number,
  photos: {
    white: String,
    red: String,
    yellow: String,
  },
});

const Option = mongoose.model("option", optionSchema);

module.exports = Option;
