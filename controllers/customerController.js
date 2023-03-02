/* eslint-disable prettier/prettier */
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Customer = require("./../models/customerModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllCustomer = catchAsync(async (req, res) => {
  const features = new APIFeatures(Customer.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const customer = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: customer.length,
    data: {
      customer,
    },
  });
});

exports.getCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  // Tour.findOne({_id: req.params.id})
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      customer,
    },
  });
});

exports.createCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.create(req.body);
  if (!customer) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      customer: customer,
    },
  });
});

exports.updateCustomer = catchAsync(async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!customer) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      customer: customer,
    },
  });
});

exports.deleteCustomer = catchAsync(async (req, res) => {
  const customer = await customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
