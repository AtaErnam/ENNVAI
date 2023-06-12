const Order = require("../models/orderModel");
const express = require("express");
const OrderItem = require("../models/orderItemModel");

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.createOrder);

router
  .route("/:id")
  .get(orderController.getOrder)
  .delete(orderController.deleteOrder)
  .patch(orderController.purchaseOrder);

/* router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!order) {
    res.status(500).json({ success: false });
  }
  res.send(order);
}); */

// router.post("/", async (req, res) => {
//   const orderItemsIds = Promise.all(
//     req.body.orderItems.map(async (orderItem) => {
//       let newOrderItem = new OrderItem({
//         quantity: orderItem.quantity,
//         product: orderItem.product,
//       });
//       console.log(newOrderItem._id);

//       newOrderItem = await newOrderItem.save();
//       return newOrderItem._id;
//     })
//   );
//   const orderItemsIdsResolved = await orderItemsIds;

//   const totalPrices = await Promise.all(
//     orderItemsIdsResolved.map(async (orderItemId) => {
//       const orderItem = await OrderItem.findById(orderItemId).populate(
//         "product",
//         "price"
//       );

//       console.log(orderItem);

//       const totalPrice = orderItem.product.price * orderItem.quantity;
//       return totalPrice;
//     })
//   );

//   const totalQuantities = await Promise.all(
//     orderItemsIdsResolved.map(async (orderItemId) => {
//       const orderItem = await OrderItem.findById(orderItemId); /* .populate(
//         "product",
//         "quantity"
//       ); */
//       const totalQuantity = orderItem.quantity;
//       return totalQuantity;
//     })
//   );

//   const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
//   const totalQuantity = totalQuantities.reduce((a, b) => a + b, 0);

//   let order = new Order({
//     orderItems: orderItemsIdsResolved,
//     address: req.body.address,
//     status: req.body.status,
//     totalPrice: totalPrice,
//     totalQuantity: totalQuantity,
//     user: req.body.user,
//   });
//   order = await order.save();

//   if (!order) return res.status(400).send("the order cannot be created!");

//   res.send(order);
// });

// router.put("/:id", async (req, res) => {
//   const order = await Order.findByIdAndUpdate(
//     req.params.id,
//     {
//       status: req.body.status,
//     },
//     { new: true }
//   );

//   if (!order) return res.status(400).send("the order cannot be update!");

//   res.send(order);
// });

// router.delete("/:id", (req, res) => {
//   Order.findByIdAndRemove(req.params.id)
//     .then(async (order) => {
//       if (order) {
//         await order.orderItems.map(async (orderItem) => {
//           await OrderItem.findByIdAndRemove(orderItem);
//         });
//         return res
//           .status(200)
//           .json({ success: true, message: "the order is deleted!" });
//       } else {
//         return res
//           .status(404)
//           .json({ success: false, message: "order not found!" });
//       }
//     })
//     .catch((err) => {
//       return res.status(500).json({ success: false, error: err });
//     });
// });

// //SALES FUNCS

router.get("/get/totalsales", async (req, res) => {
  const totalSales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);

  if (!totalSales) {
    return res.status(400).send("The order sales cannot be generated");
  }

  res.send({ totalsales: totalSales.pop().totalsales });
});

router.get(`/get/count`, async (req, res) => {
  const orderCount = await Order.countDocuments((count) => count);

  if (!orderCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    orderCount: orderCount,
  });
});

router.get(`/get/userorders/:userid`, async (req, res) => {
  const userOrderList = await Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!userOrderList) {
    res.status(500).json({ success: false });
  }
  res.send(userOrderList);
});

module.exports = router;
