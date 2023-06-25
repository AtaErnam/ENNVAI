const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(cartController.getAllCarts)
  .post(cartController.createCart);

router.route("/:id").get(cartController.getCart);

module.exports = router;
