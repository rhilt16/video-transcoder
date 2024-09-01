const Metadata = require("../models/metadata");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

// Lists all metadata
exports.metadata_list = asyncHandler(async (req, res, next) => {
  const metadata = await Metadata.find().exec();
  res.json(metadata);
  return;
  });

// Select a specific video's metadata
exports.metadata_select = asyncHandler(async (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid metadata ID" });
  }

  const metadata = await Metadata.findById(req.params.id)
    .exec();

  if (metadata === null) {
    const err = new Error("Metadata not found");
    err.status = 404;
    return next(err);
  }

  res.json(metadata);


});
// Create a metadata entry
exports.metadata_create_post = [
  // Validate and sanitize fields.
  body("video_id")
    .trim()
    .isLength({ min: 13 })
    .escape()
    .withMessage("ID must be correct length"),
  body("path")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Path required"),
  body("size")
    .isLength({min: 1})
    .escape()
    .withMessage("size required"),
  body("format")
    .isLength({max: 1})
    .escape()
    .withMessage("Must be boolean"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);


    const metadata = new Metadata({
      video_id: req.body.video_id,
      path: req.body.path,
      size: req.body.size,
      format: req.body.format,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.status(400).json({
        metadata: metadata,
        errors: errors.array(),
      });
      return;
    } else {
      await metadata.save();
      res.status(200);
      res.json(metadata);
    }
  }),
];
// Update a metadata entry
exports.metadata_update_post = [
  // Validate and sanitize fields.
  body("video_id")
    .trim()
    .isLength({ min: 13 })
    .escape()
    .withMessage("ID must be correct length"),
  body("path")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Path required"),
  body("size")
    .isLength({min: 1})
    .escape()
    .withMessage("size required"),
  body("format")
    .isLength({max: 1})
    .escape()
    .withMessage("Must be boolean"),



  //Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid metadata ID" });
    }

    // Check if the provided ID is a valid ObjectId
    const metadataExists = await Metadata.exists({ _id: req.params.id });
    if (!metadataExists) {
      return res.status(404).json({ error: 'Metadata not found' });
    }

    // Create Metadata object with escaped and trimmed data (and the old id!)
    const metadata = new Metadata({
      video_id: req.body.video_id,
      path: req.body.path,
      size: req.body.size,
      format: req.body.format,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.status(400).json({
        metadata: metadata,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Metadata.findByIdAndUpdate(req.params.id, metadata);
      const newmetadata = await Metadata.findById(req.params.id);
      res.status(200);
      res.json(newmetadata);
    }
  }),
];
// Delete a metadata entry
exports.metadata_delete_post = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid metadata ID" });
  }
  const metadata = await Metadata.findById(req.params.id)
    .exec();

  if (metadata == null) {
    return res.status(404).json({ error: 'Metadata not found' });
  }

  await Metadata.findByIdAndDelete(req.params.id);
  return res.status(200).send()

});
