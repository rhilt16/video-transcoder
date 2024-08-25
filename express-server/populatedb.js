#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const User = require("./models/users");

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
  await createTranscodeLogs();
  await createUsers();
  await createUploadLogs();
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
  const transcodeLog = new TranscodeLog{ video_id: video_id, time_uploaded: time_uploaded, user_id: user_id, successful: successful };

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




