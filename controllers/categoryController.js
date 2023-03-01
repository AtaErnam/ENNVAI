/* eslint-disable prettier/prettier */

const Category = require("./../models/categoryModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllCategorys = async (req, res) => {
  try {
    // EXECUTE QUERY
    console;
    const features = new APIFeatures(Category.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const categorys = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: categorys.length,
      data: {
        categorys,
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

exports.getCategory = async (req, res) => {
  try {
    const Category = await Category.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        category: newCategory,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const Category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        category: category,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

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
