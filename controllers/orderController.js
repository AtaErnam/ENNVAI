const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Product = require("./../models/productModel");
const OrderItem = require("../models/orderItemModel");
const Order = require("../models/orderModel");

exports.getAllOrders = catchAsync(async (req, res) => {
  const order = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!order) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: order,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: order,
    },
  });
});
