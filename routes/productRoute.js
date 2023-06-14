const express = require("express");
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoute");
const userRouter = require("./userRoute");

const productRouter = express.Router();

//productRouter.use("/:productId/reviews", reviewRouter);

productRouter
  .route("/discountProduct/:id")
  .patch(
    authController.protect,
    authController.restrictTo("sales_manager", "admin"),
    productController.discountProduct
  );

productRouter
  .route("/addToWishlist/:id")
  .patch(
    authController.protect,
    authController.restrictTo("customer", "admin"),
    productController.addProductToWishlist
  );
productRouter
  .route("/deleteFromWishlist/:id")
  .patch(
    authController.protect,
    authController.restrictTo("customer", "admin"),
    productController.removeProductFromWishlist
  );

productRouter
  .route("/")
  .get(productController.getAllProduct)
  .post(
    authController.protect,
    authController.restrictTo("customer", "product_manager", "admin"),
    productController.createProduct
  );

productRouter
  .route("/:id")
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo("sales_manager", "product_manager", "admin"),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("product_manager", "admin"),
    productController.deleteProduct
  );

productRouter.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});

productRouter.get(`/get/featured/:count`, async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = productRouter;
