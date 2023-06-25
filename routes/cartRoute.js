const express = require("express");
const orderController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(cartController.getAllOrders)
  .post(orderController.createOrder);

router.route("/:id").get(orderController.getOrder);

module.exports = router;
