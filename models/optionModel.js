const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  optionName: String,
  GR: Number,
  stones: [
    {
      isMiddle: Boolean,
      carat: Number,
      amount: Number,
      stone: String,
      purity: String,
      clarity: String,
      shape: String,
    },
  ],
  colorful: [
    {
      carat: Number,
      amount: Number,
      stone: String,
      color: String,
      shape: String,
    },
  ],
});

const Option = mongoose.model("option", optionSchema);

module.exports = Option;
