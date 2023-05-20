/* eslint-disable prettier/prettier */

const Product = require("./../models/productModel");
const factory = require("./handlerFactory");
const APIFeatures = require("./../utils/apiFeatures");

//exports.getAllProducts = factory.getAll(Product);

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id;
  next();
};

/* exports.getProduct = factory.getOne(Product);

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product); */

exports.getAllProducts = catchAsync(async (req, res) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const product = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: product.length,
    data: {
      product,
    },
  });
});

exports.getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // Tour.findOne({_id: req.params.id})

  if (!product) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);

  if (!product) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      product: product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product: product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("No tour found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
