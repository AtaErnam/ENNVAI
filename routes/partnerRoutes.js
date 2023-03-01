const express = require("express");
const partnerController = require("../controllers/partnerController");

const partnerRouter = express.Router();

partnerRouter
  .route("/")
  .get(partnerController.getAllPartners)
  .post(partnerController.createPartner);

partnerRouter
  .route("/:id")
  .get(partnerController.getPartner)
  .patch(partnerController.updatePartner)
  .delete(partnerController.deletePartner);

module.exports = partnerRouter;
