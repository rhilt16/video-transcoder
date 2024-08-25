const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  familyName: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, maxLength: 100 },
});


UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/users/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
