const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

exports.get_orders = async (req, res) => {
  const userId = req.params.id;
  Order.find({ userId })
    .sort({ date: -1 })
    .then((orders) => res.json(orders));
};

exports.checkout = async (req, res) => {
  try {
    const userId = req.params.id;
    //const {source} = req.body;
    let cart = await Cart.find({ user: { $eq: req.params.id } });
    console.log(cart);
    let user = await User.find({ user: { $eq: req.params.id } });
    const email = user.email;
    if (cart[0]) {
      const charge = await stripe.charges.create({
        amount: cart[0].totalPrice,
        currency: "usd",
        source: "tok_amex",
        receipt_email: email,
      });
      if (!charge) throw Error("Payment failed");
      if (charge) {
        const order = await Order.create({
          userId,
          items: cart.orderItems,
          bill: cart.totalPrice,
        });
        const data = await Cart.findByIdAndDelete({ _id: cart.id });
        return res.status(201).send(order);
      }
    } else {
      res.status(500).send("You do not have items in cart");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};
