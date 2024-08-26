#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const User = require("./models/users");
const Transcode = require("./models/transcode-log");
const UploadLog = require("./models/uploadLogs");
const Metadata = require("./models/metadata");

const users = [];
const uploadLogs = [];
const transcodeLogs = [];
const metadata = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createTranscodes();
  await createUsers();
  await createUploads();
  await createMetadata();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function userCreate(index, firstName, familyName, email, password) {
  const user = new User({ firstName: firstName, familyName: familyName, email: email, password: password});
  await user.save();
  users[index] = user;
  console.log(`Added user: ${familyName}`);
}

async function transcodeCreate(index, video_id, time_uploaded, user_id, successful) {
  const transcodeLog = new Transcode({ video_id: video_id, time_uploaded: time_uploaded, user_id: user_id, successful: successful });

  await transcodeLog.save();
  transcodeLogs[index] = transcodeLog;
  console.log(`Added transcodeLog: ${video_id}`);
}

async function uploadCreate(index, user_id, video_id, time_uploaded, successful) {
  const uploadLog = new UploadLog({ user_id: user_id, video_id: video_id, time_uploaded: time_uploaded, successful: successful });
  await uploadLog.save();
  uploadLogs[index] = uploadLog;
  console.log(`Added upload log: ${video_id}`);
}

async function metadataCreate(index, video_id, path, size, format) {
  const metadataInstance = new Metadata({ video_id: video_id, path: path, size: size, format: format });
  await metadataInstance.save();
  metadata[index] = metadataInstance;
  console.log(`Added metadata: ${video_id}`);
}

async function createUsers() {
  console.log("Adding users");
  await Promise.all([
    userCreate(0, "Admin", "Smith", "admin@admin.com", "secret"),
  ]);
}

async function createTranscodes() {
  console.log("Adding transcodes");
  await Promise.all([
    transcodeCreate(0, "coolID", "25/08/2024 16:15:29", 0, 1),
  ]);
}

async function createUploads() {
  console.log("Adding uploads");
  await Promise.all([
    uploadCreate(0, 0, "coolID", "25/08/2024 16:14:30", 1),
  ]);
}

async function createMetadata() {
  console.log("Adding metadata");
  await Promise.all([
    metadataCreate(0, "coolID", "path/to/file", "16kb", ".mp4"),
  ]);
}


