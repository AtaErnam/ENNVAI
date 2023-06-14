/* eslint-disable prettier/prettier */
const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllApprovedReviews = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on Tour
  let filter = { isApproved: { $ne: false } };
  if (req.params.reviewId) {
    console.log("lol");
    filter = {
      query: { review: req.params.reviewId, isApproved: { $ne: false } },
    };
  }

  const features = new APIFeatures(Review.find(filter), req.query)
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

/* exports.getAllReviews = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on Tour
  let filter = {};
  if (req.params.reviewId) {
    filter = {
      review: req.params.reviewId,
    };
  }

  const features = new APIFeatures(Review.find(filter), req.query)
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
}); */

exports.getAllReviews = factory.getAll(Review);

exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  req.body.user = req.user.id;
  next();
};

exports.getReview = catchAsync(async (req, res, next) => {
  let query = Review.findById(req.params.id);
  const review = await query;
  // Tour.findOne({ _id: req.params.id })
  console.log(review);
  if (!review.isApproved) {
    return next(new AppError("This comment is not approved yet", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: review,
    },
  });
});
//factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);

exports.giveApproval = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("No document found with that ID", 404));
  }

  review.isApproved = true;
  review.save();

  res.status(200).json({
    status: "success",
    data: {
      data: review,
    },
  });
});
