const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MetadataSchema = new Schema({
  video_id: { type: String, required: true },
  path: {type: String, required: true},
  size: { type: String, required: true },
  format: {type: String, required: true},
});


MetadataSchema.virtual("url").get(function () {
  return `/uploads/metadata/${this._id}`;
});

// Export model
module.exports = mongoose.model("Metadata", MetadataSchema);
