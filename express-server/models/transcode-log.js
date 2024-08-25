const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TranscodeSchema = new Schema({
  video_id: { type: String, required: true },
  time_uploaded: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  successful: { type: Boolean, required: false },
});

// Virtual for book's URL
TranscodeSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/videos/transcodes/${this._id}`;
});

// Export model
module.exports = mongoose.model("Transcode", TrancodeSchema);
