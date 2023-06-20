const mongoose = require("mongoose");

const orderItemSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  dateOrdered: {
    type: Date,
    default: Date.now(),
  },
});

orderItemSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "productName price",
  }).populate({
    path: "user",
    select: "name photo",
  });
  
  next();
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;
