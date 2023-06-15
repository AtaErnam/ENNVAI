/* eslint-disable prettier/prettier */
const express = require("express");
const optionController = require("../controllers/optionController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(
    authController.restrictTo("partner", "admin"),
    optionController.getAllOptions
  )
  .post(
    authController.restrictTo("customer", "partner", "admin"),
    optionController.setProductUserIds,
    optionController.createOption
  );

/* router
  .route("/giveApproval/:id")
  .patch(authController.restrictTo("partner"), optionController.giveApproval); */

router
  .route("/:id")
  .get(optionController.getOption)
  .patch(
    authController.restrictTo("customer", "admin", "partner"),
    optionController.updateOption
  )
  .delete(
    authController.restrictTo("customer", "admin", "partner"),
    optionController.deleteOption
  );

module.exports = router;
