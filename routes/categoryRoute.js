const express = require("express");
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(categoryController.getAllCategory)
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.createCategory
  );

categoryRouter
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.uploadCategoryImages,
    categoryController.resizeCategoryImages,
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    categoryController.deleteCategory
  );

module.exports = categoryRouter;
