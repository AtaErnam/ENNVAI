/* eslint-disable prettier/prettier */

const Kolye = require("./../models/kolyeModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Kolye.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const kolyes = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: kolyes.length,
      data: {
        tours,
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

exports.getTour = async (req, res) => {
  try {
    const kolye = await Kolye.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: "success",
      data: {
        kolye,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newKolye = await Kolye.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        kolye: newKolye,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const kolye = await Kolye.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        kolye: kolye,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await kolye.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
