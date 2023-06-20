const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const productRouter = express.Router({ mergeParams: true });

productRouter
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.restrictTo("admin", "partner"),
    productController.setTourUserIds,
    productController.createProduct
  );

productRouter
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.restrictTo("admin", "partner"),
    productController.updateProduct
  )
  .delete(
    authController.restrictTo("admin", "partner"),
    productController.deleteProduct
  );

module.exports = productRouter;
