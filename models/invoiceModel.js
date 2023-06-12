const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema(
  {
    orderItems: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "OrderItem",
        required: true,
      },
    ],
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Purchased", "Refunded"],
      default: "Pending",
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
    dateCreated: {
      type: Date,
      default: Date.now(),
    },
    invoiceType: {
      type: String,
      enum: ["Purchase", "DiscountAlert", "RefundApproval"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

invoiceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "orderItem",
    select: "quantity product user",
  }).populate({
    path: "user",
    select: "name photo",
  });

  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
