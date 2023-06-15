const Option = require("../models/optionModel");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

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

exports.getAllOptions = factory.getAll(Option);

exports.setProductUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.option) req.body.option = req.params.optionId;
  req.body.user = req.user.id;
  next();
};

/* exports.getOption = catchAsync(async (req, res, next) => {
  let query = Option.findById(req.params.id);
  const option = await query;
  // Tour.findOne({ _id: req.params.id })
  console.log(option);
  if (!option.isApproved) {
    return next(new AppError("This comment is not approved yet", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: option,
    },
  });
}); */
exports.getOption = factory.getOne(Option);

exports.createOption = factory.createOne(Option);

exports.updateOption = factory.updateOne(Option);

exports.deleteOption = factory.deleteOne(Option);
