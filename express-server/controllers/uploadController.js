const Upload = require("../models/uploadLogs");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.upload_list = asyncHandler(async (req, res, next) => {
  const upload = await Upload.find().exec();
  res.json(upload);
  return;
  });


exports.upload_select = asyncHandler(async (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid upload ID" });
  }

  const upload = await Upload.findById(req.params.id)
    .exec();

  if (upload === null) {
    const err = new Error("Upload not found");
    err.status = 404;
    return next(err);
  }

  res.json(upload);


});

exports.upload_create_post = [
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
    .isLength({ min: 24 })
    .escape()
    .withMessage("Video ID must be correct length")
    .isAlphanumeric()
    .withMessage("Video ID has non-alphanumeric characters."),
  body("time_uploaded")
    .isLength({min: 1})
    .isDate(),
  body("successful")
    .isBoolean({max: 1})
    .withMessage("Must be boolean")

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);


    const upload = new Upload({
      user_id: req.body.user_id,
      video_id: req.body.video_id,
      time_uploaded: req.body.time_uploaded,
      successful: req.body.successful,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.status(400).json({
        upload: upload,
        errors: errors.array(),
      });
      return;
    } else {
      await upload.save();
      res.status(200);
      res.json(user);
    }
  }),
];

exports.upload_update_post = [
  // Validate and sanitize fields.
  body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("familyName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("email")
    .isLength({min: 1})
    .isEmail(),
  body("password")
    .isLength({min: 6}),

  //Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if the provided ID is a valid ObjectId
    const userExists = await User.exists({ _id: req.params.id });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Author object with escaped and trimmed data (and the old id!)
    const user = new User({
      firstName: req.body.firstName,
      familyName: req.body.familyName,
      email: req.body.email,
      password: req.body.password,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.status(400).json({
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await User.findByIdAndUpdate(req.params.id, user);
      const newuser = await User.findById(req.params.id);
      res.status(200);
      res.json(newuser);
    }
  }),
];
