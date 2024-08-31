var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const upload_controller = require("../controllers/uploadController");
const metadata_controller = require("../controllers/metadataController");
const transcodes_controller = require("../controllers/transcodeController")
const ffmpeg = require('fluent-ffmpeg');
const JWT = require("../jwt.js");
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        console.log(file);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 50 } //50MB limit
}).single('file');



router.post("/uploads/upload", JWT.authenticateToken, asyncHandler(async (req, res, next) => {
        //Use multer to upload the file
console.log('Current working directory:', process.cwd());

await fs.readdir('.', (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }
  console.log('Files in the current directory:', files);
});
        upload(req, res, function (err) {
            fs.readdir('.', (err, files) => {
  		if (err) {
  		  console.error('Error reading directory:', err);
 		   return;
		  }
			  console.log('Files in the current directory:', files);
});
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: true, message: err });
            } else if (err) {
                return res.status(400).json({ error: true, message: err });
            }

            if (!req.file) {
                return res.status(400).json({ error: true, message: "No file uploaded." });
            }

return res.status(200).json({message: "good"});


        })
    }));



router.get("/uploads", upload_controller.upload_list);

router.post("/uploads/create", upload_controller.upload_create_post);

router.post("/uploads/:id/delete", upload_controller.upload_delete_post);

router.post("/uploads/:id/update", upload_controller.upload_update_post);

router.get("/uploads/:id", upload_controller.upload_select);

// Video Metadata

router.get("/metadata", metadata_controller.metadata_list);

router.post("/metadata/create", metadata_controller.metadata_create_post);

router.post("/metadata/:id/delete", metadata_controller.metadata_delete_post);

router.post("/metadata/:id/update", metadata_controller.metadata_update_post);

router.get("/metadata/:id", metadata_controller.metadata_select);

// Transcodes

router.post("/transcodes/transcode", (req, res) => {
  // Check if file is not available return message with status 400.
  // We need unique file name to save it in folder and then use filename to access it. I have replace space with - and concatinated file name with Date String. We can also used uuid package as well.
  const inputpath = req.filepath;
  const outputpath = `/uploads/output.avi`;

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

router.get("/transcodes", transcodes_controller.transcode_list);

router.post("/transcodes/create", transcodes_controller.transcode_create_post);

router.post("/transcodes/:id/delete", transcodes_controller.transcode_delete_post);

router.post("/transcodes/:id/update", transcodes_controller.transcode_update_post);

router.get("/transcodes/:id", transcodes_controller.transcode_select);

module.exports = router;
