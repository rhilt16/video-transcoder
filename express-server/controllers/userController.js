const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const JWT = require("../jwt.js");
const path = require("path");
const Upload = require("../models/uploadLogs");




exports.user_list = asyncHandler(async (req, res, next) => {
  const user = await User.find().exec();
  res.json(user);
  return;
  });


exports.user_select = asyncHandler(async (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  const authUser = req.user.email;
  const user = await User.findById(req.params.id)
    .exec();

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.json(user);


});

// Handle Author create on POST.
exports.user_create_post = [
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

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const user = new User({
      firstName: req.body.firstName,
      familyName: req.body.familyName,
      email: req.body.email,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.status(400).json({
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      await user.save();
      res.status(200);
      res.json(user);
    }
  }),
];

//Handle Author delete on POST.
exports.user_delete_post = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const user = await User.findById(req.params.id)
    .exec();

  if (user == null) {
    return res.status(404).json({ error: 'User not found' });
  }

  await User.findByIdAndDelete(req.params.id);
  return res.status(200).send()

});



exports.user_update_post = [
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

exports.user_login_post = asyncHandler(async (req, res, next) => {

  const {email, password} = req.body;

  const user = await User.findOne({
    email: email,
    password: password
  }).exec();

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }
  const user_id = user._id;
  console.log(JWT.tokenSecret);
  const token = JWT.generateToken({user_id});
  res.json({authenticationToken: token, user_id: user_id});

});

exports.upload_list = asyncHandler(async (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const uploads = await Upload.find({user_id: req.params.id})
    .exec();

  if (uploads === null) {
    const err = new Error("Upload not found");
    err.status = 404;
    return next(err);
  }

  res.json(uploads);

});
