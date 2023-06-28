const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const Product = require("./../models/productModel");
const APIFeatures = require("./../utils/apiFeatures");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

exports.get_cart_items = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart && cart.items.length > 0) {
      res.status(200).json({
        status: "success",
        results: cart,
        data: {
          cart,
        },
      });
    } else {
      res.status(200).json({
        status: "success",
        results: cart,
        data: {
          cart,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return next(new AppError("No cart found with that ID", 404));
  }
});

exports.add_cart_item = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const productId = req.body.product;
  const qty = req.body.qty;

  console.log(userId);

  try {
    let cart = await Cart.find({ user: { $eq: req.params.id } });
    console.log(cart);
    let product = await Product.findById(req.body.product);
    if (!product) {
      return next(new AppError("No product found with that ID", 404));
    }
    const price = product.price;

    if (cart[0]) {
      // if cart exists for the user
      let itemIndex = cart[0].orderItems.findIndex((p) => p.id == productId);

      /*  console.log(cart[0]);

      let itemIndex = cart.find({
        orderItems: {
          $elemMatch: { product: productId },
        },
      });
      console.log(itemIndex); */

      // Check if product exists or not
      if (itemIndex > -1) {
        let productItem = cart.orderItems[itemIndex];
        productItem.qty += qty;
        cart[0].orderItems[itemIndex] = productItem;
      } else {
        cart[0].orderItems.push({ product: productId, qty: qty });
      }
      cart[0].totalPrice += qty * price;
      cart = await cart[0].save();
      console.log("BRUH2");
      return res.status(201).send(cart);
    } else {
      console.log(userId);

      // no cart exists, create one
      const newCart = await Cart.create({
        user: userId,
        orderItems: [{ product: productId, qty: qty }],
        totalPrice: qty * price,
      });
      res.status(200).json({
        status: "success",
        results: cart,
        data: {
          newCart,
        },
      });
    }
  } catch (err) {
    console.log(err);
    return next(new AppError("Someting went wrong", 404));
  }
});

exports.update_cart_item = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const { productId, qty } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    let product = await Product.findOne({ _id: productId });

    if (!product) return next(new AppError("Product not found", 404)); // not returning will continue further execution of code.

    if (!cart) return next(new AppError("Cart not found", 404));
    else {
      // if cart exists for the user
      let itemIndex = cart.orderItems.findIndex(
        (p) => p.productId == productId
      );

      // Check if product exists or not
      if (itemIndex == -1) return next(new AppError("Cart not found", 404));
      else {
        let productItem = cart.orderItems[itemIndex];
        productItem.quantity = qty;
        cart.orderItems[itemIndex] = productItem;
      }
      cart.totalPrice = cart.orderItems.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );
      cart = await cart.save();
      res.status(201).json({
        status: "success",
        results: cart.length,
        data: {
          newCart,
        },
      });
    }
  } catch (err) {
    // just printing the error wont help us find where is the error. Add some understandable string to it.
    console.log("Error in update cart", err);
    return next(new AppError("Something went wrong", 500));
  }
});

exports.delete_item = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.itemId;
  try {
    let cart = await Cart.findOne({ userId });
    let itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      let productItem = cart.orderItems[itemIndex];
      cart.bill -= productItem.quantity * productItem.price;
      cart.items.splice(itemIndex, 1);
    }
    cart = await cart.save();
    return res.status(201).send(cart);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
});
