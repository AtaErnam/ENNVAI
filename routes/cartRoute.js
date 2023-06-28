const express = require("express");
const cartController = require("../controllers/cartController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/:id")
  .get(cartController.get_cart_items)
  .post(cartController.add_cart_item)
  .put(cartController.update_cart_item);

router.delete("/cart/:userId/:itemId", cartController.delete_item);

module.exports = router;
