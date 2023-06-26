const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

exports.getAllCarts = catchAsync(async (req, res) => {
  const cart = await Cart.find()
    .populate("user", "name")
    .sort({ dateOrdered: -1 });

  if (!cart) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "Items",
      populate: {
        path: "product",
        populate: "category",
      },
    });

  if (!cart) {
    return next(new AppError("No document found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: cart,
    },
  });
});

exports.createCart = catchAsync(async (req, res, next) => {
  let stock_error = false;

  const ItemsIds = Promise.all(
    req.body.items.map(async (Item) => {
      let newItem = new Item({
        quantity: Item.quantity,
        product: Item.product,
      });

      Item = await Item.save();
      return Item._id;
    })
  );

  console.log(typeof ItemsIds);

  const ItemsIdsResolved = await ItemsIds;

  const totalPrices = await Promise.all(
    ItemsIdsResolved.map(async (ItemId) => {
      console.log("BRUH");
      const Item = await Item.findById({ _id: ItemId }).populate(
        "product",
        "price"
      );
      console.log(orderItem.product.price);
      const totalPrice = orderItem.product.price * orderItem.quantity;
      console.log(totalPrice);
      return totalPrice;
    })
  );
  console.log("BRUH1");

  const totalQuantities = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      console.log("BRUH2");

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
