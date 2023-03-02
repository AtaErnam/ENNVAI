/* eslint-disable prettier/prettier */
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Partner = require("./../models/partnerModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllPartner = catchAsync(async (req, res) => {
  const features = new APIFeatures(Partner.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const partner = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: partner.length,
    data: {
      partner,
    },
  });
});

exports.getPartner = catchAsync(async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  // Tour.findOne({_id: req.params.id})

  if (!partner) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      partner,
    },
  });
});

exports.createPartner = catchAsync(async (req, res) => {
  const partner = await partner.create(req.body);

  if (!partner) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      partner: partner,
    },
  });
});

exports.updatePartner = catchAsync(async (req, res) => {
  const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!partner) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      partner: partner,
    },
  });
});

exports.deletePartner = catchAsync(async (req, res) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);
  if (!partner) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
