var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const user_controller = require("../controllers/userController")
const JWT = require("../jwt.js");

// Routes all use JWT authentication, and are handled in the upload controller

router.get("/", user_controller.user_list);

router.post("/create", JWT.authenticateToken, user_controller.user_create_post);

router.post("/delete/:id", JWT.authenticateToken, user_controller.user_delete_post);

router.post("/update/:id/", JWT.authenticateToken, user_controller.user_update_post);

router.get("/select/:id", JWT.authenticateToken, user_controller.user_select);

router.get("/uploads/:id", JWT.authenticateToken, user_controller.upload_list);

router.post("/login", user_controller.user_login_post);

module.exports = router;
