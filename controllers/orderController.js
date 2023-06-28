const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const User = require("../models/userModel");
const OrderItem = require("../models/orderItemModel");
const Order = require("../models/orderModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently selected order
  const order = await Order.findById(req.params.orderID);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    /* success_url: `${req.protocol}://${req.get("host")}/?order=${
      req.params.orderID
    }&user=${req.user.id}&price=${order.totalPrice}`, */
    success_url: `${req.protocol}://${req.get('host')}/my-orders?alert=order`,
    cancel_url: `${req.protocol}://${req.get("host")}/order/`,
    customer_email: req.user.email,
    client_reference_id: req.params.orderId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description:"", 
        images: [
          `${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

const createBookingCheckout = async (session) => {
  const order = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;
  await Order.create({ order, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

exports.getAllOrders = catchAsync(async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

exports.getOrder = catchAsync(async (req, res) => {
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
});

exports.createOrder = catchAsync(async (req, res, next) => {
  let stock_error = false;

  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });

      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  console.log(typeof orderItemsIds);

  const orderItemsIdsResolved = await orderItemsIds;

  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById({ _id: orderItemId }).populate(
        "product",
        "price"
      );
      console.log(orderItem.product);
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );

  const totalQuantities = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "quantity"
      );

      console.log(orderItem.product.id);
      const currOrderProd = await Product.findById(orderItem.product.id);
      console.log(currOrderProd.quantity_in_stocks);
      if (currOrderProd.quantity_in_stocks < orderItem.quantity) {
        stock_error = true;
      }

      const totalQuantity = orderItem.quantity;
      return totalQuantity;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  const totalQuantity = totalQuantities.reduce((a, b) => a + b, 0);

  if (stock_error) {
    return next(new AppError("No enough stock", 403));
  }

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    address: req.body.address,
    status: req.body.status,
    totalPrice: totalPrice,
    totalQuantity: totalQuantity,
    user: req.body.user,
  });
  order = await order.save();

  if (!order) return res.status(400).send("the order cannot be created!");

  res.status(200).json({
    status: "success",
    data: {
      product: order,
    },
  });
});

exports.purchaseOrder = catchAsync(async (req, res, next) => {
  if (!req.body.creditcard) {
    return next(new AppError("Creditcard information missing", 404));
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: "Purchased",
      dateOrdered: Date.now(),
    },
    { new: true }
  );

  if (!order) {
    return next(new AppError("No order found with that ID", 404));
  }
  console.log(order.orderItems);

  const orderItemsIds = await Promise.all(
    order.orderItems.map(async (orderItem) => {
      console.log("----");
      console.log(req.user.id);
      console.log("----");
      let newOrderItem = await OrderItem.findByIdAndUpdate(orderItem, {
        user: req.user.id,
        dateOrdered: Date.now(),
      });

      console.log(newOrderItem);
      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = orderItemsIds;

  await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "quantity"
      );

      console.log(orderItem.product.id);
      const currOrderProd = await Product.findById(orderItem.product.id);
      console.log(typeof currOrderProd.quantity_in_stocks);
      console.log(typeof orderItem.quantity);

      let updatedQuantity =
        currOrderProd.quantity_in_stocks - orderItem.quantity;
      console.log(updatedQuantity);
      await Product.findByIdAndUpdate(orderItem.product.id, {
        quantity_in_stocks: updatedQuantity,
      });

      const totalQuantity = orderItem.quantity;
      return totalQuantity;
    })
  );

  res.status(200).json({
    status: "success",
    data: {
      product: order,
    },
  });
});

exports.deleteOrder = (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
};
