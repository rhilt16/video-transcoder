var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const upload_controller = require("../controllers/uploadController");
const metadata_controller = require("../controllers/metadataController");
const transcode_controller = require("../controllers/transcodeController")


router.post("/uploads/upload", (req, res) => {
  // Check if file is not available return message with status 400.
  if (req.files === null) {
    return res.status(400).json({ msg: "No file uploaded" });
  }
  const file = req.files.file;
  // We need unique file name to save it in folder and then use filename to access it. I have replace space with - and concatinated file name with Date String. We can also used uuid package as well.
  const UFileName = `${new Date().getTime()}-${file.name.replaceAll(" ", "-")}`;
  // This line of code will save our file in public/uploads folder in our
  //appliction and will retrun err if any error found if no error found then return pathname of file.
  file.mv(`${__dirname}/../../uploads/${UFileName}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    res.json({ fileName: UFileName, filePath: `/uploads/${UFileName}` });
  });
});

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

//router.get("/transcodes", transcode_controller.transcode_list);

//router.post("/transcodes/create", transcode_controller.transcode_create_post);

//router.post("/transcodes/:id/delete", transcode_controller.transcode_delete_post);

//router.post("/transcodes/:id/update", transcode_controller.transcode_update_post);

//router.get("/transcodes/:id", transcodes_controller.transcodes_select);

module.exports = router;
