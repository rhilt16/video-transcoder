const Metadata = require("../models/metadata");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.metadata_list = asyncHandler(async (req, res, next) => {
  const metadata = await Metadata.find().exec();
  res.json(metadata);
  return;
  });


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

exports.metadata_update_post = [
  // Validate and sanitize fields.
  body("user_id")
    .trim()
    .isLength({ min: 24 })
    .escape()
    .withMessage("ID must be correct length")
    .isAlphanumeric()
    .withMessage("ID has non-alphanumeric characters."),
  body("video_id")
    .trim()
    .isLength({ min: 13 })
    .escape()
    .withMessage("Video ID must be correct length"),
  body("time_uploaded")
    .isLength({min: 1}),
  body("successful")
    .isBoolean({max: 1})
    .withMessage("Must be boolean"),

  //Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid upload ID" });
    }

    // Check if the provided ID is a valid ObjectId
    const uploadExists = await Upload.exists({ _id: req.params.id });
    if (!uploadExists) {
      return res.status(404).json({ error: 'Upload not found' });
    }

    // Create Author object with escaped and trimmed data (and the old id!)
    const upload = new Upload({
      user_id: req.body.user_id,
      video_id: req.body.video_id,
      time_uploaded: req.body.time_uploaded,
      successful: req.body.successful,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.status(400).json({
        upload: upload,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Upload.findByIdAndUpdate(req.params.id, upload);
      const newupload = await Upload.findById(req.params.id);
      res.status(200);
      res.json(newupload);
    }
  }),
];

exports.upload_delete_post = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid upload ID" });
  }
  const upload = await Upload.findById(req.params.id)
    .exec();

  if (upload == null) {
    return res.status(404).json({ error: 'Upload not found' });
  }

  await Upload.findByIdAndDelete(req.params.id);
  return res.status(200).send()

});
