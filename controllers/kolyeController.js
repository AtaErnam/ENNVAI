/* eslint-disable prettier/prettier */
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const Kolye = require("./../models/kolyeModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllKolyes = catchAsync(async (req, res) => {
  const features = new APIFeatures(Kolye.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const kolyes = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: kolyes.length,
    data: {
      kolyes,
    },
  });
});

exports.getKolye = catchAsync(async (req, res) => {
  const kolye = await Kolye.findById(req.params.id);
  // Tour.findOne({_id: req.params.id})

  res.status(200).json({
    status: "success",
    data: {
      kolye,
    },
  });
});

exports.createKolye = catchAsync(async (req, res) => {
  const newKolye = await Kolye.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      kolye: newKolye,
    },
  });
});

exports.updateKolye = catchAsync(async (req, res) => {
  const kolye = await Kolye.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      kolye: kolye,
    },
  });
});

exports.deleteKolye = catchAsync(async (req, res) => {
  await Kolye.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
