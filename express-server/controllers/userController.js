const User = require("../models/users");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.user_list = asyncHandler(async (req, res, next) => {
  const user = await User.find().exec();
  res.json(user);
  return;
  });


exports.user_select = asyncHandler(async (req, res, next) => {

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

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
  res.send("NOT IMPLEMENTED: Author delete POST");
});

// Display Author update form on GET.
exports.user_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
exports.user_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});
