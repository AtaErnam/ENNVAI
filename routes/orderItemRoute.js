/* eslint-disable prettier/prettier */
const express = require("express");
const orderItemController = require("../controllers/orderItemController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

//router.route("/approved").get(orderItemController.getAllOrderItemsOfUser);

router.use(authController.protect);

router
  .route("/")
  .get(orderItemController.getAllOrderItem)
  .post(
    orderItemController.setOrderItemUserIds,
    orderItemController.createOrderItem
  );

router.route("/userItems").get(orderItemController.getAllOrderItemsOfUser);
/* router
  .route("/giveApproval/:id")
  .patch(
    authController.restrictTo("product_manager"),
    orderItemController.giveApproval
  ); */

router
  .route("/:id")
  .get(orderItemController.getOrderItem)
  .patch(orderItemController.updateOrderItem)
  .delete(orderItemController.deleteOrderItem);

module.exports = router;
