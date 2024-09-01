var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const user_controller = require("../controllers/userController")
const JWT = require("../jwt.js");


/* GET users listing. */
router.get("/", user_controller.user_list);


// POST request for creating Author.
router.post("/create", JWT.authenticateToken, user_controller.user_create_post);


// POST request to delete Author.
router.post("/delete/:id", JWT.authenticateToken, user_controller.user_delete_post);


// POST request to update Author.
router.post("/update/:id/", JWT.authenticateToken, user_controller.user_update_post);

// GET request for one Author.
router.get("/select/:id", JWT.authenticateToken, user_controller.user_select);

router.get("/uploads/:id", JWT.authenticateToken, user_controller.upload_list);

router.post("/login", user_controller.user_login_post);

module.exports = router;
