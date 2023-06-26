const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    items: [
      {
        quantity: Number,
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "Items must have a product"],
        },
      },
    ],
    address: {
      type: String,
      required: true,
      default: "My home",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "purchased"],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      required: true,
      enum: ["processing", "inTransit", "delivered"],
      default: "processing",
    },
    totalPrice: {
      type: Number,
    },
    totalQuantity: {
      type: Number,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    dateOrdered: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

/* cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
    select: "productName price",
  }).populate({
    path: "user",
    select: "name photo",
  });

  next();
}); */

/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress1" : "Flowers Street , 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "phone": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */
