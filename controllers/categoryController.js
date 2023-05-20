/* eslint-disable prettier/prettier */
const Category = require("./../models/categoryModel");
const factory = require("./handlerFactory");
const APIFeatures = require("./../utils/apiFeatures");

/* exports.getAllCategorys = factory.getAll(Category);
exports.getCategory = factory.getOne(Category, { path: "products" });
exports.createCategory = factory.createOne(Category);
exports.updateCategory = factory.updateOne(Category);
exports.deleteCategory = factory.deleteOne(Category); */

exports.getAllCategory = catchAsync(async (req, res) => {
  const features = new APIFeatures(Category.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const categorys = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: category.length,
    data: {
      category,
    },
  });
});

exports.getCategory = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id);
  // Tour.findOne({_id: req.params.id})

  if (!category) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
});

exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);

  if (!category) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      category: category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      category: category,
    },
  });
});

exports.deleteCategory = catchAsync(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
