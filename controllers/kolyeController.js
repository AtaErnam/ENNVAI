/* eslint-disable prettier/prettier */

const Kolye = require("./../models/kolyeModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllKolyes = async (req, res) => {
  try {
    // EXECUTE QUERY
    console;
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
        kolyes,
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

exports.getKolye = async (req, res) => {
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

exports.createKolye = async (req, res) => {
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

exports.updateKolye = async (req, res) => {
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

exports.deleteKolye = async (req, res) => {
  try {
    await Kolye.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.log(err)
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
