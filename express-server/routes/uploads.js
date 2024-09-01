var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const upload_controller = require("../controllers/uploadController");
const metadata_controller = require("../controllers/metadataController");
const transcodes_controller = require("../controllers/transcodeController")
const ffmpeg = require('fluent-ffmpeg');
const JWT = require("../jwt.js");
const fs = require('fs');


// The route for uploading files, unfortunately didn't get it working in time

router.post('/uploads/upload', JWT.authenticateToken, asyncHandler(async (req, res, next) => {
    upload(req, res, function (err) {
        // Check for req.file
        console.log('Received file:', req.file);

        // Replace with upload code, use fs most likely

        // Handle errors
        if (!req.file) {
            return res.status(400).json({ error: true, message: 'No file uploaded' });
        } else if (err) {
            return res.status(400).json({ error: true, message: err });
        }

        // Continue processing the file
        res.status(200).json({ success: true, message: 'File uploaded successfully', file: req.file });
    });
}));


// Routes all use JWT authentication, and are handled in the upload controller
router.get("/uploads", JWT.authenticateToken, upload_controller.upload_list);

router.post("/uploads/create", JWT.authenticateToken, upload_controller.upload_create_post);

router.post("/uploads/delete/:id", JWT.authenticateToken, upload_controller.upload_delete_post);

router.post("/uploads/update/:id", JWT.authenticateToken, upload_controller.upload_update_post);


// Video Metadata

// Routes all use JWT authentication, and are handled in the metadata controller
router.get("/metadata", JWT.authenticateToken, metadata_controller.metadata_list);

router.post("/metadata/create", JWT.authenticateToken, metadata_controller.metadata_create_post);

router.post("/metadata/delete/:id", JWT.authenticateToken, metadata_controller.metadata_delete_post);

router.post("/metadata/update/:id", JWT.authenticateToken, metadata_controller.metadata_update_post);

router.get("/metadata/select/:id", JWT.authenticateToken, metadata_controller.metadata_select);

// Transcodes
// Routes all use JWT authentication, and are handled in the transcode controller

// Route for transcoding a provided video file into a different video format
router.post("/transcodes/transcode", (req, res) => {
  // Path for file to be converted, and the path of the outputted, converted video
  const inputpath = req.filepath;
  const outputpath = `/uploads/output.avi`;

// Use ffmpeg to transcode, handle errors, and save the file in a provided path
ffmpeg(inputpath)
  .output(outputpath)
  .videoCodec('libx264')
  .audioCodec('libmp3lame')
  .on('progress', (progress) => {
    console.log(progress)
  })
  .on('end',() => {
  console.log("done")
  })
  .on('error',(error) => console.log(error))
  .save('./uploads/output.avi')
});

router.get("/transcodes", JWT.authenticateToken, transcodes_controller.transcode_list);

router.post("/transcodes/create", JWT.authenticateToken, transcodes_controller.transcode_create_post);

router.post("/transcodes/delete/:id", JWT.authenticateToken, transcodes_controller.transcode_delete_post);

router.post("/transcodes/update/:id", JWT.authenticateToken, transcodes_controller.transcode_update_post);

router.get("/transcodes/:id", JWT.authenticateToken, transcodes_controller.transcode_select);

module.exports = router;
