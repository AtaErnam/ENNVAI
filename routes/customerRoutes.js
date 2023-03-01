const express = require("express");
const customerController = require("../controllers/customerController");

const customerRouter = express.Router();

customerRouter
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

customerRouter
  .route("/:id")
  .get(customerController.getCustomer)
  .patch(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = customerRouter;
