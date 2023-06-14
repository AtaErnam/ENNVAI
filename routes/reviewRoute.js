/* eslint-disable prettier/prettier */
const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route("/approved").get(reviewController.getAllApprovedReviews);

router
  .route("/")
  .get(
    authController.restrictTo("product_manager", "admin"),
    reviewController.getAllReviews
  )
  .post(
    authController.restrictTo("customer", "product_manager","admin"),
    reviewController.setProductUserIds,
    reviewController.createReview
  );

router
  .route("/giveApproval/:id")
  .patch(
    authController.restrictTo("product_manager"),
    reviewController.giveApproval
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("customer", "admin", "product_manager"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("customer", "admin", "product_manager"),
    reviewController.deleteReview
  );

module.exports = router;
