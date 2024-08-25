#! /usr/bin/env node

const userArgs = process.argv.slice(2);

const User = require("./models/users");

const users = [];
const uploadlogs = [];
const transcodelogs = [];
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

async function userCreate(index, first_name, family_name, email, password) {
  const user = new User({ first_name: first_name, family_name: family_name, email: email, password: password});
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}
