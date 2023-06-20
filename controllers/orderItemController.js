const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const OrderItem = require("./../models/orderItemModel");
const APIFeatures = require("./../utils/apiFeatures");
const User = require("../models/userModel");



exports.getAllOrderItemsOfUser = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on Tour
  let filter = { user: { $eq: req.user.id } };
  if (req.params.orderItemId) {
    console.log("lol");
    filter = {
      query: { orderItem: req.params.orderItem, user: { $eq: req.user.id } },
    };
  }

  const features = new APIFeatures(OrderItem.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  //const doc = await features.query.explain();
  const review = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: review.length,
    data: {
      data: review,
    },
  });
});

exports.getAllOrderItem = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on Tour
  let filter = {};
  if (req.params.orderItemId) {
    filter = {
      review: req.params.orderItemId,
    };
  }

  const features = new APIFeatures(OrderItem.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  //const doc = await features.query.explain();
  const orderItem = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: orderItem.length,
    data: {
      data: orderItem,
    },
  });
});
