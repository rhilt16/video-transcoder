var express = require('express');
var router = express.Router();
const asyncHandler = require("express-async-handler");
const user_controller = require("../controllers/userController")
const JWT = require("../jwt.js");


/* GET users listing. */
router.get("/", user_controller.user_list);


// POST request for creating Author.
router.post("/create", user_controller.user_create_post);


// POST request to delete Author.
router.post("/:id/delete", JWT.authenticateToken, user_controller.user_delete_post);


// POST request to update Author.
router.post("/:id/update", JWT.authenticateToken, user_controller.user_update_post);

// GET request for one Author.
router.get("/:id", JWT.authenticateToken, user_controller.user_select);


router.post("/login", user_controller.user_login_post);

module.exports = router;
