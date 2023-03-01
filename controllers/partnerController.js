/* eslint-disable prettier/prettier */

const Partner = require("./../models/partnerModel");
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllPartners = async (req, res) => {
  try {
    // EXECUTE QUERY
    console;
    const features = new APIFeatures(Partner.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const partners = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: partners.length,
      data: {
        partners,
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

exports.getPartner = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: "success",
      data: {
        partner,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createPartner = async (req, res) => {
  try {
    const newPartner = await Partner.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        partner: newPartner,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!",
    });
  }
};

exports.updatePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        partner: partner,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deletePartner = async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);

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
