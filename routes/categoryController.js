const express = require("express");
const categoryController = require("../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(categoryController.getAllCategorys)
  .post(categoryController.createCategory);

categoryRouter
  .route("/:id")
  .get(categoryController.getCategory)
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = categoryRouter;
