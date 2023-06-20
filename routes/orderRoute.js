const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(orderController.getAllOrders);

router.route("/:id").get(orderController.getOrder);

module.exports = router;
