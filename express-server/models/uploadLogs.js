const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UploadLogSchema = new Schema({
  user_id: { type: String, required: true }, // reference to the associated book
  video_id: {type: String, required: true},
  time_uploaded: { type: String, required: false },
  successful: {type: Boolean, required: true},
});


UploadLogSchema.virtual("url").get(function () {
  return `/uploads/${this._id}`;
});

// Export model
module.exports = mongoose.model("UploadLog", UploadLogSchema);
