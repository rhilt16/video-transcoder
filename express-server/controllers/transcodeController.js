const Transcode = require("../models/transcode-log");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

// Lists all transcodes
exports.transcode_list = asyncHandler(async (req, res, next) => {
  const transcode = await Transcode.find().exec();
  res.json(transcode);
  return;
  });

// Select a transcode entry
exports.transcode_select = asyncHandler(async (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid transcode ID" });
  }

  const transcode = await Transcode.findById(req.params.id)
    .exec();

  if (transcode === null) {
    const err = new Error("Transcode instance not found");
    err.status = 404;
    return next(err);
  }

  res.json(transcode);


});
// Create a transcode entry
exports.transcode_create_post = [
  // Validate and sanitize fields.
  body("video_id")
    .trim()
    .isLength({ min: 13 })
    .escape()
    .withMessage("ID must be correct length"),
  body("time_uploaded")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Upload time required"),
  body("user_id")
    .isLength({min: 24})
    .escape()
    .withMessage("ID must be correct length required"),
  body("successful")
    .isBoolean()
    .escape()
    .withMessage("Must be boolean"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);


    const transcode = new Transcode({
      video_id: req.body.video_id,
      time_uploaded: req.body.time_uploaded,
      user_id: req.body.user_id,
      successful: req.body.successful,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.status(400).json({
        transcode: transcode,
        errors: errors.array(),
      });
      return;
    } else {
      await transcode.save();
      res.status(200);
      res.json(transcode);
    }
  }),
];
// Update a transcode entry
exports.transcode_update_post = [
  // Validate and sanitize fields.
  body("video_id")
    .trim()
    .isLength({ min: 13 })
    .escape()
    .withMessage("ID must be correct length"),
  body("time_uploaded")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Upload time required"),
  body("user_id")
    .isLength({min: 24})
    .escape()
    .withMessage("ID must be correct length required"),
  body("successful")
    .isBoolean()
    .escape()
    .withMessage("Must be boolean"),



  //Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid transcode ID" });
    }

    // Check if the provided ID is a valid ObjectId
    const transcodeExists = await Transcode.exists({ _id: req.params.id });
    if (!transcodeExists) {
      return res.status(404).json({ error: 'Transcode not found' });
    }

    // Create Transcode object with escaped and trimmed data (and the old id!)
    const transcode = new Transcode({
      video_id: req.body.video_id,
      time_uploaded: req.body.time_uploaded,
      user_id: req.body.user_id,
      successful: req.body.successful,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.status(400).json({
        transcode: transcode,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Transcode.findByIdAndUpdate(req.params.id, transcode);
      const newtranscode = await Transcode.findById(req.params.id);
      res.status(200);
      res.json(newtranscode);
    }
  }),
];
// Delete a transcode entry
exports.transcode_delete_post = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid transcode ID" });
  }
  const transcode = await Transcode.findById(req.params.id)
    .exec();

  if (transcode == null) {
    return res.status(404).json({ error: 'Transcode not found' });
  }

  await Transcode.findByIdAndDelete(req.params.id);
  return res.status(200).send()

});
