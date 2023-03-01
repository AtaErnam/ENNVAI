/* eslint-disable prettier/prettier */

const Customer = require("./../models/customerModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllCustomers = async (req, res) => {
  try {
    // EXECUTE QUERY
    console;
    const features = new APIFeatures(Customer.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const customers = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: customers.length,
      data: {
        customers,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: "success",
      data: {
        customer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        customer: newCustomer,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        customer: customer,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await customer.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
