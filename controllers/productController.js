/* eslint-disable prettier/prettier */
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const User = require("../models/userModel");

exports.getAllProduct = factory.getAll(Product);

/* exports.getAllProduct = catchAsync(async (req, res) => {
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
}); */

exports.getProduct = factory.getOne(Product, { path: "reviews" });

/* exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // product.findOne({_id: req.params.id})
  console.log(product);

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
}); */

exports.createProduct = factory.createOne(Product);

/* catchAsync(async (req, res,next) => {
  const product = await Product.create(req.body);

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(201).json({
    status: "success",
    data: {
      product: product,
    },
  });
}); */

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.addProductToWishlist = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  const currUser = await User.findById(req.user.id);
  console.log(currUser.wishlist);

  if (currUser.wishlist.includes(product.id)) {
    return next(new AppError("Product is already in the wishlist", 404));
  }

  currUser.wishlist.push(product);
  console.log(currUser.wishlist);
  const user = await User.findByIdAndUpdate(req.user.id, currUser);

  res.status(200).json({
    status: "success",
    data: {
      product: user.wishlist,
    },
  });
});

function removeObjectWithId(arr, id) {
  // Making a copy with the Array from() method

  const objWithIdIndex = arr.findIndex((obj) => obj.id === id);
  arr.splice(objWithIdIndex, 1);
  return arr;
}

exports.removeProductFromWishlist = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }

  const currUser = await User.findById(req.user.id);
  currUser.wishlist = removeObjectWithId(currUser.wishlist, req.params.id);
  const user = await User.findByIdAndUpdate(req.user.id, currUser);

  res.status(200).json({
    status: "success",
    data: {
      user: user.wishlist,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.discountProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const { discountRate } = req.body;
  console.log(discountRate);

  if (!product) {
    return next(new AppError("No product found with that ID", 404));
  } else if (!discountRate) {
    return next(new AppError("Please enter the discount amount", 404));
  } else if (discountRate > 100 || discountRate < 0) {
    return next(new AppError("Discount rate has to be between 0 and 100", 403));
  }

  const DiscountedPrice = product.price - (discountRate * product.price) / 100;
  console.log(DiscountedPrice);

  if (product.price > DiscountedPrice) {
    await Product.findByIdAndUpdate(req.params.id, {
      discountPrice: DiscountedPrice,
    });
  } else {
    await Product.findByIdAndUpdate(req.params.id, {
      discountPrice: product.price,
    });
  }

  const allUsers = await User.find();

  for (let i = 0; i < allUsers.length; i++) {
    const currUser = allUsers[i];
    if (currUser.wishlist.includes(product.id)) {
      console.log("SENT MAIL")
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      product: product,
    },
  });
});
